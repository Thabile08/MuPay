// Web Crypto based — no external dependency.
// 6-char base32 code + 4-char check-digit suffix. Non-guessable,
// one-time use, and easy to read aloud to an agent.

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1

export function generateSecureRef() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];

  // Simple mod-37 check digit derived from code
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum = (sum * 31 + ALPHABET.indexOf(code[i])) % 37;
  }
  const check = ALPHABET[sum % ALPHABET.length];
  return `MK-${code}-${check}`;
}

export function verifyRefChecksum(ref) {
  if (!/^MK-[A-Z2-9]{6}-[A-Z2-9]$/.test(ref)) return false;
  const code = ref.slice(3, 9);
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum = (sum * 31 + ALPHABET.indexOf(code[i])) % 37;
  }
  return ALPHABET[sum % ALPHABET.length] === ref.slice(10);
}

// One-time-use guard: hashes ref + receiver ID into a per-session token
export async function hashBinding(ref, receiverId) {
  const data = new TextEncoder().encode(`${ref}::${receiverId}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}