import { useApp } from '../context/AppContext';

export default function SenderReceipt() {
  const { t, senderNotifiedAt, transfer } = useApp();
  if (!senderNotifiedAt || !transfer) return null;

  const time = new Date(senderNotifiedAt).toLocaleTimeString();

  return (
    <div className="sender-receipt">
      <div className="receipt-row">
        <span>✅</span>
        <strong>{t('senderNotified', { time })}</strong>
      </div>
      <div className="small">Ref {transfer.ref}</div>
    </div>
  );
}