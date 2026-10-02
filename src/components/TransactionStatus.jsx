import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import { formatMoney } from '../utils/currencies';
import ReceiverNotification from './ReceiverNotification';

export default function TransactionStatus({ variant = 'ussd' }) {
  const { t } = useApp();
  const { transfer, status, advanceStatus, reset } = useTransfer();

  if (!transfer || !status) return null;

  const label = t(
    status === 'SENT' ? 'sent' :
    status === 'IN_TRANSIT' ? 'inTransit' :
    status === 'READY_TO_COLLECT' ? 'readyToCollect' :
    'collected'
  );

  return (
    <div className={`status-block ${variant}`}>
      <p><strong>{label}</strong></p>
      <p>Ref: {transfer.ref}</p>
      <p>{t('receiverGets')}: {formatMoney(transfer.receiverGets, transfer.receiveCurrency)}</p>

      {/* Demo shortcut only for the early stages. The final step is the
          receiver's job (verify → choose cash/bank), never the sender's. */}
      {(status === 'SENT' || status === 'IN_TRANSIT') && (
        <button onClick={advanceStatus}>{t('nextStep')}</button>
      )}

      {status === 'READY_TO_COLLECT' && <ReceiverNotification />}

      {status === 'COLLECTED' && (
        <button onClick={reset} className="secondary">{t('startNew')}</button>
      )}
    </div>
  );
}
