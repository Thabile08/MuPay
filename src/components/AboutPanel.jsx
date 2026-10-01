import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AboutPanel() {
  const { t } = useApp();
  const [open, setOpen] = useState(true);

  return (
    <div className={`about-panel ${open ? 'open' : 'closed'}`}>
      <button className="about-header" onClick={() => setOpen(!open)}>
        <span>{t('aboutTitle')}</span>
        <span className="chev">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="about-body">
          <p>{t('aboutBody')}</p>
          <ul>
            <li>{t('aboutBullet1')}</li>
            <li>{t('aboutBullet2')}</li>
            <li>{t('aboutBullet3')}</li>
            <li>{t('aboutBullet4')}</li>
            <li>{t('aboutBullet5')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}