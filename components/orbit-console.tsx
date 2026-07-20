export function OrbitConsole() {
  return (
    <div className="orbit-console" aria-hidden="true">
      <svg viewBox="0 0 480 480" focusable="false">
        <circle className="orbit-ring orbit-ring--outer" cx="240" cy="240" r="188" />
        <circle className="orbit-ring orbit-ring--middle" cx="240" cy="240" r="132" />
        <circle className="orbit-ring orbit-ring--inner" cx="240" cy="240" r="78" />
        <path className="orbit-path" d="M52 240H428M240 52V428M107 107L373 373" />
        <circle className="orbit-core" cx="240" cy="240" r="24" />
        <circle className="orbit-node orbit-node--primary" cx="372" cy="240" r="8" />
        <circle className="orbit-node" cx="240" cy="108" r="6" />
        <circle className="orbit-node" cx="107" cy="107" r="6" />
        <circle className="orbit-node" cx="240" cy="428" r="5" />
      </svg>
    </div>
  );
}
