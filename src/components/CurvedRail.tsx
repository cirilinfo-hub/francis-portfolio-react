import { m, useScroll, useTransform } from 'motion/react';
import { useId, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { supportsViewTimeline } from '../lib/supports';

const ROW = 152;
const GAP = 20;
const NODE_CENTER = 8; // px from the row's left edge to the node centre (TimelineItem + EducationCard)

/** The canvas curve, for a 1184px-tall rail: M120 0 C-20 420 -20 764 120 1184. */
function curve(h: number) {
  const k = h / 1184;
  const pts = [
    [120, 0],
    [-20, 420 * k],
    [-20, 764 * k],
    [120, h],
  ] as const;
  const at = (t: number, i: 0 | 1) =>
    (1 - t) ** 3 * pts[0][i] + 3 * (1 - t) ** 2 * t * pts[1][i] + 3 * (1 - t) * t * t * pts[2][i] + t ** 3 * pts[3][i];
  const xAtY = (y: number) => {
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 32; n++) {
      const mid = (lo + hi) / 2;
      if (at(mid, 1) < y) lo = mid;
      else hi = mid;
    }
    return at(lo, 0);
  };
  return { d: `M120 0C-20 ${420 * k} -20 ${764 * k} 120 ${h}`, xAtY };
}

interface CurvedRailProps {
  /** One node per row, already wrapped (TimelineItem / EducationCard). */
  rows: { key: string; node: ReactNode }[];
}

/**
 * Desktop/tablet: an SVG arc in the line colour that places each row's node on
 * the curve. The line draws in as the section scrolls: native
 * `animation-timeline: view()` on a mask (transform: scaleY), Motion useScroll
 * as the fallback. ≤640px the parent swaps this for a straight rail.
 */
export function CurvedRail({ rows }: CurvedRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const maskId = `tl-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const reduced = usePrefersReducedMotion();
  const h = rows.length * ROW + (rows.length - 1) * GAP;
  const { d, xAtY } = curve(h);
  const jsFallback = !supportsViewTimeline && !reduced;

  return (
    <div className="tl-wrap" ref={ref}>
      <svg className="tl-curve" viewBox={`0 0 200 ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-40" y="0" width="280" height={h}>
            {jsFallback ? (
              <FallbackRevealRect target={ref} h={h} />
            ) : (
              <rect className={reduced ? undefined : 'tl-reveal'} x="-40" y="0" width="280" height={h} fill="white" />
            )}
          </mask>
        </defs>
        <path d={d} mask={`url(#${maskId})`} />
      </svg>
      <ol className="tl-list">
        {rows.map((r, i) => {
          const y = i * (ROW + GAP) + ROW / 2;
          return (
            <li key={r.key} className="tl-row" style={{ paddingLeft: Math.round(xAtY(y) - NODE_CENTER) }}>
              {r.node}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function FallbackRevealRect({ target, h }: { target: React.RefObject<HTMLDivElement | null>; h: number }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 85%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <m.rect
      x="-40"
      y="0"
      width="280"
      height={h}
      fill="white"
      style={{ scaleY, transformBox: 'fill-box', transformOrigin: '50% 0%' }}
    />
  );
}
