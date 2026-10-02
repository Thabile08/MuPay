import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, getCountry, normalizePhone } from '../utils/countries';
import { generateOtp } from '../utils/validation';

export default function VerifyPhone() {
  const { t, setReceiverPhone, setReceiverVerified, setOtp, otp } = useApp();

  const [countryCode, setCountryCode] = useState('ZW');
  const [digits, setDigits] = useState('');
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const country = getCountry(countryCode);

  const onDigitsChange = (e) => {
    const cleaned = e.target.value
      .replace(/\D/g, '')
      .replace(/^0+/, '')            // strip leading zeros
      .slice(-country.digits);       // keep last N digits
    setDigits(cleaned);
    setError('');
  };

  const handleSend = () => {
    const parsed = normalizePhone(digits, countryCode);
    if (!parsed.ok) {
      setError(
        parsed.reason === 'length'
          ? t('phoneLengthError', { n: country.digits })
          : t('phoneInvalid')
      );
      return;
    }
    const code = generateOtp();
    setOtp(code);
    setReceiverPhone(parsed.e164);
    setSent(true);
    setError('');
  };

  const handleVerify = () => {
    if (typed === otp) setReceiverVerified(true);
    else setError(t('otpIncorrect'));
  };

  return (
    <div className="verify-screen">
      <div className="verify-icon">🔐</div>
      <h3>{t('verifyTitle')}</h3>
      <p className="verify-sub">{t('verifySubtitle')}</p>

      {!sent && (
        <>
          <label className="field-label">{t('yourPhone')}</label>

          <div className="phone-row">
            <select
              className="country-select"
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                setDigits('');
                setError('');
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>

            <input
              className="phone-input"
              value={digits}
              onChange={onDigitsChange}
              inputMode="numeric"
              maxLength={country.digits}
              placeholder="771234567"
              autoFocus
            />
          </div>

          <div className="phone-hint">
            {country.flag} {country.name} · {country.dial} ·{' '}
            {digits.length}/{country.digits} digits
          </div>

          {error && <div className="error-text">{error}</div>}

          <button
            className="collect-btn"
            disabled={digits.length !== country.digits}
            onClick={handleSend}
          >
            {t('sendCode')}
          </button>
        </>
      )}

      {sent && (
        <>
          <label className="field-label">{t('enterOtp')}</label>
          <input
            value={typed}
            onChange={(e) =>
              setTyped(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            autoFocus
          />
          <div className="demo-hint">{t('demoOtpHint', { code: otp })}</div>
          <button
            className="collect-btn"
            disabled={typed.length !== 6}
            onClick={handleVerify}
          >
            {t('verifyBtn')}
          </button>
        </>
      )}
    </div>
  );
}