import { createContext, useContext, useState, useEffect } from 'react';
import { T, LANGS } from '../i18n/translations';
import { readPending, dequeue } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [lowData, setLowData] = useState(false);
  const [offline, setOffline] = useState(false);
  const [mode, setMode] = useState('ussd');
  const [transfer, setTransfer] = useState(null);
  const [status, setStatus] = useState(null);
  const [queued, setQueued] = useState(false);

  // Receiver identity (item 1)
  const [receiverPhone, setReceiverPhone] = useState(null);
  const [receiverVerified, setReceiverVerified] = useState(false);
  const [otp, setOtp] = useState(null);

  // Choice + bank
  const [isMukuruAccount, setIsMukuruAccount] = useState(true);
  const [receiverChoice, setReceiverChoice] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  // Double-collect lock + action log (items 3, 6)
  const [collected, setCollected] = useState(false);
  const [actionLog, setActionLog] = useState([]);

  // Sender confirmation back (item 7)
  const [senderNotifiedAt, setSenderNotifiedAt] = useState(null);

  const t = (key, vars = {}) => {
    let str = T[lang][key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
  };

  // Offline queue auto-sync
  useEffect(() => {
    if (!offline && queued && transfer) {
      setStatus('SENT');
      setQueued(false);
    }
  }, [offline, queued, transfer]);

  // Reconcile pending items on reconnect (item 5)
  useEffect(() => {
    if (offline) return;
    const pending = readPending();
    pending.forEach((p) => {
      if (p.type === 'RECEIVER_COLLECTED') {
        dequeue(p.ref);
      }
    });
  }, [offline]);

  // Reset per-transfer state on new ref
  useEffect(() => {
    setReceiverChoice(null);
    setBankDetails(null);
    setCollected(false);
    setSenderNotifiedAt(null);
    setActionLog([]);
  }, [transfer?.ref]);

  const value = {
    lang, setLang,
    lowData, setLowData,
    offline, setOffline,
    mode, setMode,
    transfer, setTransfer,
    status, setStatus,
    queued, setQueued,
    // identity
    receiverPhone, setReceiverPhone,
    receiverVerified, setReceiverVerified,
    otp, setOtp,
    // choice
    isMukuruAccount, setIsMukuruAccount,
    receiverChoice, setReceiverChoice,
    bankDetails, setBankDetails,
    // guards + audit
    collected, setCollected,
    actionLog, setActionLog,
    senderNotifiedAt, setSenderNotifiedAt,
    t, LANGS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);