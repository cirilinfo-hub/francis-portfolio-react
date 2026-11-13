import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently under the sticky nav, for
 * aria-current on the nav links. One IntersectionObserver, no scroll handler.
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled) return;
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = sections.find((s) => visible.get(s.id));
        setActive(first ? first.id : null);
      },
      // A band just below the nav: a section is "current" while it crosses it.
      { rootMargin: '-96px 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
