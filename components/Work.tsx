'use client';

import { useEffect, useRef } from 'react';
import { projects } from '@/lib/content';
import { clamp, easeInOut, lerp, onFrame, stickyProgress } from '@/lib/raf';
import Art from './Art';
import Ticker from './Ticker';

const WORD = ['W', 'O', 'R', 'K'];
const PER_ROW = 17;
// Letter advance per row, in viewport heights (W is widest).
const ADVANCE = [0.234, 0.154, 0.158, 0.166];
// Where each card drifts from, as fractions of the viewport.
const OFFSETS: [number, number][] = [
  [-0.14, -0.06],
  [0.16, 0.1],
  [-0.2, 0.12],
  [0.12, -0.12],
  [-0.08, 0.02],
  [0.22, -0.02],
  [-0.16, -0.14],
  [0.06, 0.14],
];
const CARD_START = 0.16;
const CARD_END = 0.86;
const CARD_LIFE = 0.2;

function code(title: string, i: number) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let s = '';
  for (let k = 0; k < 4; k++) s += chars[(h >> (k * 5)) % chars.length];
  return `${title.toUpperCase()}#${s}-${String(i + 1).padStart(4, '0')}/${String(projects.length).padStart(2, '0')}`;
}

export default function Work() {
  const track = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const n = projects.length;
    const spacing = (CARD_END - CARD_START - CARD_LIFE) / Math.max(1, n - 1);

    return onFrame(() => {
      const t = track.current;
      if (!t || !win.current || !ring.current || !grid.current) return;
      const r = t.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -40 || r.top > vh + 40) return;
      const vw = r.width;
      const p = stickyProgress(t);

      // Pill → full bleed on the way in, back to a pill on the way out.
      const open = easeInOut(clamp(p / 0.1)) * (1 - easeInOut(clamp((p - 0.9) / 0.1)));
      // Letter copies fan out from a single stacked column into full rows.
      const spread = easeInOut(clamp((p - 0.02) / 0.13)) * (1 - easeInOut(clamp((p - 0.84) / 0.14)));

      const w0 = Math.max(150, vw * 0.145);
      const h0 = vh * 0.78;
      const w = lerp(w0, vw * 1.25, open);
      const h = lerp(h0, vh + w * 1.1, open);
      const pill = `width:${w}px;height:${h}px;border-radius:${w / 2}px`;
      win.current.style.cssText = pill;
      ring.current.style.cssText = `width:${w + 34}px;height:${h + 34}px;border-radius:${(w + 34) / 2}px;opacity:${1 - open}`;
      grid.current.style.transform = `translate(-50%,-50%) scale(${1 + open * 1.7})`;
      win.current.dataset.open = open > 0.98 ? 'true' : 'false';

      // Letters sit on a barrel: rows bow away from centre, edges grow and tilt.
      const g = lerp(0.62, 1, open);
      const halfW = vw / 2;
      const halfH = vh / 2;
      letters.current.forEach((el, idx) => {
        if (!el) return;
        const row = Math.floor(idx / PER_ROW);
        const col = (idx % PER_ROW) - (PER_ROW - 1) / 2;
        const x = col * ADVANCE[row] * vh * spread * g;
        const y = (row - 1.5) * 0.236 * vh * g;
        const nx = x / halfW;
        const bx = x * (1 + 0.22 * nx * nx);
        const by = y * (1 + 0.14 * nx * nx);
        const rot = 7 * nx * (y / halfH);
        const s = g * (1 + 0.1 * nx * nx);
        el.style.transform = `translate3d(${bx}px,${by}px,0) rotate(${rot}deg) scale(${s})`;
        el.style.zIndex = String(100 - Math.abs(col));
      });

      cards.current.forEach((card, i) => {
        if (!card) return;
        const life = (p - (CARD_START + i * spacing)) / CARD_LIFE;
        if (life <= 0 || life >= 1) {
          card.style.visibility = 'hidden';
          return;
        }
        const scale = 0.06 * Math.pow(55, life);
        const [ox, oy] = OFFSETS[i % OFFSETS.length];
        card.style.visibility = 'visible';
        card.style.opacity = String(clamp(life / 0.1) * (1 - clamp((scale - 1.9) / 1.2)));
        card.style.zIndex = String(200 + Math.round(scale * 100));
        card.style.transform = `translate(-50%,-50%) translate3d(${ox * vw * scale}px,${oy * vh * scale}px,0) scale(${scale})`;
        card.style.pointerEvents = scale > 0.5 && scale < 1.8 ? 'auto' : 'none';
      });
    });
  }, []);

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <Ticker seed={41} />
      <div className="work__track" ref={track} style={{ '--count': projects.length } as React.CSSProperties}>
        <div className="work__sticky">
          <div className="work__grid" ref={grid} aria-hidden="true" />
          <div className="work__ring" ref={ring} aria-hidden="true" />
          <div className="work__window" ref={win}>
            <div className="work__stage">
              <div className="work__dots" />
              <h2 id="work-title" className="work__letters">
                <span className="sr-only">Work</span>
                {WORD.map((letter, r) =>
                  Array.from({ length: PER_ROW }, (_, i) => (
                    <span
                      key={`${r}-${i}`}
                      className="wl"
                      aria-hidden="true"
                      ref={(el) => void (letters.current[r * PER_ROW + i] = el)}
                    >
                      <span style={{ '--i': i + r * 5 } as React.CSSProperties}>{letter}</span>
                    </span>
                  ))
                )}
              </h2>
              <ol className="work__cards">
                {projects.map((p, i) => {
                  const body = (
                    <>
                      <span className="card__art">
                        <Art kind={p.art} />
                      </span>
                      <span className="card__cap">{code(p.title, i)}</span>
                    </>
                  );
                  return (
                    <li key={p.title}>
                      {p.url ? (
                        <a
                          className="card"
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title}, ${p.role}, ${p.year}`}
                          ref={(el) => void (cards.current[i] = el)}
                        >
                          {body}
                        </a>
                      ) : (
                        <article
                          className="card"
                          aria-label={`${p.title}, ${p.role}, ${p.year}`}
                          ref={(el) => void (cards.current[i] = el)}
                        >
                          {body}
                        </article>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
