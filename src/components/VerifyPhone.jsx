import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validatePhone, generateOtp } from '../utils/validation';

export default function VerifyPhone() {
  const { t, setReceiverPhone, setOtp, otp, setReceiverVerified } = useApp();
  const [phone, setPhone] = useState('');
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const v = validatePhone(phone);
    if (!v.ok) { setError(t('phoneInvalid')); return; }
    const code = generateOtp();
    setOtp(code);
    setReceiverPhone(v.normalized);
    setSent(true);
    setError('');
  };

  const handleVerify = () => {
    if (typed === otp) {
      setReceiverVerified(true);
    } else {
      setError(t('otpIncorrect'));
    }
  };

  return (
    <div className="verify-screen">
      <div className="verify-icon">🔐</div>
      <h3>{t('verifyTitle')}</h3>
      <p className="verify-sub">{t('verifySubtitle')}</p>

      {!sent && (
        <>
          <label className="field-label">{t('yourPhone')}</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0771234567 or +263771234567"
          />
          <button className="collect-btn" onClick={handleSend}>
            {t('sendCode')}
          </button>
        </>
      )}

      {sent && (
        <>
          <label className="field-label">{t('enterOtp')}</label>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
          />
          <div className="demo-hint">{t('demoOtpHint', { code: otp })}</div>
          <button className="collect-btn" onClick={handleVerify}>
            {t('verifyBtn')}
          </button>
        </>
      )}

      {error && <div className="error-text">{error}</div>}
    </div>
  );
}