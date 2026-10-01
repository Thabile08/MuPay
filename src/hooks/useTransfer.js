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
    sendCurrency, receiveCurrency
  } = useApp();
  const [ref, setRef] = useState(null);

  const createTransfer = ({ amount, country, recipient }) => {
    const fee = amount <= 100 ? 2 : amount <= 500 ? 5 : 8;
    const rate = getRate(sendCurrency, receiveCurrency);
    const receiverGets = (amount - fee) * rate;

    const newRef = generateSecureRef();
    const newTransfer = {
      amount,
      country,
      recipient,
      fee,
      rate,
      receiverGets,
      sendCurrency,
      receiveCurrency,
      ref: newRef
    };

    setTransfer(newTransfer);
    setRef(newRef);

    if (offline) {
      setQueued(true);
      setStatus(null);
    } else {
      setStatus('SENT');
    }
    return newTransfer;
  };

  const advanceStatus = () => {
    const idx = STAGES.indexOf(status);
    if (idx >= 0 && idx < STAGES.length - 1) {
      setStatus(STAGES[idx + 1]);
    }
  };

  // Receiver chooses how to receive. Guarded so it can't fire twice.
  // choice: 'cash' | 'bank'
  // extras: { bank, account } when choice === 'bank'
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

    // If offline, queue for later sync
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
    setTransfer(null);
    setStatus(null);
    setQueued(false);
    setRef(null);
    setReceiverChoice(null);
    setBankDetails(null);
    setCollected(false);
    setSenderNotifiedAt(null);
    setActionLog([]);
  };

  return {
    transfer, status, ref,
    createTransfer, advanceStatus, markCollected, reset, STAGES
  };
}