import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import { getQuote, quoteText } from '../utils/quote';
import TransactionStatus from './TransactionStatus';

const COUNTRIES = ['ZW', 'MW', 'ZM', 'MZ', 'KE'];
const COUNTRY_NAMES = { ZW: 'Zimbabwe', MW: 'Malawi', ZM: 'Zambia', MZ: 'Mozambique', KE: 'Kenya' };
const EMPTY_DRAFT = { amount: null, country: null, recipient: null, quote: null };

export default function WhatsAppInterface() {
  const { t, offline, sendCurrency, receiveCurrency } = useApp();
  const { createTransfer } = useTransfer();

  const [messages, setMessages] = useState([{ from: 'bot', text: t('waWelcome') }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('idle');
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const push = (from, text) => setMessages((m) => [...m, { from, text }]);

  const startSend = () => {
    setDraft(EMPTY_DRAFT);
    setStep('amount');
    push('bot', t('waAskAmount', { currency: sendCurrency }));
  };

  const handleSend = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    push('user', text);
    setInput('');

    const lower = text.toLowerCase();

    // Global commands
    if (lower === 'send' || lower.includes('send money') || lower.includes('tumira mari')) {
      startSend();
      return;
    }
    if (lower.includes('status') || lower.includes('tarisa')) {
      setStep('status');
      push('bot', t('inTransit'));
      return;
    }

    switch (step) {
      case 'amount': {
        const amt = Number(text.replace(/[^\d.]/g, ''));
        if (!amt) return push('bot', t('waAskAmount', { currency: sendCurrency }));
        setDraft((d) => ({ ...d, amount: amt }));
        setStep('country');
        push('bot', t('waAskCountry'));
        break;
      }
      case 'country': {
        let cc = null;
        if (/^[1-5]$/.test(text)) cc = COUNTRIES[Number(text) - 1];
        else {
          const found = Object.entries(COUNTRY_NAMES).find(([, n]) =>
            lower.includes(n.toLowerCase())
          );
          if (found) cc = found[0];
        }
        if (!cc) return push('bot', t('waAskCountry'));
        setDraft((d) => ({ ...d, country: cc }));
        setStep('recipient');
        push('bot', t('waAskRecipient'));
        break;
      }
      case 'recipient': {
        // Only work out and SHOW the quote here. No transfer exists yet.
        const quote = getQuote(draft.amount, sendCurrency, receiveCurrency);
        setDraft((d) => ({ ...d, recipient: text, quote }));
        setStep('confirm');
        push('bot', t('waConfirm', quoteText(quote)));
        break;
      }
      case 'confirm': {
        if (lower === 'yes' || lower.includes('simbisa')) {
          // The transfer is created ONLY now, from the quote the sender saw.
          const created = createTransfer({
            amount: draft.amount,
            country: draft.country,
            recipient: draft.recipient,
            quote: draft.quote
          });
          setDraft(EMPTY_DRAFT);
          setStep('status');
          push('bot', offline ? t('offlineSaved') : t('waSent', { ref: created.ref }));
        } else if (lower === 'no' || lower.includes('kanzura')) {
          // Nothing was created, so cancelling really cancels.
          setDraft(EMPTY_DRAFT);
          setStep('idle');
          push('bot', t('waCancelled'));
        } else {
          push('bot', t('waConfirm', quoteText(draft.quote)));
        }
        break;
      }
      default:
        // The welcome message tells people to reply 1 or 2, so honour that.
        if (text === '1') startSend();
        else if (text === '2') {
          setStep('status');
          push('bot', t('inTransit'));
        } else push('bot', t('waWelcome'));
    }
  };

  const quickReplies = {
    idle: [t('quickSend'), t('quickStatus')],
    amount: [],
    country: ['1', '2', '3', '4', '5'],
    confirm: [t('quickYes'), t('quickNo')],
    status: []
  }[step] ?? [];

  return (
    <div className="whatsapp">
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>{m.text}</div>
        ))}

        {step === 'status' && (
          <div className="bubble bot status-bubble">
            <TransactionStatus variant="whatsapp" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {quickReplies.length > 0 && (
        <div className="quick-replies">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => handleSend(q)}>{q}</button>
          ))}
        </div>
      )}

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
        />
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
}
