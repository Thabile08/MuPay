import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

// 6-char base32 + check digit (same alphabet as frontend)
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateRef() {
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum = (sum * 31 + ALPHABET.indexOf(code[i])) % 37;
  }
  return `MK-${code}-${ALPHABET[sum % ALPHABET.length]}`;
}

export function generateOtp() {
  const n = crypto.randomInt(0, 1000000);
  return String(n).padStart(6, '0');
}

export async function hashPin(pin) {
  return bcrypt.hash(String(pin), 10);
}

export async function verifyPin(pin, hash) {
  return bcrypt.compare(String(pin), hash);
}

export function signToken(payload, secret, expiresIn = '2h') {
  // Lazy import to avoid top-level jwt import in crypto.js
  return import('jsonwebtoken').then(({ default: jwt }) =>
    jwt.sign(payload, secret, { expiresIn })
  );
}