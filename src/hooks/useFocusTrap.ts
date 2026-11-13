import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab inside `ref` while `active`, focuses `initial` (or
 * the first focusable element) on open, calls `onEscape` on Esc, and returns
 * focus to `returnTo` when the trap is released.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void,
  options: { initial?: string; returnTo?: RefObject<HTMLElement | null> } = {},
) {
  const { initial, returnTo } = options;
  useEffect(() => {
    const node = ref.current;
    if (!active || !node) return;

    const back = returnTo?.current ?? null;
    const items = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    const start = (initial ? node.querySelector<HTMLElement>(initial) : null) ?? items()[0];
    start?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = items();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      back?.focus();
    };
  }, [ref, active, onEscape, initial, returnTo]);
}

/** Locks page scroll without a layout jump (scrollbar-gutter keeps the width). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    html.style.scrollbarGutter = 'stable';
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev.overflow;
      html.style.scrollbarGutter = prev.gutter;
    };
  }, [active]);
}
