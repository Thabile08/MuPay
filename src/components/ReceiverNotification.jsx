import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';

export default function ReceiverNotification() {
  const { t } = useApp();
  const { transfer } = useTransfer();
  return (
    <div className="notification">
      <strong>📱 SMS to receiver:</strong>
      <p>{t('receiverSms', { ref: transfer?.ref ?? '' })}</p>
    </div>
  );
}