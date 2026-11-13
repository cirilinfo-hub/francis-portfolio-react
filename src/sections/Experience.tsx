import { LayoutGroup, m } from 'motion/react';
import { CurvedRail } from '../components/CurvedRail';
import { Disclosure } from '../components/Disclosure';
import { SectionHeading, TimelineItem } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { EducationCard } from '../components/EducationCard';
import { Reveal } from '../components/Reveal';
import { education, RECENT_ROLE_COUNT, roles, type Role } from '../data/experience';
import { useIsCompact, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const roleItem = (r: Role) => (
  <TimelineItem org={`${r.org} · ${r.period}`} title={r.title} active={r.current}>
    {r.summary}
  </TimelineItem>
);

export function Experience() {
  const compact = useIsCompact();
  return (
    <section className="section bg-raised" id="experience" aria-labelledby="experience-title">
      <FloatingShape kind="diamond" at={{ right: '9%', top: 300 }} />
      <FloatingShape kind="triangle-sm" speed="slow" at={{ left: '8%', top: 520 }} />
      <FloatingShape kind="squiggle" at={{ right: '7%', bottom: 360 }} />
      <FloatingShape kind="diamond-sm" at={{ left: '12%', bottom: 220 }} />
      <div className="wrap">
        <div className="gap-head">
          <SectionHeading eyebrow="Career" title="My Experience" id="experience-title" />
        </div>
        {compact ? <StraightRail /> : <CurvedRail rows={[
          ...roles.map((r) => ({ key: r.org, node: <Reveal>{roleItem(r)}</Reveal> })),
          { key: 'education', node: <Reveal><EducationCard item={education} /></Reveal> },
        ]} />}
      </div>
    </section>
  );
}

/** Mobile: a straight line, the three most recent roles, and a Disclosure for the rest. */
function StraightRail() {
  const reduced = usePrefersReducedMotion();
  const recent = roles.slice(0, RECENT_ROLE_COUNT);
  const earlier = roles.slice(RECENT_ROLE_COUNT);

  return (
    <LayoutGroup>
      <div className="tl-straight">
        <m.span layout className="tl-line" aria-hidden="true" />
        <ol className="tl-stack">
          {recent.map((r) => (
            <li key={r.org}>{roleItem(r)}</li>
          ))}
        </ol>
        <Disclosure
          label={`See Earlier Roles (${earlier.length})`}
          openLabel="Hide Earlier Roles"
          className="tl-more"
        >
          <m.ol
            key="earlier"
            className="tl-stack tl-earlier"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              show: { transition: { staggerChildren: reduced ? 0 : 0.06 } },
            }}
          >
            {earlier.map((r) => (
              <m.li
                key={r.org}
                layout="position"
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : -8 },
                  show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.25 } },
                }}
              >
                {roleItem(r)}
              </m.li>
            ))}
          </m.ol>
        </Disclosure>
        <m.div layout="position" className="tl-edu-wrap">
          <EducationCard item={education} compact />
        </m.div>
      </div>
    </LayoutGroup>
  );
}
