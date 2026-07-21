"use client";

import { type CSSProperties, useState } from "react";

export function OrbitConsole() {
  const particles = [[74, 188], [130, 372], [196, 86], [308, 118], [394, 286], [344, 404], [168, 420], [88, 292]];
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const style = { "--orbit-x": `${offset.x}px`, "--orbit-y": `${offset.y}px` } as CSSProperties;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 20;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20;
    setOffset({ x, y });
  }

  return (
    <div className="orbit-console" aria-hidden="true" onPointerMove={handlePointerMove} onPointerLeave={() => setOffset({ x: 0, y: 0 })} style={style}>
      <svg viewBox="0 0 480 480" focusable="false">
        <circle className="orbit-console__halo" cx="240" cy="240" r="42" />
        <circle className="orbit-ring orbit-ring--outer" cx="240" cy="240" r="188" />
        <circle className="orbit-ring orbit-ring--middle" cx="240" cy="240" r="132" />
        <circle className="orbit-ring orbit-ring--inner" cx="240" cy="240" r="78" />
        <g className="orbit-console__network">
          <path className="orbit-path" d="M52 240H428M240 52V428M107 107L373 373" />
          <circle className="orbit-node orbit-node--primary" cx="372" cy="240" r="8" />
          <circle className="orbit-node" cx="240" cy="108" r="6" />
          <circle className="orbit-node" cx="107" cy="107" r="6" />
          <circle className="orbit-node" cx="240" cy="428" r="5" />
        </g>
        <g className="orbit-console__sweep">
          <path d="M240 240L240 52A188 188 0 0 1 398 138Z" />
        </g>
        <g className="orbit-console__satellites">
          <circle className="orbit-console__satellite" cx="390" cy="176" r="5" />
          <circle className="orbit-console__satellite" cx="128" cy="338" r="4" />
          <circle className="orbit-console__satellite" cx="304" cy="402" r="4" />
        </g>
        <circle className="orbit-core" cx="240" cy="240" r="24" />
        <g className="orbit-console__particle-field">
          {particles.map(([cx, cy], index) => <circle className="orbit-console__particle" cx={cx} cy={cy} r="2" key={index} />)}
        </g>
      </svg>
    </div>
  );
}
