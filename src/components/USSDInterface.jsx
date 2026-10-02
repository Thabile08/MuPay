import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import { getQuote, quoteText } from '../utils/quote';
import FeeBreakdown from './FeeBreakdown';
import TransactionStatus from './TransactionStatus';
import Dialer from './Dialer';

const COUNTRIES = ['ZW', 'MW', 'ZM', 'MZ', 'KE'];

export default function USSDInterface() {
  const { t, queued, sendCurrency, receiveCurrency } = useApp();
  const { createTransfer } = useTransfer();

  const [step, setStep] = useState('dial');
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('ZW');
  const [recipient, setRecipient] = useState('');
  const [quote, setQuote] = useState(null); // locked when the confirm screen opens
  const [input, setInput] = useState('');

  const reset = () => {
    setStep('dial');
    setAmount('');
    setCountry('ZW');
    setRecipient('');
    setQuote(null);
    setInput('');
  };

  const handleMenu = (val) => {
    if (val === '1') setStep('amt');
    else if (val === '2') setStep('status');
    else setStep('dial');
    setInput('');
  };

  const handleAmt = () => {
    if (!input || isNaN(Number(input)) || Number(input) <= 0) return;
    setAmount(input);
    setInput('');
    setStep('ctry');
  };

  const handleCtry = () => {
    const idx = Number(input) - 1;
    if (!Number.isInteger(idx) || idx < 0 || idx >= COUNTRIES.length) return;
    setCountry(COUNTRIES[idx]);
    setInput('');
    setStep('recipient');
  };

  const handleRecipient = () => {
    if (!input) return;
    setRecipient(input);
    // Work out the quote ONCE, now. The sender sees it on the confirm screen
    // and the transfer is created from this exact quote.
    setQuote(getQuote(Number(amount), sendCurrency, receiveCurrency));
    setInput('');
    setStep('conf');
  };

  // Nothing is created until the sender picks 1 (Confirm).
  const handleConfirm = (val) => {
    if (val === '1') {
      createTransfer({ amount: Number(amount), country, recipient, quote });
      setStep('status');
    } else if (val === '2') {
      setQuote(null);
      setStep('done');
    }
    setInput('');
  };

  const render = () => {
    switch (step) {
      case 'dial':
  return (
    <div className="ussd-content">
      <Dialer
        target="*120#"
        onDial={(code) => {
          // code === '*120#'
          setStep('menu');
        }}
        onCancel={() => {
          // optional: go back to the previous screen
          // setStep('done');
        }}
      />
    </div>
  );
      case 'menu':
        return (
          <div className="ussd-content">
            <pre className="ussd-text">{t('ussdMenu')}</pre>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1}
              autoFocus
            />
            <button onClick={() => handleMenu(input)}>OK</button>
          </div>
        );
      case 'amt':
        return (
          <div className="ussd-content">
            <p className="ussd-line">{t('ussdEnterAmount', { currency: sendCurrency })}</p>
            <input value={input} onChange={(e) => setInput(e.target.value)} inputMode="numeric" autoFocus />
            <button onClick={handleAmt}>OK</button>
          </div>
        );
      case 'ctry':
        return (
          <div className="ussd-content">
            <pre className="ussd-text">{t('ussdEnterCountry')}</pre>
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1} autoFocus />
            <button onClick={handleCtry}>OK</button>
          </div>
        );
      case 'recipient':
        return (
          <div className="ussd-content">
            <p className="ussd-line">{t('ussdEnterRecipient')}</p>
            <input value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
            <button onClick={handleRecipient}>OK</button>
          </div>
        );
      case 'conf':
        return (
          <div className="ussd-content">
            <pre className="ussd-text">{t('ussdConfirm', quoteText(quote))}</pre>
            <FeeBreakdown quote={quote} />
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1} autoFocus />
            <button onClick={() => handleConfirm(input)}>OK</button>
          </div>
        );
      case 'status':
        return (
          <div className="ussd-content">
            {queued && (
              <pre className="ussd-text">{t('offlineSaved')}</pre>
            )}
            {!queued && <TransactionStatus variant="ussd" />}
          </div>
        );
      case 'done':
        return (
          <div className="ussd-content">
            <pre className="ussd-text">{t('ussdCancelled')}</pre>
            <button onClick={reset}>Start again</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="ussd-screen">{render()}</div>;
}
