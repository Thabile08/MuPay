import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import TransactionStatus from './TransactionStatus';

const COUNTRIES = ['ZW', 'MW', 'ZM', 'MZ', 'KE'];
const COUNTRY_NAMES = { ZW: 'Zimbabwe', MW: 'Malawi', ZM: 'Zambia', MZ: 'Mozambique', KE: 'Kenya' };

export default function WhatsAppInterface() {
  const { t, offline, queued } = useApp();
  const { transfer, createTransfer } = useTransfer();

  const [messages, setMessages] = useState([{ from: 'bot', text: t('waWelcome') }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('idle');
  const [draft, setDraft] = useState({ amount: null, country: null, recipient: null });
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const push = (from, text) => setMessages((m) => [...m, { from, text }]);

  const handleSend = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    push('user', text);
    setInput('');

    const lower = text.toLowerCase();

    // Global commands
    if (lower === 'send' || lower.includes('send money') || lower.includes('tumira mari')) {
      setStep('amount');
      push('bot', t('waAskAmount'));
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
        if (!amt) return push('bot', t('waAskAmount'));
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
        const newDraft = { ...draft, recipient: text };
        setDraft(newDraft);
        // Create transfer first so we can show computed fee/rate
        const created = createTransfer({
          amount: newDraft.amount,
          country: newDraft.country,
          recipient: newDraft.recipient
        });
        setStep('confirm');
        push('bot', t('waConfirm', {
          amount: created.amount,
          fee: created.fee,
          rate: created.rate,
          receiverGets: created.receiverGets.toFixed(2)
        }));
        break;
      }
      case 'confirm': {
        if (lower === 'yes' || lower.includes('simbisa')) {
          setStep('status');
          push('bot', queued
            ? t('offlineSaved')
            : t('waSent', { ref: transfer?.ref ?? '' })
          );
        } else if (lower === 'no' || lower.includes('kanzura')) {
          setStep('idle');
          push('bot', t('waCancelled'));
        } else {
          push('bot', t('waConfirm', {
            amount: transfer?.amount,
            fee: transfer?.fee,
            rate: transfer?.rate,
            receiverGets: transfer?.receiverGets?.toFixed(2)
          }));
        }
        break;
      }
      default:
        push('bot', t('waWelcome'));
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