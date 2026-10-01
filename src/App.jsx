import { useApp } from './context/AppContext';
import USSDInterface from './components/USSDInterface';
import WhatsAppInterface from './components/WhatsAppInterface';
import ReceiverView from './components/ReceiverView';
import SimulateIncoming from './components/SimulateIncoming';
import LanguageToggle from './components/LanguageToggle';
import LowDataMode from './components/LowDataMode';
import AboutPanel from './components/AboutPanel';
import CurrencyPicker from './components/CurrencyPicker';

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

      <CurrencyPicker />
      <AboutPanel />

      <div className="side-by-side">
        <section className="panel sender-panel">
          <div className="panel-label">SENDER — Johannesburg</div>
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
          {mode === 'ussd' && <USSDInterface />}
          {mode === 'whatsapp' && <WhatsAppInterface />}
        </section>

        <section className="panel receiver-panel">
          <div className="panel-label">RECEIVER — Harare</div>
          <ReceiverView />
        </section>
      </div>

      <SimulateIncoming />

      {offline && (
        <div className="banner offline-banner">
          {queued ? t('offlineSaved') : t('simulateNoSignal')}
        </div>
      )}
    </div>
  );
}