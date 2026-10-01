import { useApp } from '../context/AppContext';
import { CURRENCIES, getRate, formatMoney } from '../utils/currencies';

export default function CurrencyPicker() {
  const { t, sendCurrency, setSendCurrency, receiveCurrency, setReceiveCurrency } = useApp();
  const rate = getRate(sendCurrency, receiveCurrency);

  return (
    <div className="currency-picker">
      <div className="cp-title">💱 {t('currencyPair')}</div>

      <div className="cp-row">
        <div className="cp-field">
          <label>{t('sendCurrency')}</label>
          <select
            value={sendCurrency}
            onChange={(e) => setSendCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="cp-arrow">→</div>

        <div className="cp-field">
          <label>{t('receiveCurrency')}</label>
          <select
            value={receiveCurrency}
            onChange={(e) => setReceiveCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cp-rate">
        {t('rate')}: 1 {sendCurrency} = {rate} {receiveCurrency}
        <span className="cp-demo"> ({t('simulatedRate')})</span>
      </div>

      <div className="cp-preview">
        {t('example')}: {formatMoney(200, sendCurrency)} → {formatMoney(200 * rate, receiveCurrency)}
      </div>
    </div>
  );
}