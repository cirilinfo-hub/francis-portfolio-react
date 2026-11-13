import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  align?: 'center' | 'left';
  level?: 1 | 2 | 3;
  id?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Eyebrow + title + optional lede.
 * Spec motion: fades up once on first view (opacity 0→1, 8px→0, 200ms ease).
 * Reduced motion: appears without the fade.
 */
export function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  level = 2,
  id,
  children,
  className,
}: SectionHeadingProps) {
  const reduced = usePrefersReducedMotion();
  const Title = `h${level}` as const;
  return (
    <m.header
      className={['fc-heading', `fc-heading-${align}`, className].filter(Boolean).join(' ')}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {eyebrow ? <p className="fc-eyebrow">{eyebrow}</p> : null}
      <Title className="fc-heading-title" id={id}>
        {title}
      </Title>
      {children ? <p className="fc-heading-lede">{children}</p> : null}
    </m.header>
  );
}
