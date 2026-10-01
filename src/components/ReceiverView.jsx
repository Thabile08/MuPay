import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTransfer } from '../hooks/useTransfer';
import { validateAccount } from '../utils/validation';
import { formatMoney } from '../utils/currencies';
import VerifyPhone from './VerifyPhone';
import SenderReceipt from './SenderReceipt';
import AlreadyCollected from './AlreadyCollected';

const BANKS = [
  'CBZ Bank', 'Steward Bank', 'FBC Bank', 'ZB Bank',
  'EcoCash', 'NMB Bank', 'Stanbic', 'Other'
];

export default function ReceiverView() {
  const {
    t, status, transfer,
    receiverVerified,
    isMukuruAccount, setIsMukuruAccount,
    receiverChoice, bankDetails,
    collected,
    offline
  } = useApp();
  const { markCollected } = useTransfer();

  const [screen, setScreen] = useState('choice');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [accountError, setAccountError] = useState('');

  useEffect(() => {
    setScreen('choice');
    setBank('');
    setAccount('');
    setAccountError('');
  }, [transfer?.ref]);

  const hasTransfer = !!transfer;

  // ── Identity gate: must verify before we show the money ──
  if (!receiverVerified) {
    return (
      <div className="receiver-phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-statusbar">
            <span>📶 {t('receiverPhone')}</span>
            <span>🔋</span>
          </div>
          <VerifyPhone />
        </div>
      </div>
    );
  }

  // ── Already collected: locked receipt screen ──
  if (collected || status === 'COLLECTED') {
    return (
      <div className="receiver-phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-statusbar">
            <span>📶 {t('receiverPhone')}</span>
            <span>🔋</span>
          </div>
          <ReceiptView
            t={t}
            transfer={transfer}
            receiverChoice={receiverChoice}
            bankDetails={bankDetails}
          />
          <SenderReceipt />
          <AlreadyCollected />
        </div>
      </div>
    );
  }

  const handleBankConfirm = () => {
    const v = validateAccount(bank, account);
    if (!v.ok) {
      const map = {
        length: t('accountInvalidLength', { min: '6', max: '20' }),
        numeric: t('accountInvalidNumeric'),
        prefix: t('accountInvalidPrefix'),
        unknown_bank: t('accountInvalidNumeric')
      };
      setAccountError(map[v.reason] || t('accountInvalidNumeric'));
      return;
    }
    setAccountError('');
    markCollected('bank', { bank, account });
  };

  const handleCashConfirm = () => {
    markCollected('cash');
  };

  return (
    <div className="receiver-phone">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-statusbar">
          <span>📶 {t('receiverPhone')}</span>
          <span>🔋</span>
        </div>

        {!hasTransfer && (
          <div className="sms-waiting">
            <div className="waiting-icon">📭</div>
            <div>{t('waitingForMoney')}</div>
            <div className="small">{t('waitingSubtext')}</div>
          </div>
        )}

        {hasTransfer && (status === 'SENT' || status === 'IN_TRANSIT') && (
          <div className="sms-waiting">
            <div className="waiting-icon">⏳</div>
            <div>{t('inTransit')}</div>
            <div className="small">Ref {transfer.ref}</div>
          </div>
        )}

        {hasTransfer && status === 'READY_TO_COLLECT' && screen === 'choice' && (
          <div className="sms-incoming">
            <div className="sms-header">📩 {t('incomingMoney')}</div>

            <div className="pickup">
              <div className="pickup-label">{t('incomingFrom')}</div>
              <div className="pickup-from">{transfer.recipient}</div>
            </div>

            <div className="pickup">
              <div className="pickup-label">{t('youReceive')}</div>
              <div className="pickup-amount">
                {formatMoney(transfer.receiverGets, transfer.receiveCurrency)}
              </div>
              <div className="pickup-sub">
                {transfer.sendCurrency} {transfer.amount} × {transfer.rate}
              </div>
            </div>

            <div className="pickup">
              <div className="pickup-label">{t('pickupCode')}</div>
              <div className="pickup-code">{transfer.ref}</div>
            </div>

            <div className="choice-title">{t('chooseHowToReceive')}</div>

            <button className="choice-btn" onClick={() => setScreen('cash')}>
              <div className="choice-btn-title">💵 {t('withdrawCash')}</div>
              <div className="choice-btn-desc">{t('withdrawCashDesc')}</div>
            </button>

            <button className="choice-btn" onClick={() => setScreen('bank')}>
              <div className="choice-btn-title">🏦 {t('transferToBank')}</div>
              <div className="choice-btn-desc">{t('transferToBankDesc')}</div>
            </button>

            <label className="mukuru-toggle">
              <input
                type="checkbox"
                checked={isMukuruAccount}
                onChange={(e) => setIsMukuruAccount(e.target.checked)}
              />
              {isMukuruAccount
                ? `✅ ${t('mukuruAccountHolder')}`
                : `❓ ${t('notAnAccountHolder')}`}
            </label>
          </div>
        )}

        {hasTransfer && status === 'READY_TO_COLLECT' && screen === 'cash' && (
          <div className="sms-incoming">
            <div className="sms-header">💵 {t('withdrawCash')}</div>
            <p className="pickup-hint">{t('collectAt')}</p>

            <div className="pickup">
              <div className="pickup-label">{t('youReceive')}</div>
              <div className="pickup-amount">
                {formatMoney(transfer.receiverGets, transfer.receiveCurrency)}
              </div>
            </div>

            <div className="pickup">
              <div className="pickup-label">{t('pickupCode')}</div>
              <div className="pickup-code">{transfer.ref}</div>
            </div>

            <button className="collect-btn" onClick={handleCashConfirm}>
              {t('confirmWithdraw')}
            </button>
            <button className="ghost-btn" onClick={() => setScreen('choice')}>
              {t('cancel')}
            </button>
          </div>
        )}

        {hasTransfer && status === 'READY_TO_COLLECT' && screen === 'bank' && (
          <div className="sms-incoming">
            <div className="sms-header">🏦 {t('transferToBank')}</div>

            {isMukuruAccount ? (
              <div className="badge-instant">⚡ {t('bankInstant')}</div>
            ) : (
              <>
                <p className="signup-nudge">{t('signUpNow')}</p>
                <div className="badge-standard">🕐 {t('bankStandard')}</div>
              </>
            )}

            <label className="field-label">{t('chooseBank')}</label>
            <select value={bank} onChange={(e) => setBank(e.target.value)}>
              <option value="">—</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <label className="field-label">{t('accountNumber')}</label>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 0123456789"
            />
            {accountError && <div className="error-text">{accountError}</div>}

            <div className="pickup">
              <div className="pickup-label">{t('youReceive')}</div>
              <div className="pickup-amount">
                {formatMoney(transfer.receiverGets, transfer.receiveCurrency)}
              </div>
            </div>

            <button
              className="collect-btn"
              disabled={!bank || !account}
              onClick={handleBankConfirm}
            >
              {t('confirmBank')}
            </button>
            <button className="ghost-btn" onClick={() => setScreen('choice')}>
              {t('cancel')}
            </button>
          </div>
        )}

        {offline && status === 'READY_TO_COLLECT' && (
          <div className="offline-note">{t('offlineQueued')}</div>
        )}
      </div>
    </div>
  );
}

