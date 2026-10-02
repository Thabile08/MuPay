import { useState, useEffect, useRef } from 'react';

const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['*', ''],
  ['0', '+'],
  ['#', '']
];

export default function Dialer({
  target = '*120#',
  title = 'Dial',
  placeholder = 'Enter code',
  callLabel = 'Call',
  hintLabel,
  onDial,
  onCancel
}) {
  const [typed, setTyped] = useState('');
  const [shake, setShake] = useState(false);
  const autoDialTimer = useRef(null);
  const longPressTimer = useRef(null);

  const press = (key) => {
    if (typed.length >= 8) return;
    setTyped((v) => v + key);
  };

  const backspace = () => setTyped((v) => v.slice(0, -1));
  const clear = () => setTyped('');

  const matches = typed === target;

  const call = () => {
    if (!matches) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setTyped('');
      }, 400);
      return;
    }
    onDial?.(typed);
  };

  // Auto-dial the moment the correct code is typed
  useEffect(() => {
    if (!matches) return;
    autoDialTimer.current = setTimeout(() => onDial?.(typed), 450);
    return () => clearTimeout(autoDialTimer.current);
  }, [matches, typed, onDial]);

  // Long-press 0 → '+' (real dialer behaviour)
  const startLongPress = (key) => {
    if (key === '0') {
      longPressTimer.current = setTimeout(() => {
        setTyped((v) => v.replace(/0$/, '+'));
      }, 600);
    }
  };
  const endLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  // Long-press backspace → clear
  const startBackspaceHold = () => {
    longPressTimer.current = setTimeout(clear, 600);
  };

  return (
    <div className="dialer">
      <div className="dialer-header">
        <span>{title}</span>
        {onCancel && (
          <button
            className="dialer-close"
            onClick={onCancel}
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      <div className={`dialer-display ${shake ? 'shake' : ''}`}>
        {typed || <span className="dialer-placeholder">{placeholder}</span>}
      </div>

      <div className="dialer-grid">
        {KEYS.map(([digit, letters]) => (
          <button
            key={digit}
            className="dialer-key"
            type="button"
            onClick={() => press(digit)}
            onMouseDown={() => startLongPress(digit)}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onTouchStart={() => startLongPress(digit)}
            onTouchEnd={endLongPress}
          >
            <span className="dialer-digit">{digit}</span>
            {letters && <span className="dialer-letters">{letters}</span>}
          </button>
        ))}
      </div>

      <div className="dialer-actions">
        <button
          className="dialer-backspace"
          type="button"
          onClick={backspace}
          onMouseDown={startBackspaceHold}
          onMouseUp={endLongPress}
          onMouseLeave={endLongPress}
          onTouchStart={startBackspaceHold}
          onTouchEnd={endLongPress}
          aria-label="Backspace"
        >
          ⌫
        </button>
        <button
          className="dialer-call"
          type="button"
          onClick={call}
          disabled={!matches}
        >
          📞 {callLabel}
        </button>
      </div>

      <div className="dialer-hint">
        {hintLabel ?? (<>Try: <code>{target}</code></>)}
      </div>
    </div>
  );
}