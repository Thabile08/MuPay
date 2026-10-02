import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import { validatePhone } from '../utils/validation';
import { formatMoney, getRate } from '../utils/currencies';

import { COUNTRIES, getCountry, normalizePhone } from '../utils/countries';
export default function SenderFlow() {
  const {
    t,
    senderPhone, setSenderPhone,
    senderVerified, setSenderVerified,
    senderOtp, setSenderOtp,
    senderPin, setSenderPin,
    senderView, setSenderView,
    sendCurrency, receiveCurrency,
    transfer
  } = useApp();
  const { createTransfer, reset } = useTransfer();

  // ── Verify screen ──
  const [phone, setPhone] = useState('');
  const [typedOtp, setTypedOtp] = useState('');
  const [verifyErr, setVerifyErr] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [countryCode, setCountryCode] = useState('ZW');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');
  // ── PIN screen ──
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pinErr, setPinErr] = useState('');

  // ── Amount screen ──
  const [amount, setAmount] = useState(200);
  const [receiverPhone, setReceiverPhone] = useState('');

  // ── Copy state ──
  const [copied, setCopied] = useState(false);

  const sendOtp = () => {
    const v = validatePhone(phone);
    if (!v.ok) { setVerifyErr(t('accountInvalidNumeric')); return; }
    const code = String(Math.floor(Math.random() * 900000 + 100000));
    setSenderOtp(code);
    setSenderPhone(v.normalized);
    setOtpSent(true);
    setVerifyErr('');
  };

  const confirmOtp = () => {
    if (typedOtp === senderOtp) {
      setSenderVerified(true);
      setSenderView('pin');
    } else {
      setVerifyErr(t('otpIncorrect'));
    }
  };

  const savePin = () => {
    if (pin1.length !== 4) { setPinErr(t('senderPinLength')); return; }
    if (pin1 !== pin2) { setPinErr(t('senderPinMismatch')); return; }
    if (/^(0000|1111|1234|4321)$/.test(pin1)) { setPinErr(t('senderPinWeak')); return; }
    setSenderPin(pin1);
    setPinErr('');
    setSenderView('amount');
  };

  const submitTransfer = () => {
    if (!amount || !receiverPhone) return;
    createTransfer({
      amount,
      country: 'ZW',
      recipient: receiverPhone,
      pin: senderPin
    });
    setSenderView('share');
  };

  const shareText =
    `MuPay transfer\n` +
    `PIN: ${senderPin}\n` +
    `Withdrawal number: ${transfer?.withdrawalNumber}\n` +
    `Amount: ${formatMoney(transfer?.receiverGets ?? 0, transfer?.receiveCurrency)}\n` +
    `Collect at any Mukuru agent.`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const startAnother = () => {
  reset();
  setSenderView('amount');
  setAmount(200);
  setPhoneDigits('');
  setPhoneError('');
  setCountryCode('ZW');
};

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  if (!senderVerified) {
    return (
      <div className="sender-card">
        <div className="verify-icon">🔐</div>
        <h3>{t('senderVerifyTitle')}</h3>
        <p className="verify-sub">{t('senderVerifySubtitle')}</p>

        {!otpSent && (
          <>
            <label className="field-label">{t('yourPhone')}</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0771234567"
            />
            <button className="collect-btn" onClick={sendOtp}>
              {t('sendCode')}
            </button>
          </>
        )}

        {otpSent && (
          <>
            <label className="field-label">{t('enterOtp')}</label>
            <input
              value={typedOtp}
              onChange={(e) => setTypedOtp(e.target.value)}
              inputMode="numeric"
              maxLength={6}
            />
            <div className="demo-hint">{t('demoOtpHint', { code: senderOtp })}</div>
            <button className="collect-btn" onClick={confirmOtp}>
              {t('verifyBtn')}
            </button>
          </>
        )}

        {verifyErr && <div className="error-text">{verifyErr}</div>}
      </div>
    );
  }

  if (senderView === 'pin') {
    return (
      <div className="sender-card">
        <h3>{t('senderCreatePin')}</h3>
        <p className="verify-sub">{t('senderCreatePinDesc')}</p>

        <label className="field-label">{t('senderPinLabel')}</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin1}
          onChange={(e) => setPin1(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
        />

        <label className="field-label">{t('senderPinConfirm')}</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin2}
          onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
        />

        {pinErr && <div className="error-text">{pinErr}</div>}

        <button className="collect-btn" onClick={savePin}>
          {t('senderContinue')}
        </button>
      </div>
    );
  }

  if (senderView === 'amount') {
  const rate = getRate(sendCurrency, receiveCurrency);
  const fee = amount <= 100 ? 2 : amount <= 500 ? 5 : 8;
  const payout = (amount - fee) * rate;
  const country = getCountry(countryCode);

  const onDigitsChange = (e) => {
    // keep only digits, cap at country's expected length
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, country.digits);
    setPhoneDigits(cleaned);
    setPhoneError('');
  };

  const submit = () => {
    const parsed = normalizePhone(phoneDigits, countryCode);
    if (!parsed.ok) {
      setPhoneError(
        parsed.reason === 'length'
          ? t('phoneLengthError', { n: country.digits })
          : t('phoneInvalid')
      );
      return;
    }
    createTransfer({
      amount,
      country: countryCode,
      recipient: parsed.e164,             // store as +263771234567
      recipientDigits: parsed.digits,     // keep the local part for display
      recipientCountry: countryCode,
      pin: senderPin
    });
    setSenderView('share');
  };

  return (
    <div className="sender-card">
      <h3>{t('senderAmountTitle')}</h3>

      <label className="field-label">{t('senderAmountLabel')}</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <label className="field-label">{t('senderReceiverPhone')}</label>

      <div className="phone-row">
        <select
          className="country-select"
          value={countryCode}
          onChange={(e) => {
            setCountryCode(e.target.value);
            setPhoneDigits('');
            setPhoneError('');
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
          value={phoneDigits}
          onChange={onDigitsChange}
          inputMode="numeric"
          placeholder={t('phonePlaceholder')}
          maxLength={country.digits}
        />
      </div>

      <div className="phone-hint">
        {country.flag} {country.name} · {country.dial}
        {' · '}
        {phoneDigits.length}/{country.digits} {t('phoneDigitsHint', { n: country.digits })}
      </div>

      {phoneError && <div className="error-text">{phoneError}</div>}

      <div className="fee-box">
        <div><strong>{t('fee')}:</strong> R{fee}</div>
        <div><strong>{t('rate')}:</strong> 1 {sendCurrency} = {rate} {receiveCurrency}</div>
        <div><strong>{t('receiverGets')}:</strong> {formatMoney(payout, receiveCurrency)}</div>
      </div>

      <button
        className="collect-btn"
        disabled={phoneDigits.length !== country.digits}
        onClick={submit}
      >
        {t('senderConfirm')}
      </button>
    </div>
  );
}

  if (senderView === 'share') {
    return (
      <div className="sender-card">
        <div className="sms-header">✅ {t('sent')}</div>
        <h3>{t('senderShareTitle')}</h3>

        <div className="pickup">
          <div className="pickup-label">{t('senderShare1')}</div>
          <div className="pickup-code">••••</div>
          <div className="pickup-sub">({t('senderPinLabel')})</div>
        </div>

        <div className="pickup">
          <div className="pickup-label">{t('senderShare2')}</div>
          <div className="pickup-code">{transfer?.withdrawalNumber}</div>
          <div className="pickup-sub">{t('withdrawalNumberHint')}</div>
        </div>

        <pre className="share-text">{shareText}</pre>

        <button className="collect-btn" onClick={copyShare}>
          {copied ? t('senderShareCopied') : t('senderShareSms')}
        </button>

        <a
          className="ghost-btn"
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
        >
          {t('senderShareVia')}
        </a>

        <button className="ghost-btn" onClick={startAnother}>
          {t('senderSendAnother')}
        </button>
      </div>
    );
  }

  return null;
}