/** Authored SVG marks — one stroke language, all currentColor. */

export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M6 45V3h15M10 45V7h11M6 23h12M28 45V3h15M32 45V7h11M28 23h12"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C12.6 8 16 11.4 24 12 16 12.6 12.6 16 12 24 11.4 16 8 12.6 0 12 8 11.4 11.4 8 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Cross({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C12.3 9 15 11.7 24 12 15 12.3 12.3 15 12 24 11.7 15 9 12.3 0 12 9 11.7 11.7 9 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Icon({ name }: { name: 'cube' | 'in' | 'theme' | 'arrow' }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true } as const;
  if (name === 'cube')
    return (
      <svg {...common}>
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Zm0 0v4.5M4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" />
      </svg>
    );
  if (name === 'in')
    return (
      <svg {...common}>
        <path d="M5 9.5V19M5 5v1.5M10 19V9.5m0 3.5c0-2 1.6-3.5 3.5-3.5S17 11 17 13v6" strokeLinecap="square" />
      </svg>
    );
  if (name === 'theme')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 20V4m-6 6 6-6 6 6" />
    </svg>
  );
}

/** 9×9 pixel face that blinks — the header's calling card. */
const FACE = [
  '..#####..',
  '.#.....#.',
  '#..#.#..#',
  '#..#.#..#',
  '#.......#',
  '#.#...#.#',
  '#..###..#',
  '.#.....#.',
  '..#####..',
];

export function PixelFace({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
      {FACE.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === '#' ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill="currentColor"
              className={(y === 2 || y === 3) && (x === 3 || x === 5) ? 'pixel-eye' : undefined}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/** Wireframe smiley used as a vanishing-point object. */
export function WireFace({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle r="46" />
      <ellipse rx="46" ry="16" />
      <ellipse rx="16" ry="46" />
      <ellipse rx="34" ry="46" />
      <path d="M-24 10q24 26 48 0" strokeWidth="3" />
      <circle cx="-15" cy="-12" r="4" fill="currentColor" />
      <circle cx="15" cy="-12" r="4" fill="currentColor" />
    </svg>
  );
}
