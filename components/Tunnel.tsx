'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { onFrame } from '@/lib/raf';
import { palette } from '@/lib/theme';

/**
 * Draws a corridor in true perspective: the column is the back wall at z=0,
 * side walls, ceiling and floor run toward the viewer. Projected in 2D so
 * every line stays a crisp hairline no matter how close it gets.
 */
export default function Tunnel({
  section,
  column,
}: {
  section: RefObject<HTMLElement | null>;
  column: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return onFrame(() => {
      const sec = section.current;
      const col = column.current;
      if (!sec || !col || !w) return;
      const sr = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (sr.bottom < 0 || sr.top > vh) return;
      const cr = canvas.getBoundingClientRect();
      const colR = col.getBoundingClientRect();

      // Viewport coordinates, shifted into the canvas when drawn.
      // Rows are page-anchored lines scaled around a vanishing point: gently at
      // the column edge, a little more at the screen edge, so they fan out.
      // The vanishing point slides from above the screen to below it as the
      // section scrolls, turning the fan from "looking up" to "looking down".
      const L = colR.left;
      const R = colR.right;
      const T = sr.top;
      const B = sr.bottom;
      const leftEdge = cr.left;
      const rightEdge = cr.left + w;
      const p = Math.min(1, Math.max(0, -T / Math.max(1, sr.height - vh)));
      const cy = vh * (-0.49 + 2.13 * p);
      const F_COL = 0.78;
      const F_EDGE = 0.93;
      const at = (y: number, f: number) => cy + (y - cy) * f - cr.top;
      const seg = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.moveTo(x1 - cr.left, y1);
        ctx.lineTo(x2 - cr.left, y2);
      };

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = palette().fg;
      ctx.lineWidth = 1;
      ctx.beginPath();

      const K = [0.061, 0.248, 0.561];
      const xl = (k: number) => L - (L - leftEdge) * k;
      const xr = (k: number) => R + (rightEdge - R) * k;
      // Ceiling and floor are flat fans between the column ends and the section edges.
      const ceilY = (k: number) => colR.top + (T - colR.top) * k;
      const floorY = (k: number) => colR.bottom + (B - colR.bottom) * k;

      // Wall rows, anchored to the page (drawn first so floor/ceiling cover them).
      const gap = vh * 0.33;
      const first = Math.ceil((T - vh * 2 - T) / gap);
      for (let k = first; ; k++) {
        const y = T + k * gap;
        if (y > B + vh * 2) break;
        const yc = at(y, F_COL);
        const ye = at(y, F_EDGE);
        if (Math.max(yc, ye) < -10 || Math.min(yc, ye) > h + 10) continue;
        seg(L, yc, leftEdge, ye);
        seg(R, yc, rightEdge, ye);
      }
      ctx.stroke();

      // Mask the ceiling and floor trapezoids so rows never cross them.
      ctx.fillStyle = palette().bg;
      const trap = (yCol: number, yEdge: number) => {
        ctx.beginPath();
        ctx.moveTo(L - cr.left, yCol - cr.top);
        ctx.lineTo(R - cr.left, yCol - cr.top);
        ctx.lineTo(rightEdge - cr.left, yEdge - cr.top);
        ctx.lineTo(leftEdge - cr.left, yEdge - cr.top);
        ctx.closePath();
        ctx.fill();
      };
      trap(colR.top, T);
      trap(colR.bottom, B);

      ctx.beginPath();
      // Wall slices run between the ceiling and floor lines at the same fraction.
      for (const k of K) {
        seg(xl(k), ceilY(k) - cr.top, xl(k), floorY(k) - cr.top);
        seg(xr(k), ceilY(k) - cr.top, xr(k), floorY(k) - cr.top);
        seg(xl(k), floorY(k) - cr.top, xr(k), floorY(k) - cr.top);
        seg(xl(k), ceilY(k) - cr.top, xr(k), ceilY(k) - cr.top);
      }
      // Rays: twelve segments from the column ends to the section edges.
      for (let k = 0; k <= 12; k++) {
        const ex = leftEdge + (w * k) / 12;
        const cxk = L + ((R - L) * k) / 12;
        seg(ex, T - cr.top, cxk, colR.top - cr.top);
        seg(ex, B - cr.top, cxk, colR.bottom - cr.top);
      }
      // Diagonal corner edges from the column corners to the section corners.
      seg(L, colR.bottom - cr.top, leftEdge, B - cr.top);
      seg(R, colR.bottom - cr.top, rightEdge, B - cr.top);
      ctx.stroke();
    });
  }, [section, column]);

  return <canvas ref={ref} className="about__tunnel" aria-hidden="true" />;
}
