import { useApp } from '../context/AppContext';

export default function AlreadyCollected() {
  const { t, transfer } = useApp();
  return (
    <div className="sms-collected">
      <div className="tick">🔒</div>
      <h3>{t('alreadyCollected')}</h3>
      <p className="small">{t('alreadyCollectedDesc')}</p>
      <p className="small">Ref {transfer?.ref}</p>
    </div>
  );
}