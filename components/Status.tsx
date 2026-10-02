'use client';

import { useEffect, useRef } from 'react';

/** Mono status lines typed out one after another, then looped. */
export default function Status({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spans = [...el.querySelectorAll<HTMLSpanElement>('span')];
    let line = 0;
    let char = 0;
    let timer = 0;
    spans.forEach((s) => (s.textContent = ''));
    const tick = () => {
      if (line >= lines.length) {
        timer = window.setTimeout(() => {
          spans.forEach((s) => {
            s.textContent = '';
            s.removeAttribute('data-caret');
          });
          line = 0;
          char = 0;
          tick();
        }, 2600);
        return;
      }
      char++;
      spans.forEach((s, i) => (i === line ? s.setAttribute('data-caret', '') : s.removeAttribute('data-caret')));
      spans[line].textContent = lines[line].slice(0, char).toUpperCase();
      if (char >= lines[line].length) {
        line++;
        char = 0;
        timer = window.setTimeout(tick, 380);
      } else timer = window.setTimeout(tick, 38 + Math.random() * 50);
    };
    timer = window.setTimeout(tick, 1600);
    return () => clearTimeout(timer);
  }, [lines]);

  return (
    <p ref={ref} className="head__status cell" aria-label={lines.join('. ')}>
      {lines.map((l) => (
        <span key={l} aria-hidden="true">
          {l.toUpperCase()}
        </span>
      ))}
    </p>
  );
}
