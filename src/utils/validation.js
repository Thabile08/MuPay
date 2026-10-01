export const BANK_RULES = {
  'CBZ Bank':      { min: 9,  max: 12, numeric: true },
  'Steward Bank':  { min: 10, max: 12, numeric: true },
  'FBC Bank':      { min: 10, max: 13, numeric: true },
  'ZB Bank':       { min: 9,  max: 11, numeric: true },
  'EcoCash':       { min: 10, max: 10, numeric: true, prefix: '07' },
  'NMB Bank':      { min: 10, max: 12, numeric: true },
  'Stanbic':       { min: 9,  max: 11, numeric: true },
  'Other':         { min: 6,  max: 20, numeric: false }
};

export function validateAccount(bank, account) {
  const rule = BANK_RULES[bank];
  if (!rule) return { ok: false, reason: 'unknown_bank' };
  const value = account.trim();
  if (value.length < rule.min || value.length > rule.max) {
    return { ok: false, reason: 'length' };
  }
  if (rule.numeric && !/^\d+$/.test(value)) {
    return { ok: false, reason: 'numeric' };
  }
  if (rule.prefix && !value.startsWith(rule.prefix)) {
    return { ok: false, reason: 'prefix' };
  }
  return { ok: true };
}

// Zimbabwe mobile: +263 or 0 + 7 + 8 digits. Loose but practical.
export function validatePhone(raw) {
  const digits = raw.replace(/[^\d]/g, '');
  if (/^2637\d{8}$/.test(digits)) return { ok: true, normalized: '+263' + digits.slice(3) };
  if (/^07\d{8}$/.test(digits))   return { ok: true, normalized: '+263' + digits.slice(1) };
  return { ok: false, reason: 'phone' };
}

export function generateOtp() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1000000).padStart(6, '0');
}