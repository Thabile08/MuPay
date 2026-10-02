import { Router } from 'express';
import db from '../db.js';
import { generateRef, hashPin, verifyPin } from '../crypto.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// ── Fee + rate (in production, call Mukuru pricing service) ──
const FX = {
  ZAR: { ZAR: 1, USD: 0.054, GBP: 0.043, EUR: 0.050, ZWL: 19.5, MWK: 92, ZMW: 1.4, MZN: 3.4 },
  USD: { ZAR: 18.5, USD: 1, GBP: 0.79, EUR: 0.92, ZWL: 361, MWK: 1700, ZMW: 26, MZN: 63 },
  GBP: { ZAR: 23.4, USD: 1.27, GBP: 1, EUR: 1.17, ZWL: 456, MWK: 2150, ZMW: 33, MZN: 80 },
  EUR: { ZAR: 20, USD: 1.09, GBP: 0.86, EUR: 1, ZWL: 390, MWK: 1840, ZMW: 28, MZN: 68 },
  ZWL: { ZAR: 0.051, USD: 0.0028, GBP: 0.0022, EUR: 0.0026, ZWL: 1, MWK: 4.7, ZMW: 0.072, MZN: 0.17 },
  MWK: { ZAR: 0.011, USD: 0.00059, GBP: 0.00047, EUR: 0.00054, ZWL: 0.21, MWK: 1, ZMW: 0.015, MZN: 0.037 },
  ZMW: { ZAR: 0.72, USD: 0.038, GBP: 0.030, EUR: 0.035, ZWL: 13.9, MWK: 65, ZMW: 1, MZN: 2.4 },
  MZN: { ZAR: 0.29, USD: 0.016, GBP: 0.0125, EUR: 0.0147, ZWL: 5.8, MWK: 27, ZMW: 0.42, MZN: 1 }
};

function getRate(from, to) {
  return FX[from]?.[to] ?? 1;
}

function getFee(amount) {
  if (amount <= 100) return 2;
  if (amount <= 500) return 5;
  return 8;
}

// ── Create a transfer (sender only) ──
router.post('/', requireAuth, requireRole('sender'), async (req, res) => {
  const {
    receiverPhone,
    receiverCountry,
    amount,
    pin,
    sendCurrency = 'ZAR',
    receiveCurrency = 'USD'
  } = req.body;

  if (!receiverPhone || !amount || !pin) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (!/^\d{4}$/.test(String(pin))) {
    return res.status(400).json({ error: 'invalid_pin_format' });
  }

  const fee = getFee(amount);
  const rate = getRate(sendCurrency, receiveCurrency);
  const receiverGets = (amount - fee) * rate;
  const ref = generateRef();
  const pinHash = await hashPin(pin);

  db.prepare(`
    INSERT INTO transfers (
      ref, sender_id, receiver_phone, receiver_country,
      amount, fee, rate, receiver_gets,
      send_currency, receive_currency,
      pin_hash, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SENT', ?)
  `).run(
    ref, req.user.id, receiverPhone, receiverCountry,
    amount, fee, rate, receiverGets,
    sendCurrency, receiveCurrency,
    pinHash, Date.now()
  );

  db.prepare(`
    INSERT INTO actions (transfer, actor, action, at)
    VALUES (?, ?, 'created', ?)
  `).run(ref, req.user.id, Date.now());

  res.status(201).json({
    ok: true,
    ref,
    withdrawalNumber: ref,
    amount,
    fee,
    rate,
    receiverGets,
    sendCurrency,
    receiveCurrency,
    status: 'SENT',
    // In production: send SMS to sender with pin reminder + ref
  });
});

// ── Get transfer by ref (sender or receiver) ──
router.get('/:ref', requireAuth, (req, res) => {
  const t = db.prepare('SELECT * FROM transfers WHERE ref = ?').get(req.params.ref);
  if (!t) return res.status(404).json({ error: 'not_found' });

  const isSender = t.sender_id === req.user.id;
  const isReceiver = t.receiver_phone === req.user.phone;
  if (!isSender && !isReceiver) return res.status(403).json({ error: 'forbidden' });

  res.json({
    ref: t.ref,
    status: t.status,
    amount: t.amount,
    fee: t.fee,
    rate: t.rate,
    receiverGets: t.receiver_gets,
    sendCurrency: t.send_currency,
    receiveCurrency: t.receive_currency,
    receiverPhone: t.receiver_phone,
    receiverCountry: t.receiver_country,
    attemptsLeft: t.attempts_left,
    unlockedAt: t.unlocked_at,
    collectedAt: t.collected_at,
    collectMethod: t.collect_method
  });
});

