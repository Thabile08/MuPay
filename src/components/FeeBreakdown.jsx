import { useApp } from '../context/AppContext';
import { mockApi } from '../api/mockApi';

export default function FeeBreakdown({ amount, country }) {
  const { t } = useApp();
  const fee = mockApi.getFee(amount);
  const rate = mockApi.getRate(country);
  const receiverGets = (amount - fee) * rate;

  return (
    <div className="fee-box">
      <div><strong>{t('fee')}:</strong> R{fee}</div>
      <div><strong>{t('rate')}:</strong> {rate} <span title={t('explainer')}>ℹ️</span></div>
      <div><strong>{t('receiverGets')}:</strong> R{receiverGets.toFixed(2)}</div>
      <small>{t('explainer')}</small>
    </div>
  );
}