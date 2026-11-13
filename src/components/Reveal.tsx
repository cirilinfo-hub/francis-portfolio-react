import { m, useInView } from 'motion/react';
import { useRef, type ReactNode, type Ref } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { useNativeViewTimeline } from '../lib/supports';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}

// Same as the CSS version: movement only, never reduced contrast.
const shown = { y: 0 };
const hidden = { y: 24 };

/**
 * Scroll reveal. Native CSS scroll-driven animation (`.sd-reveal`,
 * `animation-timeline: view()`) where supported; otherwise Motion animates
 * on an IntersectionObserver (useInView), once. translateY only (text keeps full contrast);
 * the element keeps its layout box the whole time, so nothing shifts.
 * The same element renders on the server and the client, so hydration matches.
 */
export function Reveal({ children, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const native = useNativeViewTimeline();
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const fallback = !native && !reduced;
  const M = m[as] as typeof m.div;

  return (
    <M
      ref={ref as Ref<HTMLDivElement>}
      className={['sd-reveal', className].filter(Boolean).join(' ')}
      initial={false}
      animate={fallback ? (inView ? shown : hidden) : undefined}
      transition={{ duration: inView ? 0.45 : 0, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </M>
  );
}