// ── Unlock with PIN + withdrawal number (receiver only) ──
router.post('/:ref/unlock', requireAuth, requireRole('receiver'), async (req, res) => {
  const { pin, withdrawalNumber } = req.body;
  const t = db.prepare('SELECT * FROM transfers WHERE ref = ?').get(req.params.ref);

  if (!t) return res.status(404).json({ error: 'not_found' });
  if (t.receiver_phone !== req.user.phone) return res.status(403).json({ error: 'wrong_receiver' });
  if (t.status !== 'READY_TO_COLLECT') return res.status(409).json({ error: 'not_ready' });
  if (t.unlocked_at) return res.status(409).json({ error: 'already_unlocked' });
  if (t.attempts_left <= 0) return res.status(429).json({ error: 'too_many_attempts' });

  if (String(withdrawalNumber).toUpperCase() !== t.ref) {
    return res.status(400).json({ error: 'wrong_code' });
  }

  const pinOk = await verifyPin(pin, t.pin_hash);
  if (!pinOk) {
    const left = t.attempts_left - 1;
    db.prepare('UPDATE transfers SET attempts_left = ? WHERE ref = ?').run(left, t.ref);
    return res.status(400).json({ error: 'wrong_pin', attemptsLeft: left });
  }

  db.prepare('UPDATE transfers SET unlocked_at = ? WHERE ref = ?').run(Date.now(), t.ref);
  db.prepare(`
    INSERT INTO actions (transfer, actor, action, at)
    VALUES (?, ?, 'unlocked', ?)
  `).run(t.ref, req.user.id, Date.now());

  res.json({ ok: true, unlocked: true });
});

// ── Collect (cash or bank) ──
router.post('/:ref/collect', requireAuth, requireRole('receiver'), (req, res) => {
  const { method, bankName, bankAccount } = req.body;
  if (!['cash', 'bank'].includes(method)) {
    return res.status(400).json({ error: 'invalid_method' });
  }

  const t = db.prepare('SELECT * FROM transfers WHERE ref = ?').get(req.params.ref);
  if (!t) return res.status(404).json({ error: 'not_found' });
  if (t.receiver_phone !== req.user.phone) return res.status(403).json({ error: 'wrong_receiver' });
  if (!t.unlocked_at) return res.status(409).json({ error: 'not_unlocked' });
  if (t.collected_at) return res.status(409).json({ error: 'already_collected' });

  if (method === 'bank') {
    if (!bankName || !bankAccount) {
      return res.status(400).json({ error: 'missing_bank_details' });
    }
    // per-bank validation could live in util/banks.js
  }

  const now = Date.now();
  db.prepare(`
    UPDATE transfers
    SET status = 'COLLECTED',
        collected_at = ?,
        collect_method = ?,
        bank_name = ?,
        bank_account = ?
    WHERE ref = ?
  `).run(now, method, bankName || null, bankAccount || null, t.ref);

  db.prepare(`
    INSERT INTO actions (transfer, actor, action, at)
    VALUES (?, ?, ?, ?)
  `).run(t.ref, req.user.id, `collected_${method}`, now);

  res.json({
    ok: true,
    ref: t.ref,
    collectedAt: now,
    method,
    senderNotifiedAt: now
  });
});

// ── Demo helper: advance status (SENT → IN_TRANSIT → READY_TO_COLLECT) ──
router.post('/:ref/advance', requireAuth, (req, res) => {
  const t = db.prepare('SELECT * FROM transfers WHERE ref = ?').get(req.params.ref);
  if (!t) return res.status(404).json({ error: 'not_found' });

  const order = ['SENT', 'IN_TRANSIT', 'READY_TO_COLLECT'];
  const idx = order.indexOf(t.status);
  if (idx < 0 || idx === order.length - 1) {
    return res.status(409).json({ error: 'cannot_advance' });
  }
  const next = order[idx + 1];
  db.prepare('UPDATE transfers SET status = ? WHERE ref = ?').run(next, t.ref);
  res.json({ ok: true, status: next });
});

export default router;