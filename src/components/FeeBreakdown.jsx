import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/currencies';

// Shows the quote the sender is about to confirm. `quote` comes from getQuote().
export default function FeeBreakdown({ quote }) {
  const { t } = useApp();
  if (!quote) return null;

  const { fee, rate, receiverGets, sendCurrency, receiveCurrency } = quote;

  return (
    <div className="fee-box">
      <div><strong>{t('fee')}:</strong> {formatMoney(fee, sendCurrency)}</div>
      <div>
        <strong>{t('rate')}:</strong> 1 {sendCurrency} = {rate} {receiveCurrency}{' '}
        <span title={t('explainer')}>ℹ️</span>
      </div>
      <div>
        <strong>{t('receiverGets')}:</strong> {formatMoney(receiverGets, receiveCurrency)}
      </div>
      <small>{t('explainer')}</small>
    </div>
  );
}
