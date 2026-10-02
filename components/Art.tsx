import type { ArtKind } from '@/lib/content';

/** Generative cover art for project cards — drawn, not stock. */
export default function Art({ kind }: { kind: ArtKind }) {
  const svg = { viewBox: '0 0 160 100', preserveAspectRatio: 'xMidYMid slice', fill: 'none', stroke: 'currentColor', 'aria-hidden': true } as const;
  switch (kind) {
    case 'rings':
      return (
        <svg {...svg} className="art art--rings">
          {[8, 16, 24, 32, 40, 48, 56].map((r, i) => (
            <circle key={r} cx="80" cy="50" r={r} style={{ animationDelay: `${i * -0.3}s` }} />
          ))}
        </svg>
      );
    case 'bars':
      return (
        <svg {...svg} className="art art--bars">
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={8 + i * 6.6} y="18" width="3" height="64" fill="currentColor" stroke="none" style={{ animationDelay: `${(i * 137) % 900 / -1000}s` }} />
          ))}
        </svg>
      );
    case 'wave':
      return (
        <svg {...svg} className="art art--wave">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M-10 ${14 + i * 7} Q 30 ${2 + i * 7} 70 ${14 + i * 7} T 150 ${14 + i * 7} T 230 ${14 + i * 7}`} style={{ animationDelay: `${i * -0.15}s` }} />
          ))}
        </svg>
      );
    case 'floor':
      return (
        <svg {...svg} className="art art--floor">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={80} y1={30} x2={-160 + i * 40} y2={100} />
          ))}
          <g className="art__rows">
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="0" x2="160" y1={32 + Math.pow(i, 1.6) * 3.6} y2={32 + Math.pow(i, 1.6) * 3.6} />
            ))}
          </g>
          <circle cx="80" cy="22" r="10" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'face':
      return (
        <svg {...svg} className="art art--face">
          <circle cx="80" cy="50" r="34" strokeWidth="2" />
          <circle className="art__eye" cx="68" cy="42" r="4" fill="currentColor" stroke="none" />
          <circle className="art__eye" cx="92" cy="42" r="4" fill="currentColor" stroke="none" />
          <path d="M62 58q18 18 36 0" strokeWidth="2.5" />
        </svg>
      );
    case 'orbit':
      return (
        <svg {...svg} className="art art--orbit">
          <ellipse cx="80" cy="50" rx="60" ry="18" />
          <ellipse cx="80" cy="50" rx="38" ry="30" />
          <circle cx="80" cy="50" r="7" fill="currentColor" stroke="none" />
          <g className="art__spin">
            <circle cx="140" cy="50" r="3.5" fill="currentColor" stroke="none" />
            <circle cx="42" cy="50" r="2.5" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    case 'hatch':
      return (
        <svg {...svg} className="art art--hatch">
          <defs>
            <pattern id="hatch-p" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="160" height="100" fill="url(#hatch-p)" stroke="none" />
          <circle className="art__hole" cx="80" cy="50" r="26" fill="var(--fg)" />
        </svg>
      );
    case 'type':
      return (
        <svg {...svg} className="art art--type">
          <text x="80" y="82" textAnchor="middle" fontSize="92" strokeWidth="1">
            Gg
          </text>
        </svg>
      );
  }
}
