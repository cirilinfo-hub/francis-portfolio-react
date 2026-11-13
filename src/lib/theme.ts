import { flushSync } from 'react-dom';
import { prefersReducedMotion } from '../hooks/useMediaQuery';

export type Theme = 'light' | 'dark';

const KEY = 'fc-theme';
const listeners = new Set<() => void>();
const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)');

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/** The theme on screen: the saved choice, otherwise the system preference. */
export function getTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return stored() ?? (systemDark().matches ? 'dark' : 'light');
}

export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  const mql = systemDark();
  mql.addEventListener('change', cb);
  return () => {
    listeners.delete(cb);
    mql.removeEventListener('change', cb);
  };
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  listeners.forEach((l) => l());
}

/**
 * Switches theme. Where View Transitions are supported (and motion is allowed)
 * the new theme is revealed as a circle growing from `origin`.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  if (theme === getTheme()) return apply(theme);

  if (!document.startViewTransition || prefersReducedMotion()) {
    apply(theme);
    return;
  }

  const root = document.documentElement;
  root.classList.add('theme-vt');
  const vt = document.startViewTransition(() => {
    flushSync(() => apply(theme));
  });

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  vt.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 420,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    )
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}
