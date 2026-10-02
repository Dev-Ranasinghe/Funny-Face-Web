'use client';

import { useEffect, useRef } from 'react';
import { easeOut, onFrame, reducedMotion } from '@/lib/raf';
import { palette } from '@/lib/theme';

// Travelling "pinches" pull neighbouring lines together into folds.
const PINCHES = [
  { x: 0.08, y: 0.2, sx: 0.035, sy: 0.9, s: 0.7, speed: 0.19, phase: 0, tilt: -0.15 },
  { x: 0.44, y: 0.85, sx: 0.04, sy: 0.55, s: 0.75, speed: 0.14, phase: 2.1, tilt: 0.3 },
  { x: 0.66, y: 0.45, sx: 0.06, sy: 0.7, s: 0.45, speed: 0.17, phase: 4.2, tilt: -0.25 },
  { x: 0.965, y: 0.6, sx: 0.03, sy: 0.8, s: 0.8, speed: 0.11, phase: 1.3, tilt: 0.1 },
];

export default function HeroLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const host = canvas.parentElement!;
    const still = reducedMotion();
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0 };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (mouse.power < 0.01) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.target = 1;
    };
    const leave = () => (mouse.target = 0);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let revealStart = 0;
    const off = onFrame((time) => {
      if (!visible || !w) return;
      if (document.documentElement.dataset.loaded && !revealStart) revealStart = time;
      const reveal = revealStart ? Math.min(1, (time - revealStart) / 1500) : 0;
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      mouse.power += (mouse.target - mouse.power) * 0.05;

      ctx.clearRect(0, 0, w, h);
      const e = easeOut(reveal);
      if (e <= 0) return;

      const t = still ? 0 : time * 0.001;
      const gap = Math.max(5, Math.min(9, w / 215));
      const count = Math.floor(w / gap);
      const ox = (w - (count - 1) * gap) / 2;
      const half = (h / 2) * e;
      const y0 = h / 2 - half;
      const y1 = h / 2 + half;
      const step = 7;
      const radius = Math.min(w, h) * 0.22;

      const centres = PINCHES.map((p) => ({
        ...p,
        cx: (p.x + 0.07 * Math.sin(t * p.speed + p.phase)) * w,
        cy: (p.y + 0.18 * Math.sin(t * p.speed * 0.7 + p.phase)) * h,
        sxw: p.sx * w,
        syh: p.sy * h,
      }));

      ctx.strokeStyle = palette().fg;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const bx = ox + i * gap;
        for (let y = y0, first = true; y <= y1 + 0.5; y += step) {
          const ny = y / h;
          // Broad S-curve sway shared by neighbours, plus a finer ripple.
          let d =
            Math.sin(ny * 3.4 + (bx / w) * 7 + t * 0.35) * 14 * Math.sin(ny * Math.PI) +
            Math.sin(y * 0.02 + bx * 0.006 + t * 0.9) * 2.5;
          for (const c of centres) {
            const cx = c.cx + c.tilt * (y - c.cy) + Math.sin(y * 0.008 + t * 0.6 + c.phase) * 26;
            const dx = bx - cx;
            const dy = y - c.cy;
            d -= c.s * dx * Math.exp(-(dx * dx) / (2 * c.sxw * c.sxw) - (dy * dy) / (2 * c.syh * c.syh));
          }
          if (mouse.power > 0.001) {
            const dx = bx - mouse.x;
            const dy = y - mouse.y;
            d += mouse.power * 0.8 * dx * Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius));
          }
          if (first) {
            ctx.moveTo(bx + d, y);
            first = false;
          } else ctx.lineTo(bx + d, y);
        }
      }
      ctx.stroke();
    });

    return () => {
      off();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
