import { m, useMotionValue, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const MAX = 4; // px. "A few pixels", no more.

/**
 * Pulls its child a few pixels toward the pointer while hovered.
 * Transform only; off for reduced motion and for touch/coarse pointers.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.4 });

  if (reduced || !fine) return <span className="fc-btn-magnetic">{children}</span>;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * MAX);
    y.set(Math.max(-1, Math.min(1, dy)) * MAX);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      className="fc-btn-magnetic"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}
