import { useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import type { PointerEvent } from 'react';
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery';

export interface Parallax {
  enabled: boolean;
  /** Normalised pointer position, -1..1 on each axis, spring-smoothed. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  layer: (strength: number) => { x: MotionValue<number>; y: MotionValue<number> };
  handlers: {
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: () => void;
  };
}

/**
 * Subtle pointer parallax. `layer(n)` returns x/y motion values that move at
 * most `n` px (negative = opposite direction). Transform only; no listeners and
 * no movement for reduced motion or touch.
 */
export function usePointerParallax(): Parallax {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const enabled = !reduced && fine;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  // Two fixed layers keep the hook count stable.
  const fieldX = useTransform(px, (v) => v * -6);
  const fieldY = useTransform(py, (v) => v * -6);
  const shapeX = useTransform(px, (v) => v * 8);
  const shapeY = useTransform(py, (v) => v * 8);

  const layer = (strength: number) =>
    strength < 0 ? { x: fieldX, y: fieldY } : { x: shapeX, y: shapeY };

  const handlers = enabled
    ? {
        onPointerMove: (e: PointerEvent<HTMLElement>) => {
          const r = e.currentTarget.getBoundingClientRect();
          rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
          rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
        },
        onPointerLeave: () => {
          rawX.set(0);
          rawY.set(0);
        },
      }
    : {};

  return { enabled, px, py, layer, handlers };
}
