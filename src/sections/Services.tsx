import { m, type Variants } from 'motion/react';
import { SectionHeading, ServiceItem } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { Icon } from '../components/Icon';
import { services } from '../data/services';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
};

export function Services() {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <FloatingShape kind="diamond" at={{ left: '5%', top: 160 }} />
      <FloatingShape kind="triangle-sm" speed="slow" at={{ right: '5%', top: 260 }} />
      <FloatingShape kind="squiggle" at={{ right: '6%', bottom: 120 }} />
      <FloatingShape kind="diamond-sm" mobile="only" at={{ right: 20, top: 40 }} />
      <div className="wrap">
        <div className="gap-head">
          <SectionHeading eyebrow="What I Do" title="Specializing In" id="services-title" />
        </div>
        <div className="panel">
          <m.ul
            className="svc-grid"
            variants={grid}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((s) => (
              <m.li
                key={s.title}
                variants={cell}
                whileHover={reduced ? undefined : { y: -2 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <ServiceItem icon={<Icon name={s.icon} />} tone={s.tone} title={s.title}>
                  {s.text}
                </ServiceItem>
              </m.li>
            ))}
          </m.ul>
        </div>
      </div>
    </section>
  );
}
