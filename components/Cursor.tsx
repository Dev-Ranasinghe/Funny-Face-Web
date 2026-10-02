'use client';

import { useEffect, useRef } from 'react';
import { onFrame } from '@/lib/raf';

/** Small trailing dot for fine pointers; swells over interactive elements. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    const move = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      const hot = (e.target as Element | null)?.closest('a, button');
      el.dataset.hot = hot ? 'true' : 'false';
      el.dataset.on = 'true';
    };
    const leave = () => (el.dataset.on = 'false');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    const off = onFrame(() => {
      pos.x += (pos.tx - pos.x) * 0.25;
      pos.y += (pos.ty - pos.y) * 0.25;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    });
    return () => {
      off();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}
