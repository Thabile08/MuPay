export const COUNTRIES = [
  { code: 'ZW', name: 'Zimbabwe',   dial: '+263', flag: '🇿🇼', digits: 9 },
  { code: 'MW', name: 'Malawi',     dial: '+265', flag: '🇲🇼', digits: 9 },
  { code: 'ZM', name: 'Zambia',     dial: '+260', flag: '🇿🇲', digits: 9 },
  { code: 'MZ', name: 'Mozambique', dial: '+258', flag: '🇲🇿', digits: 9 },
  { code: 'KE', name: 'Kenya',      dial: '+254', flag: '🇰🇪', digits: 9 },
];

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

// Accepts "0771234567", "771234567", "+263771234567", "263 77 123 4567"
// Returns { ok, digits, e164 } or { ok: false, reason }
export function normalizePhone(raw, country) {
  const c = getCountry(country);
  let digits = raw.replace(/\D/g, '');

  // Strip a leading country dial if the user pasted the full number
  const dialDigits = c.dial.replace('+', '');
  if (digits.startsWith(dialDigits)) {
    digits = digits.slice(dialDigits.length);
  }

  // Strip a leading 0 (local format)
  while (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== c.digits) {
    return { ok: false, reason: 'length', expected: c.digits, got: digits.length };
  }
  return {
    ok: true,
    digits,
    e164: `${c.dial}${digits}`
  };
}