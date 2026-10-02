import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// ── Receiver fetches their active transfer ──
router.get('/me/transfer', requireAuth, requireRole('receiver'), (req, res) => {
  const t = db.prepare(`
    SELECT * FROM transfers
    WHERE receiver_phone = ? AND status IN ('SENT','IN_TRANSIT','READY_TO_COLLECT')
    ORDER BY created_at DESC LIMIT 1
  `).get(req.user.phone);

  if (!t) return res.json({ ok: true, transfer: null });

  res.json({
    ok: true,
    transfer: {
      ref: t.ref,
      status: t.status,
      amount: t.amount,
      fee: t.fee,
      rate: t.rate,
      receiverGets: t.receiver_gets,
      sendCurrency: t.send_currency,
      receiveCurrency: t.receive_currency,
      attemptsLeft: t.attempts_left,
      unlockedAt: t.unlocked_at
    }
  });
});

export default router;