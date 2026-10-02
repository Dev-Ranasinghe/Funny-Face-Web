'use client';

import { setTheme } from '@/lib/theme';
import { Icon } from './Marks';

export default function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    setTheme(dark ? 'light' : 'dark');
  };
  return (
    <button type="button" className="head__theme cell" onClick={toggle} aria-label="Toggle dark theme">
      <Icon name="theme" />
    </button>
  );
}
