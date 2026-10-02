'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Scales a single line of type so it spans its container exactly. */
export default function FitText({ children, className }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      i.style.fontSize = '100px';
      const natural = i.scrollWidth;
      if (natural) i.style.fontSize = `${(100 * o.clientWidth) / natural}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className={`fit ${className ?? ''}`}>
      <span ref={inner} className="fit__line">
        {children}
      </span>
    </div>
  );
}
