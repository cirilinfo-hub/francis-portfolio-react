import { useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query. Reads synchronously, so the first render is correct. */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * The single source of truth for reduced motion in JS. CSS uses the same
 * media query in src/styles/motion.css; Motion components follow
 * <MotionConfig reducedMotion="user">.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Fine pointer with hover: parallax and magnetic effects only make sense here. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/** Matches the canvas mobile artboard (390) and the 640px breakpoint in site.css. */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 640px)');
}
