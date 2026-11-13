import { m, useScroll } from 'motion/react';
import { supportsScrollTimeline } from '../lib/supports';

/**
 * Reading progress under the nav. Native CSS `animation-timeline: scroll()`
 * where supported; otherwise Motion's useScroll drives scaleX. Transform only.
 */
export function ScrollProgress() {
  return supportsScrollTimeline ? (
    <span className="scroll-progress is-native" aria-hidden="true" />
  ) : (
    <ScrollProgressFallback />
  );
}

function ScrollProgressFallback() {
  const { scrollYProgress } = useScroll();
  return <m.span className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}
