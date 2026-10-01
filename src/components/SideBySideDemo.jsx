import { useApp } from '../context/AppContext';
import USSDInterface from './USSDInterface';
import WhatsAppInterface from './WhatsAppInterface';
import ReceiverView from './ReceiverView';

export default function SideBySideDemo() {
  const { t, mode, setMode } = useApp();

  return (
    <div className="side-by-side">
      {/* SENDER PANEL */}
      <section className="panel sender-panel">
        <div className="panel-label">{t('senderPanel')}</div>

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

      {/* RECEIVER PANEL */}
      <section className="panel receiver-panel">
        <div className="panel-label">{t('receiverPanel')}</div>
        <ReceiverView />
      </section>
    </div>
  );
}