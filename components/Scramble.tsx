'use client';

import { useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+/=<>';

/** Link whose label decodes itself on hover / focus. */
export default function Scramble({ href, text, className }: { href: string; text: string; className?: string }) {
  const label = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const run = () => {
    const el = label.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 420);
      const settled = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        out += i < settled || text[i] === ' ' ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  return (
    <a href={href} className={className} aria-label={text} onPointerEnter={run} onFocus={run}>
      <span ref={label} aria-hidden="true">
        {text}
      </span>
    </a>
  );
}
