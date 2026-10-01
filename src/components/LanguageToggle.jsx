import { useApp } from '../context/AppContext';

export default function LanguageToggle() {
  const { lang, setLang, LANGS } = useApp();
  return (
    <div className="lang-toggle">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={lang === l.code ? 'active' : ''}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}