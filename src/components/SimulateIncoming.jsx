import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';

export default function SimulateIncoming() {
  const { t, status, transfer, sendCurrency } = useApp();
  const { createTransfer, reset, advanceStatus } = useTransfer();

  const [amount, setAmount] = useState(200);
  const [sender, setSender] = useState('Thandi M.');

  const hasActiveTransfer = !!transfer;

  // Auto-drive SENT → IN_TRANSIT → READY_TO_COLLECT for the demo.
  // (advanceStatus stops at READY_TO_COLLECT; only the receiver can finish.)
  // advanceStatus is deliberately not a dependency: it is a new function on
  // every render, which would keep restarting these timers.
  useEffect(() => {
    if (!transfer) return;
    if (status === 'SENT') {
      const a = setTimeout(() => advanceStatus(), 900);
      return () => clearTimeout(a);
    }
    if (status === 'IN_TRANSIT') {
      const b = setTimeout(() => advanceStatus(), 1400);
      return () => clearTimeout(b);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, transfer]);

  return (
    <div className="simulate-panel">
      <div className="simulate-title">{t('send')}</div>
      <div className="simulate-hint">{t('hint')}</div>

      {!hasActiveTransfer && (
        <>
          <label className="sim-label">{t('incomingFrom')}</label>
          <input
            className="sim-input"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />

          <label className="sim-label">{t('amountLabel')} ({sendCurrency})</label>
          <input
            className="sim-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <button
            className="sim-btn"
            disabled={!(amount > 0)}
            onClick={() =>
              createTransfer({
                amount,
                country: 'ZW',
                recipient: '0770000000',
                senderName: sender
              })
            }
          >
            {t('simulateIncoming')}
          </button>
        </>
      )}

      {hasActiveTransfer && (
        <button className="sim-btn ghost" onClick={reset}>
          Reset for next demo
        </button>
      )}
    </div>
  );
}
