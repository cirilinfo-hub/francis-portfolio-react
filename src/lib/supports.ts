import { useSyncExternalStore } from 'react';

const noop = () => () => {};
const check = (q: string) => typeof CSS !== 'undefined' && CSS.supports(q);

/**
 * Native scroll-driven animations (CSS animation-timeline).
 * Prerendered HTML assumes support (current Chrome, Edge and Safari), so
 * hydration matches; browsers without it switch to the JS fallback right after.
 */
export function useNativeViewTimeline(): boolean {
  return useSyncExternalStore(
    noop,
    () => check('animation-timeline: view()'),
    () => true,
  );
}

export function useNativeScrollTimeline(): boolean {
  return useSyncExternalStore(
    noop,
    () => check('animation-timeline: scroll()'),
    () => true,
  );
}
