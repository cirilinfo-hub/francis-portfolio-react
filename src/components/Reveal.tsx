import { m } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { supportsViewTimeline } from '../lib/supports';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'figure' | 'aside';
}

/**
 * Scroll reveal. Native CSS scroll-driven animation (`animation-timeline: view()`)
 * where supported; otherwise Motion `whileInView` (IntersectionObserver), once.
 * Opacity + translateY only. The element keeps its layout box the whole time,
 * so nothing shifts. Reduced motion: rendered as-is.
 */
export function Reveal({ children, className, as = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  if (supportsViewTimeline || reduced) {
    const Tag = as as ElementType;
    return <Tag className={['sd-reveal', className].filter(Boolean).join(' ')}>{children}</Tag>;
  }
  const M = m[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </M>
  );
}
