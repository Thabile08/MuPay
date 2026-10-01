import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import FeeBreakdown from './FeeBreakdown';
import TransactionStatus from './TransactionStatus';

const COUNTRIES = ['ZW', 'MW', 'ZM', 'MZ', 'KE'];

export default function USSDInterface() {
  const { t, offline, queued } = useApp();
  const { transfer, createTransfer } = useTransfer();

  const [step, setStep] = useState('dial');
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('ZW');
  const [recipient, setRecipient] = useState('');
  const [input, setInput] = useState('');

  const reset = () => {
    setStep('dial');
    setAmount('');
    setCountry('ZW');
    setRecipient('');
    setInput('');
  };

  const handleMenu = (val) => {
    if (val === '1') setStep('amt');
    else if (val === '2') setStep('status');
    else setStep('dial');
    setInput('');
  };

  const handleAmt = () => {
    if (!input || isNaN(Number(input))) return;
    setAmount(input);
    setInput('');
    setStep('ctry');
  };

  const handleCtry = () => {
    const idx = Number(input) - 1;
    if (idx < 0 || idx >= COUNTRIES.length) return;
    setCountry(COUNTRIES[idx]);
    setInput('');
    setStep('recipient');
  };

  const handleRecipient = () => {
    if (!input) return;
    setRecipient(input);
    setInput('');
    setStep('conf');
  };

  const handleConfirm = (val) => {
    if (val === '1') {
      createTransfer({ amount: Number(amount), country, recipient });
      setStep('status');
    } else {
      setStep('done');
    }
    setInput('');
  };

  const render = () => {
    switch (step) {
      case 'dial':
        return (
          <div className="ussd-content">
            <p className="ussd-line">&gt; {t('ussdDial')}</p>
            <button onClick={() => setStep('menu')}>{t('ussdDial')}</button>
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
            <p className="ussd-line">{t('ussdEnterAmount')}</p>
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
            <pre className="ussd-text">
              {t('ussdConfirm', {
                amount,
                fee: transfer?.fee ?? '...',
                rate: transfer?.rate ?? '...',
                receiverGets: transfer?.receiverGets?.toFixed(2) ?? '...'
              })}
            </pre>
            <FeeBreakdown amount={Number(amount)} country={country} />
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
    }
  };

  return <div className="ussd-screen">{render()}</div>;
}