// ── Receipt sub-component ──
function ReceiptView({ t, transfer, receiverChoice, bankDetails }) {
  if (!transfer) return null;

  return (
    <div className="sms-collected">
      <div className="tick">✓</div>
      <h3>
        {receiverChoice === 'bank' ? t('bankSuccess') : t('withdrawSuccess')}
      </h3>

      <div className="receipt">
        <div className="receipt-row">
          <span>{t('amountReceived')}</span>
          <strong>
            {formatMoney(transfer.receiverGets, transfer.receiveCurrency)}
          </strong>
        </div>

        <div className="receipt-row">
          <span>{t('method')}</span>
          <strong>
            {receiverChoice === 'bank' ? t('methodBank') : t('methodCash')}
          </strong>
        </div>

        {receiverChoice === 'bank' && bankDetails && (
          <>
            <div className="receipt-row">
              <span>{t('bankName')}</span>
              <strong>{bankDetails.bank}</strong>
            </div>
            <div className="receipt-row">
              <span>{t('accountNumber')}</span>
              <strong>•••{bankDetails.account.slice(-4)}</strong>
            </div>
          </>
        )}

        <div className="receipt-row">
          <span>{t('refLabel')}</span>
          <strong>{transfer.ref}</strong>
        </div>
      </div>

      <p className="small">{t('receipt')}</p>
    </div>
  );
}