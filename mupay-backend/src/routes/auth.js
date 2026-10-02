import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import db from '../db.js';
import { generateOtp } from '../crypto.js';
import { normalizePhone } from '../util/phone.js';

const router = Router();

// ── Shared OTP issuing ──
router.post('/:role/otp', (req, res) => {
  const { role } = req.params;
  if (role !== 'sender' && role !== 'receiver') {
    return res.status(400).json({ error: 'invalid_role' });
  }
  const { phone, country } = req.body;
  const parsed = normalizePhone(phone, country);
  if (!parsed.ok) return res.status(400).json({ error: 'invalid_phone', detail: parsed });

  const code = generateOtp();
  const expiresAt = Date.now() + Number(process.env.OTP_TTL_MS || 300000);

  db.prepare(`
    INSERT INTO otps (phone, role, code, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(parsed.e164, role, code, expiresAt);

  // In production: SMS gateway. For demo we return the code.
  const respond = { ok: true, ttl_ms: Number(process.env.OTP_TTL_MS || 300000) };
  if (process.env.NODE_ENV !== 'production') respond.demo_code = code;
  res.json(respond);
});

// ── OTP verification + user upsert + JWT issue ──
router.post('/:role/verify', (req, res) => {
  const { role } = req.params;
  const { phone, country, code } = req.body;
  const parsed = normalizePhone(phone, country);
  if (!parsed.ok) return res.status(400).json({ error: 'invalid_phone' });

  const row = db.prepare(`
    SELECT * FROM otps
    WHERE phone = ? AND role = ? AND consumed = 0
    ORDER BY id DESC LIMIT 1
  `).get(parsed.e164, role);

  if (!row) return res.status(400).json({ error: 'no_otp' });
  if (row.expires_at < Date.now()) return res.status(400).json({ error: 'otp_expired' });
  if (row.code !== String(code)) return res.status(400).json({ error: 'otp_incorrect' });

  db.prepare('UPDATE otps SET consumed = 1 WHERE id = ?').run(row.id);

  let user = db.prepare('SELECT * FROM users WHERE role = ? AND phone = ?').get(role, parsed.e164);
  if (!user) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO users (id, role, phone, country, verified, created_at)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(id, role, parsed.e164, country, Date.now());
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  } else {
    db.prepare('UPDATE users SET verified = 1 WHERE id = ?').run(user.id);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    ok: true,
    token,
    user: { id: user.id, role: user.role, phone: user.phone, country: user.country }
  });
});

export default router;