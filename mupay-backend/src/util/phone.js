const DIALS = {
  ZW: { dial: '+263', digits: 9 },
  MW: { dial: '+265', digits: 9 },
  ZM: { dial: '+260', digits: 9 },
  MZ: { dial: '+258', digits: 9 },
  KE: { dial: '+254', digits: 9 },
  ZA: { dial: '+27',  digits: 9 }
};

export function normalizePhone(raw, country) {
  const meta = DIALS[country];
  if (!meta) return { ok: false, reason: 'unknown_country' };

  let digits = String(raw).replace(/\D/g, '');
  const dialDigits = meta.dial.replace('+', '');
  if (digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
  while (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== meta.digits) {
    return { ok: false, reason: 'length', expected: meta.digits, got: digits.length };
  }
  return { ok: true, e164: `${meta.dial}${digits}` };
}