'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      timers.push(
        window.setTimeout(() => {
          root.dataset.loaded = 'true';
          timers.push(window.setTimeout(() => setDone(true), 1100));
        }, reduce ? 0 : 1200)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  if (done) return null;
  return (
    <div className="loader" aria-hidden="true">
      <span className="loader__dash" />
    </div>
  );
}
