'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { onFrame, reducedMotion } from '@/lib/raf';

export default function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    const off = onFrame((t) => lenis.raf(t));
    return () => {
      off();
      lenis.destroy();
    };
  }, []);
  return null;
}
