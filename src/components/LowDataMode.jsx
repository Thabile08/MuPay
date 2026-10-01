import { useApp } from '../context/AppContext';

export default function LowDataMode() {
  const { lowData, setLowData, offline, setOffline, t, queued } = useApp();
  return (
    <div className="lowdata-controls">
      <label>
        <input
          type="checkbox"
          checked={lowData}
          onChange={(e) => setLowData(e.target.checked)}
        />
        {t('lowData')}
      </label>
      <button onClick={() => setOffline(!offline)}>
        {offline ? t('restoreSignal') : t('simulateNoSignal')}
      </button>
      {queued && <span className="queued-badge">⏳ queued</span>}
    </div>
  );
}