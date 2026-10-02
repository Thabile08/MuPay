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

  // ───── Currency pair ─────
  const [sendCurrency, setSendCurrency] = useState('ZAR');
  const [receiveCurrency, setReceiveCurrency] = useState('USD');

  // ───── Receiver identity ─────
  const [receiverPhone, setReceiverPhone] = useState(null);
  const [receiverVerified, setReceiverVerified] = useState(false);
  const [otp, setOtp] = useState(null);

  // ───── Sender identity + PIN ─────
  const [senderPhone, setSenderPhone] = useState(null);
  const [senderVerified, setSenderVerified] = useState(false);
  const [senderOtp, setSenderOtp] = useState(null);
  const [senderPin, setSenderPin] = useState(null);         // what Thandi chose
  const [senderView, setSenderView] = useState('verify');   // verify|pin|amount|share

  // ───── Receiver unlock ─────
  const [receiverUnlocked, setReceiverUnlocked] = useState(false);
  const [receiverAttempts, setReceiverAttempts] = useState(3);

  // ───── Choice + bank ─────
  const [isMukuruAccount, setIsMukuruAccount] = useState(true);
  const [receiverChoice, setReceiverChoice] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  // ───── Locks + audit ─────
  const [collected, setCollected] = useState(false);
  const [actionLog, setActionLog] = useState([]);
  const [senderNotifiedAt, setSenderNotifiedAt] = useState(null);

  const t = (key, vars = {}) => {
    let str = T[lang][key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
  };

  useEffect(() => {
    if (!offline && queued && transfer) {
      setStatus('SENT');
      setQueued(false);
    }
  }, [offline, queued, transfer]);

  useEffect(() => {
    if (offline) return;
    const pending = readPending();
    pending.forEach((p) => {
      if (p.type === 'RECEIVER_COLLECTED') dequeue(p.ref);
    });
  }, [offline]);

  useEffect(() => {
    setReceiverChoice(null);
    setBankDetails(null);
    setCollected(false);
    setSenderNotifiedAt(null);
    setActionLog([]);
    setReceiverUnlocked(false);
    setReceiverAttempts(3);
  }, [transfer?.ref]);

  const value = {
    lang, setLang,
    lowData, setLowData,
    offline, setOffline,
    mode, setMode,
    transfer, setTransfer,
    status, setStatus,
    queued, setQueued,

    sendCurrency, setSendCurrency,
    receiveCurrency, setReceiveCurrency,

    receiverPhone, setReceiverPhone,
    receiverVerified, setReceiverVerified,
    otp, setOtp,

    senderPhone, setSenderPhone,
    senderVerified, setSenderVerified,
    senderOtp, setSenderOtp,
    senderPin, setSenderPin,
    senderView, setSenderView,

    receiverUnlocked, setReceiverUnlocked,
    receiverAttempts, setReceiverAttempts,

    isMukuruAccount, setIsMukuruAccount,
    receiverChoice, setReceiverChoice,
    bankDetails, setBankDetails,

    collected, setCollected,
    actionLog, setActionLog,
    senderNotifiedAt, setSenderNotifiedAt,

    t, LANGS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);