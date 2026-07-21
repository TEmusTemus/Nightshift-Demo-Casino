export function SignalField() {
  return (
    <div className="signal-field" aria-hidden="true">
      <svg className="signal-field__inner" viewBox="0 0 1440 900" focusable="false">
        <g className="signal-field__object signal-field__object--chip">
          <circle cx="164" cy="176" r="34" />
          <circle cx="164" cy="176" r="22" />
        </g>
        <g className="signal-field__object signal-field__object--card">
          <rect x="1120" y="90" width="62" height="92" />
        </g>
        <g className="signal-field__object signal-field__object--suit">
          <path d="M206 710c-36-42 34-72 0-114-34 42 36 72 0 114Z" />
        </g>
        <g className="signal-field__object signal-field__object--chip">
          <circle cx="1260" cy="700" r="24" />
          <circle cx="1260" cy="700" r="14" />
        </g>
        <g className="signal-field__object signal-field__object--card">
          <rect x="406" y="510" width="44" height="66" />
        </g>
        <g className="signal-field__object signal-field__object--suit">
          <path d="M960 456c-30-36 28-62 0-98-28 36 30 62 0 98Z" />
        </g>
      </svg>
    </div>
  );
}
