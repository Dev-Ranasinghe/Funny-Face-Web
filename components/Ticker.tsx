// Deterministic binary "data strip" so server and client render the same.
function strip(seed: number) {
  let s = seed;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const parts: string[] = [];
  for (let i = 0; i < 12; i++) {
    if (i % 2) parts.push('/'.repeat(30 + Math.floor(rand() * 40)));
    else {
      let bits = '';
      const len = 12 + Math.floor(rand() * 28);
      for (let j = 0; j < len; j++) bits += rand() > 0.5 ? '1' : '0';
      parts.push(bits);
    }
  }
  return parts;
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg className="ticker__arrow" viewBox="0 0 6 8" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M0 0l6 4-6 4z" fill="currentColor" />
    </svg>
  );
}

export default function Ticker({ seed = 7, reverse = false }: { seed?: number; reverse?: boolean }) {
  const parts = strip(seed);
  const run = (
    <span className="ticker__run">
      {parts.map((p, i) => (
        <span key={i}>{p}</span>
      ))}
    </span>
  );
  return (
    <div className={`ticker${reverse ? ' ticker--rev' : ''}`} aria-hidden="true">
      <Arrow />
      <div className="ticker__viewport">
        <div className="ticker__track">
          {run}
          {run}
        </div>
      </div>
      <Arrow flip />
    </div>
  );
}
