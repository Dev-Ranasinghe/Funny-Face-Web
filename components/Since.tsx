'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/lib/content';
import { easeOut, onFrame, stickyProgress } from '@/lib/raf';
import FitText from './FitText';
import { WireFace } from './Marks';

const RAYS = 72;

export default function Since() {
  const section = useRef<HTMLElement>(null);

  useEffect(
    () =>
      onFrame(() => {
        const s = section.current;
        if (!s) return;
        const r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const p = stickyProgress(s);
        const rise = easeOut(Math.min(1, (p + 0.25) / 0.85));
        s.style.setProperty('--rot', `${p * 50}deg`);
        s.style.setProperty('--rise', String(1 - rise));
      }),
    []
  );

  return (
    <section className="since" ref={section} aria-label={site.since.join(' ')}>
      <div className="since__sticky">
        <svg className="since__rays" viewBox="-100 -100 200 200" aria-hidden="true">
          {Array.from({ length: RAYS }, (_, i) => {
            const a = (i / RAYS) * Math.PI * 2;
            return <line key={i} x1="0" y1="0" x2={(Math.cos(a) * 142).toFixed(2)} y2={(Math.sin(a) * 142).toFixed(2)} />;
          })}
        </svg>
        <div className="since__face">
          <WireFace />
        </div>
        <div className="since__stage" aria-hidden="true">
          <div className="since__crawl">
            {site.since.map((line) => (
              <FitText key={line} className="since__line">
                {line}
              </FitText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
