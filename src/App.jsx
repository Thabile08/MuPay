import { useApp } from './context/AppContext';
import USSDInterface from './components/USSDInterface';
import WhatsAppInterface from './components/WhatsAppInterface';
import LanguageToggle from './components/LanguageToggle';
import LowDataMode from './components/LowDataMode';

export default function App() {
  const { t, mode, setMode, lowData, offline, queued } = useApp();

  return (
    <div className={`app ${lowData ? 'low-data' : ''} ${offline ? 'offline' : ''}`}>
      <header>
        <h1>{t('appName')}</h1>
        <p>{t('tagline')}</p>
        <LanguageToggle />
        <LowDataMode />
      </header>

      <nav className="mode-tabs">
        <button
          className={mode === 'ussd' ? 'active' : ''}
          onClick={() => setMode('ussd')}
        >
          USSD *120#
        </button>
        <button
          className={mode === 'whatsapp' ? 'active' : ''}
          onClick={() => setMode('whatsapp')}
        >
          WhatsApp
        </button>
      </nav>

      <main>
        {mode === 'ussd' && <USSDInterface />}
        {mode === 'whatsapp' && <WhatsAppInterface />}
      </main>

      {offline && (
        <div className="banner offline-banner">
          {queued ? t('offlineSaved') : t('simulateNoSignal')}
        </div>
      )}
      {!offline && queued === false && null}
    </div>
  );
}