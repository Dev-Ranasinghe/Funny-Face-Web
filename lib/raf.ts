type FrameFn = (time: number, delta: number) => void;

const subscribers = new Set<FrameFn>();
let running = false;
let last = 0;

function loop(time: number) {
  const delta = Math.min(64, time - last || 16);
  last = time;
  subscribers.forEach((fn) => fn(time, delta));
  if (subscribers.size) requestAnimationFrame(loop);
  else running = false;
}

/** One shared rAF loop for every animated component. Returns an unsubscribe. */
export function onFrame(fn: FrameFn) {
  subscribers.add(fn);
  if (!running) {
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
  };
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** 0 → 1 while a tall section scrolls past a sticky viewport. */
export function stickyProgress(el: Element) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
