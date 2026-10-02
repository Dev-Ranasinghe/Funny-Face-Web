'use client';

import { Fragment, useEffect, useRef } from 'react';
import { onFrame } from '@/lib/raf';
import { about, awards, type Award } from '@/lib/content';
import { Cross } from './Marks';
import Tunnel from './Tunnel';

/** Renders "[label](url)" segments as underlined links. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? (
          <a key={i} href={m[2]}>
            {m[1]}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}

/** Tilted wireframe globe with its meridians turning. */
function Globe() {
  return (
    <svg className="aw__globe" viewBox="-50 -50 100 100" fill="none" stroke="currentColor" aria-hidden="true">
      <g transform="rotate(-32)">
        <ellipse rx="34" ry="40" />
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} className="aw__meridian" rx="34" ry="40" style={{ animationDelay: `${i * -1.5}s` }} />
        ))}
        {[-26, -13, 0, 13, 26].map((y) => (
          <ellipse key={y} cx="0" cy={y} rx={34 * Math.sqrt(1 - (y / 40) ** 2)} ry={4 * Math.sqrt(1 - (y / 40) ** 2)} />
        ))}
      </g>
    </svg>
  );
}

function Tile({ award, index }: { award: Award; index: number }) {
  const style = {
    gridColumn: award.col,
    gridRow: award.row,
    '--delay': `${(index % 5) * 70}ms`,
  } as React.CSSProperties;

  if (award.kind === 'hatch') return <li className="aw aw--hatch" style={style} aria-hidden="true" />;
  if (award.kind === 'globe')
    return (
      <li className="aw aw--globe" style={style} aria-hidden="true">
        <Globe />
        {['tl', 'tr', 'bl', 'br'].map((c) => (
          <Cross key={c} className={`aw__corner aw__corner--${c}`} />
        ))}
      </li>
    );

  return (
    <li className={`aw aw--${award.kind} js-award`} style={style}>
      <div className="aw__inner">
        {award.kind === 'text' ? (
          <p className="aw__text">
            {award.lines[0]}
            <br />
            {award.lines[1]}
          </p>
        ) : (
          <>
            <p className="aw__name" data-rows={award.row.split('/').map(Number).reduce((a, b) => b - a)}>
              {award.name.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
            <p className="aw__counts">
              {award.counts.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          </>
        )}
      </div>
      <span className="aw__mask" aria-hidden="true">
        <Cross className="aw__mask-star" />
      </span>
    </li>
  );
}

export default function About() {
  const section = useRef<HTMLElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);

  // Wordmarks fill their tile's width, capped so a single row still breathes.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const fit = () => {
      el.querySelectorAll<HTMLElement>('.aw__name').forEach((name) => {
        const tile = name.closest<HTMLElement>('.aw')!;
        const inner = tile.querySelector<HTMLElement>('.aw__inner')!;
        const rows = Number(name.dataset.rows) || 1;
        const lines = name.querySelectorAll('br').length + 1;
        name.style.fontSize = '100px';
        const natural = name.scrollWidth;
        const byWidth = (100 * inner.clientWidth * 0.97) / natural;
        const byHeight = ((tile.clientHeight / rows) * 0.52 * rows) / lines;
        name.style.fontSize = `${Math.min(byWidth, byHeight)}px`;
      });
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Parallax: from the moment the section settles under the hero (top at 20%
  // of the viewport) the column drifts down at a fraction of scroll speed.
  // Near the top this slides the ABOUT bar out from under the section edge;
  // near the bottom it slides the column over the floor so it meets the edge
  // just as the next section's ticker rises to ~88% of the viewport.
  useEffect(() => {
    let lag = 0;
    return onFrame(() => {
      const sec = section.current;
      const col = column.current;
      if (!sec || !col) return;
      const vh = window.innerHeight;
      const sr = sec.getBoundingClientRect();
      if (sr.bottom < -vh || sr.top > vh) return;
      const restBottom = col.getBoundingClientRect().bottom - lag;
      const gap = sr.bottom - restBottom;
      // Two stages: a quick 40px reveal of the ABOUT bar while the section top
      // travels from 20% to 5% of the viewport, then a slow drift to the end.
      const s1 = vh * 0.2;
      const s2 = vh * 0.05;
      const reveal = 40;
      if (sr.top >= s1) lag = 0;
      else if (sr.top >= s2) lag = (reveal * (s1 - sr.top)) / (s1 - s2);
      else lag = reveal + ((s2 - sr.top) * Math.max(0, gap - reveal)) / Math.max(1, sr.height - vh * 0.83);
      col.style.setProperty('--lag', `${lag.toFixed(2)}px`);
    });
  }, []);

  // Tiles unmask as they enter; they re-arm once they drop back below the fold.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const t = e.target as HTMLElement;
          if (e.isIntersecting) t.dataset.in = 'true';
          else if (e.boundingClientRect.top > 0) t.dataset.in = 'false';
        }),
      { threshold: 0.35 }
    );
    el.querySelectorAll('.js-award').forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="about" ref={section} aria-labelledby="about-title">
      <Tunnel section={section} column={column} />
      <div className="about__col" ref={column}>
        <h2 id="about-title" className="bar">
          About
        </h2>
        <div className="about__text">
          {about.map((p) => (
            <p key={p.slice(0, 16)}>
              <Rich text={p} />
            </p>
          ))}
        </div>
        <h2 className="bar">Awards</h2>
        <ul className="awards" ref={grid}>
          {awards.map((a, i) => (
            <Tile key={i} award={a} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
