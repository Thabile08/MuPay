// ONE place that works out fee, rate and what the receiver gets.
// FeeBreakdown, the USSD confirm screen, the WhatsApp confirm message and
// createTransfer() all use this, so what the sender SEES is what is SENT.
import { getRate, formatMoney } from './currencies';

// Tiers are in units of the send currency (prototype simplification).
export const getFee = (amount) => (amount <= 100 ? 2 : amount <= 500 ? 5 : 8);

export function getQuote(amount, sendCurrency, receiveCurrency) {
  const fee = getFee(amount);
  const rate = getRate(sendCurrency, receiveCurrency);
  return {
    amount,
    fee,
    rate,
    receiverGets: (amount - fee) * rate,
    sendCurrency,
    receiveCurrency
  };
}

// Pre-formatted strings for the USSD / WhatsApp text templates.
export function quoteText(q) {
  return {
    amount: formatMoney(q.amount, q.sendCurrency),
    fee: formatMoney(q.fee, q.sendCurrency),
    rate: `1 ${q.sendCurrency} = ${q.rate} ${q.receiveCurrency}`,
    receiverGets: formatMoney(q.receiverGets, q.receiveCurrency)
  };
}
