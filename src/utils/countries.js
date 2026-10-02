export const COUNTRIES = [
  { code: 'ZW', name: 'Zimbabwe',    dial: '+263', flag: '🇿🇼', digits: 9 },
  { code: 'MW', name: 'Malawi',      dial: '+265', flag: '🇲🇼', digits: 9 },
  { code: 'ZM', name: 'Zambia',      dial: '+260', flag: '🇿🇲', digits: 9 },
  { code: 'MZ', name: 'Mozambique',  dial: '+258', flag: '🇲🇿', digits: 9 },
  { code: 'KE', name: 'Kenya',       dial: '+254', flag: '🇰🇪', digits: 9 },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', digits: 9 }
];

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function normalizePhone(raw, countryCode) {
  const c = getCountry(countryCode);
  let digits = String(raw).replace(/\D/g, '');

  const dialDigits = c.dial.replace('+', '');
  if (digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
  while (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== c.digits) {
    return { ok: false, reason: 'length', expected: c.digits, got: digits.length };
  }
  return { ok: true, digits, e164: `${c.dial}${digits}` };
}