import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateSecureRef } from '../utils/crypto';
import { enqueue } from '../utils/storage';
import { canAct } from '../utils/actions';
import { getRate } from '../utils/currencies';

const STAGES = ['SENT', 'IN_TRANSIT', 'READY_TO_COLLECT', 'COLLECTED'];

export function useTransfer() {
  const {
    transfer, setTransfer,
    status, setStatus,
    offline, setQueued,
    collected, setCollected,
    setReceiverChoice, setBankDetails,
    setSenderNotifiedAt, setActionLog,
    sendCurrency, receiveCurrency,
    receiverAttempts, setReceiverAttempts,
    setReceiverUnlocked
  } = useApp();
  const [ref, setRef] = useState(null);

  const createTransfer = ({ amount, country, recipient, pin }) => {
    const fee = amount <= 100 ? 2 : amount <= 500 ? 5 : 8;
    const rate = getRate(sendCurrency, receiveCurrency);
    const receiverGets = (amount - fee) * rate;

    const withdrawalNumber = generateSecureRef();   // system-generated code
    const newTransfer = {
      amount, country, recipient,
      fee, rate, receiverGets,
      sendCurrency, receiveCurrency,
      ref: withdrawalNumber,
      withdrawalNumber,
      pin: String(pin)   // sender-chosen PIN
    };

    setTransfer(newTransfer);
    setRef(withdrawalNumber);

    if (offline) { setQueued(true); setStatus(null); }
    else { setStatus('SENT'); }
    return newTransfer;
  };

  const advanceStatus = () => {
    const idx = STAGES.indexOf(status);
    if (idx >= 0 && idx < STAGES.length - 1) setStatus(STAGES[idx + 1]);
  };

  // Receiver enters both codes; only then is money unlocked
  const tryUnlock = (pinInput, codeInput) => {
    if (!transfer) return { ok: false, reason: 'no_transfer' };
    if (receiverAttempts <= 0) return { ok: false, reason: 'too_many_attempts' };

    const pinOk = String(pinInput) === String(transfer.pin);
    const codeOk = codeInput.trim().toUpperCase() === transfer.withdrawalNumber;

    if (!pinOk) {
      const left = receiverAttempts - 1;
      setReceiverAttempts(left);
      return { ok: false, reason: 'wrong_pin', attemptsLeft: left };
    }
    if (!codeOk) {
      return { ok: false, reason: 'wrong_code', attemptsLeft: receiverAttempts };
    }
    setReceiverUnlocked(true);
    return { ok: true };
  };

  const markCollected = (choice, extras = null) => {
    if (collected) return { ok: false, reason: 'already_collected' };
    if (!canAct(status, choice)) return { ok: false, reason: 'invalid_state' };

    setCollected(true);
    setReceiverChoice(choice);
    if (choice === 'bank' && extras) setBankDetails(extras);

    setActionLog((log) => [
      ...log,
      { at: Date.now(), action: choice, ref: transfer?.ref }
    ]);

    if (offline && transfer) {
      enqueue({
        ref: transfer.ref,
        type: 'RECEIVER_COLLECTED',
        choice,
        at: Date.now()
      });
    }

    setStatus('COLLECTED');
    setSenderNotifiedAt(Date.now());
    return { ok: true };
  };

  const reset = () => {
    setTransfer(null); setStatus(null); setQueued(false); setRef(null);
    setReceiverChoice(null); setBankDetails(null);
    setCollected(false); setSenderNotifiedAt(null); setActionLog([]);
    setReceiverUnlocked(false); setReceiverAttempts(3);
  };

  return {
    transfer, status, ref,
    createTransfer, advanceStatus, tryUnlock, markCollected, reset, STAGES
  };
}