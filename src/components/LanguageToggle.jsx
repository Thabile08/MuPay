import { useApp } from '../context/AppContext';
import { REVIEW_STATUS } from '../i18n/translations';

export default function LanguageToggle() {
  const { lang, setLang, LANGS } = useApp();
  return (
    <div className="lang-toggle">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={lang === l.code ? 'active' : ''}
          onClick={() => setLang(l.code)}
          title={
            REVIEW_STATUS[l.code] === 'approved'
              ? 'Reviewed by native speaker'
              : 'Pending native speaker review'
          }
        >
          {l.label}
          {REVIEW_STATUS[l.code] !== 'approved' && ' *'}
        </button>
      ))}
    </div>
  );
}