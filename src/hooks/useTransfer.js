import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockApi } from '../api/mockApi';

const STAGES = ['SENT', 'IN_TRANSIT', 'READY_TO_COLLECT', 'COLLECTED'];

export function useTransfer() {
  const { transfer, setTransfer, status, setStatus, offline, setQueued } = useApp();
  const [ref, setRef] = useState(null);

  const createTransfer = ({ amount, country, recipient }) => {
    const fee = mockApi.getFee(amount);
    const rate = mockApi.getRate(country);
    const receiverGets = (amount - fee) * rate;
    const newRef = mockApi.generateRef();

    const newTransfer = {
      amount, country, recipient, fee, rate, receiverGets, ref: newRef
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

  const reset = () => {
    setTransfer(null);
    setStatus(null);
    setQueued(false);
    setRef(null);
  };

  return { transfer, status, ref, createTransfer, advanceStatus, reset, STAGES };
}