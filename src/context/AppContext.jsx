import { createContext, useContext, useState, useEffect } from 'react';
import { T, LANGS } from '../i18n/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [lowData, setLowData] = useState(false);
  const [offline, setOffline] = useState(false);
  const [mode, setMode] = useState('ussd'); // 'ussd' | 'whatsapp'
  const [transfer, setTransfer] = useState(null);
  const [status, setStatus] = useState(null);
  const [queued, setQueued] = useState(false);

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

  const value = {
    lang, setLang,
    lowData, setLowData,
    offline, setOffline,
    mode, setMode,
    transfer, setTransfer,
    status, setStatus,
    queued, setQueued,
    t, LANGS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);