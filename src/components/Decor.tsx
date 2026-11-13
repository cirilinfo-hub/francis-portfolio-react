import { m, type MotionValue } from 'motion/react';
import type { CSSProperties } from 'react';

/** Violet field printed with the on-violet-dim dot grid at a 34px pitch. Decorative. */
export function DotField({
  className,
  style,
  x,
  y,
}: {
  className?: string;
  style?: CSSProperties;
  /** Optional parallax offsets (transform only). */
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}) {
  return (
    <m.div
      className={['violet-field', className].filter(Boolean).join(' ')}
      style={{ ...style, x, y }}
      aria-hidden="true"
    />
  );
}

export type ShapeKind = 'diamond' | 'diamond-sm' | 'triangle' | 'triangle-sm' | 'squiggle';

export interface FloatingShapeProps {
  kind: ShapeKind;
  /** Absolute position, as in the canvas (e.g. { left: '6%', top: 70 }). Must not overlap text. */
  at: CSSProperties;
  /** Drift period: 9s (default), 11s or 13s. */
  speed?: 'default' | 'mid' | 'slow';
  /** Size override for SVG shapes, e.g. { width: 44, height: 22 }. */
  size?: { width: number; height: number };
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  /**
   * ≤640px visibility. Default 'hide': at phone width most canvas positions
   * would cross text, so only the shapes the mobile artboard shows are kept.
   */
  mobile?: 'hide' | 'show' | 'only';
}

/**
 * Lilac diamond, triangle or squiggle. Drifts up to 6px across and 10px up
 * (CSS `translate`, 9–13s, alternating). Pointer parallax, when given, uses
 * `transform` so the two never fight. Reduced motion: still.
 */
export function FloatingShape({
  kind,
  at,
  speed = 'default',
  size,
  x,
  y,
  mobile = 'hide',
}: FloatingShapeProps) {
  const cls = ['deco', speed !== 'default' && speed].filter(Boolean).join(' ');
  // Parallax lives on an outer wrapper so its transform does not replace the diamond's rotate(45deg).
  const wrapStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
    ...at,
  };

  let shape;
  if (kind === 'diamond' || kind === 'diamond-sm') {
    shape = <span className={`${cls} deco-diamond${kind === 'diamond-sm' ? ' sm' : ''}`} />;
  } else if (kind === 'squiggle') {
    const s = size ?? { width: 48, height: 24 };
    shape = (
      <svg className={`${cls} deco-svg`} style={s} viewBox="0 0 48 24">
        <path d="M3 12c5-8 9-8 14 0s9 8 14 0 9-8 14 0" />
      </svg>
    );
  } else {
    const s = size ?? (kind === 'triangle' ? { width: 34, height: 30 } : { width: 30, height: 30 });
    shape = (
      <svg
        className={`${cls} deco-svg`}
        style={s}
        viewBox={kind === 'triangle' ? '0 0 34 30' : '0 0 30 30'}
      >
        <path d={kind === 'triangle' ? 'M17 3 31 27H3Z' : 'M15 3 27 26H3Z'} />
      </svg>
    );
  }

  return (
    <m.span className={`shape shape-m-${mobile}`} style={{ ...wrapStyle, x, y }} aria-hidden="true">
      {shape}
    </m.span>
  );
}
