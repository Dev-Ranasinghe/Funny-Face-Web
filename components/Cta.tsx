'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/lib/content';
import { clamp, onFrame, reducedMotion } from '@/lib/raf';
import { palette } from '@/lib/theme';

/** Square grid that bulges like a lens around the GO button. */
export default function Cta() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hovered = useRef(false);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    const sec = section.current;
    if (!cv || !ctx || !sec) return;
    const still = reducedMotion();
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.tx = (e.clientX - r.left - w / 2) * 0.12;
      pointer.ty = (e.clientY - r.top - h / 2) * 0.12;
    };
    sec.addEventListener('pointermove', move);

    let power = 0;
    const off = onFrame((time) => {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh || !w) return;
      const enter = clamp(1 - (r.top + r.height / 2 - vh / 2) / vh);
      const target = 0.35 * enter + (hovered.current ? 0.55 : 0) + (still ? 0 : Math.sin(time * 0.0015) * 0.04);
      power += (target - power) * 0.08;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      const cols = w < 640 ? 6 : 12;
      const size = w / cols;
      const cx = w / 2 + pointer.x;
      const cy = h / 2 + pointer.y;
      const R = Math.min(w, h) * 0.22;
      const warp = (x: number, y: number) => {
        const dx = x - cx;
        const dy = y - cy;
        const k = power * Math.exp(-(dx * dx + dy * dy) / (2 * R * R));
        return [x + dx * k, y + dy * k] as const;
      };

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = palette().fg;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const offsetY = (h / 2) % size;
      for (let i = 1; i < cols; i++) {
        const x = i * size;
        for (let y = 0; y <= h; y += 8) {
          const [px, py] = warp(x, y);
          if (y === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      for (let y = offsetY; y <= h; y += size) {
        for (let x = 0; x <= w; x += 8) {
          const [px, py] = warp(x, y);
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    });

    return () => {
      off();
      ro.disconnect();
      sec.removeEventListener('pointermove', move);
    };
  }, []);

  const set = (v: boolean) => () => void (hovered.current = v);

  return (
    <section id="contact" className="cta" ref={section} aria-labelledby="cta-title">
      <canvas ref={canvas} className="cta__grid" aria-hidden="true" />
      <h2 id="cta-title" className="sr-only">
        Start a project
      </h2>
      <a
        className="go"
        href={`mailto:${site.email}`}
        aria-label={`Start a project: email ${site.email}`}
        onPointerEnter={set(true)}
        onPointerLeave={set(false)}
        onFocus={set(true)}
        onBlur={set(false)}
      >
        <span aria-hidden="true">GO</span>
      </a>
      <p className="cta__note">
        Got an idea with a pulse? <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </section>
  );
}
