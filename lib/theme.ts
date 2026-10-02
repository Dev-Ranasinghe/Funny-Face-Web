let cache: { fg: string; bg: string } | null = null;

/** Resolved palette for canvas drawing; invalidated when the theme flips. */
export function palette() {
  if (!cache) {
    const cs = getComputedStyle(document.documentElement);
    cache = { fg: cs.getPropertyValue('--fg').trim(), bg: cs.getPropertyValue('--bg').trim() };
  }
  return cache;
}

export function setTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('ff-theme', theme);
  } catch {}
  cache = null;
}
