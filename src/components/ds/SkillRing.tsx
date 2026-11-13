import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { TechIcon } from '../TechIcon';
import type { Tone } from './types';

const R = 24;
const C = 2 * Math.PI * R; // 150.8, as in the canvas

export interface SkillRingProps {
  label: string;
  /** Figure printed in the ring, e.g. "18+". */
  display: string;
  years: number;
  /** Years the arc is measured against (the career length). */
  outOf: number;
  span: string;
  tone?: Tone;
  className?: string;
}

/**
 * SkillRing, years variant. Prints years inside the ring; the arc shows years
 * out of the whole career. role="img" with the final value in its label from
 * the first render, so the animation never changes what is announced.
 *
 * On first view the arc draws from 0 and the figure counts up with it. The arc
 * uses stroke-dashoffset (paint only, 56px box), the one non-transform property
 * animated on the page besides the theme reveal; see README.
 */
export function SkillRing({
  label,
  display,
  years,
  outOf,
  span,
  tone = 'coral',
  className,
}: SkillRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();

  const fraction = Math.min(years, outOf) / outOf;
  const finalOffset = C * (1 - fraction);
  const animated = !reduced;

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!animated || !inView || done) return;
    const controls = animate(0, 1, {
      duration: 1.1,
      ease: [0.2, 0, 0, 1],
      onUpdate: (t) => {
        barRef.current?.setAttribute('stroke-dashoffset', String(C * (1 - fraction * t)));
        if (numRef.current) numRef.current.textContent = String(Math.round(years * t));
      },
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [animated, inView, done, fraction, years]);

  // Until the count finishes (motion allowed), React renders the empty state and
  // the animation writes frames directly; the final render shows `display`.
  const startEmpty = animated && !done;

  return (
    <div
      ref={ref}
      className={['ring', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={`${label}: ${display} yrs, ${span}`}
    >
      <span className={`ring-dial tone-${tone}`}>
        <svg viewBox="0 0 56 56" aria-hidden="true">
          <circle className="ring-track" cx="28" cy="28" r={R} />
          <circle
            ref={barRef}
            className="ring-bar"
            cx="28"
            cy="28"
            r={R}
            strokeDasharray={C.toFixed(1)}
            strokeDashoffset={(startEmpty ? C : finalOffset).toFixed(1)}
          />
        </svg>
        <span className="ring-num">
          {startEmpty ? <span ref={numRef}>0</span> : <span>{display}</span>}
          <small>yrs</small>
        </span>
      </span>
      <span className="ring-copy">
        <span className="ring-label">
          <TechIcon name={label} />
          {label}
        </span>
        <span className="t-small">{span}</span>
      </span>
    </div>
  );
}
