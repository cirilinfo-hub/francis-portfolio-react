import { LayoutGroup, m } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CurvedRail } from '../components/CurvedRail';
import { Disclosure } from '../components/Disclosure';
import { SectionHeading, TimelineItem } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { EducationCard } from '../components/EducationCard';
import { Reveal } from '../components/Reveal';
import { education, RECENT_ROLE_COUNT, roles, type Role } from '../data/experience';
import { projects } from '../data/projects';
import { useIsCompact, usePrefersReducedMotion } from '../hooks/useMediaQuery';

function RoleDetails({ role }: { role: Role }) {
  const work = projects.filter((p) => p.company === role.org);
  return (
    <>
      <p className="role-meta">
        {role.dates} · {role.location}
      </p>
      {role.highlights.length ? (
        <ul className="role-points">
          {role.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
      {work.length ? (
        <div className="role-projects">
          <p className="role-projects-label">Projects</p>
          <ul>
            {work.map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`}>
                  {p.client === p.title || role.org.startsWith(p.client)
                    ? p.title
                    : `${p.title} · ${p.client}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

/** Roles with no extra CV detail render as plain cards (no toggle). */
const hasDetails = (r: Role) =>
  r.highlights.length > 0 || projects.some((p) => p.company === r.org);

type Accordion = { openOrg: string | null; toggle: (org: string) => void };

const roleItem = (r: Role, { openOrg, toggle }: Accordion) => (
  <TimelineItem
    org={`${r.org} · ${r.period}`}
    title={r.title}
    active={r.current}
    details={hasDetails(r) ? <RoleDetails role={r} /> : undefined}
    open={openOrg === r.org}
    onToggle={() => toggle(r.org)}
  >
    {r.summary}
  </TimelineItem>
);

export function Experience() {
  const compact = useIsCompact();
  // Accordion: one role open at a time; clicking the open one closes it.
  const [openOrg, setOpenOrg] = useState<string | null>(null);
  const acc: Accordion = {
    openOrg,
    toggle: (org) => setOpenOrg((cur) => (cur === org ? null : org)),
  };
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
        {compact ? (
          <StraightRail acc={acc} />
        ) : (
          <CurvedRail
            rows={[
              ...roles.map((r) => ({ key: r.org, node: <Reveal>{roleItem(r, acc)}</Reveal> })),
              {
                key: 'education',
                node: (
                  <Reveal>
                    <EducationCard item={education} />
                  </Reveal>
                ),
              },
            ]}
          />
        )}
      </div>
    </section>
  );
}

/** Mobile: a straight line, the three most recent roles, and a Disclosure for the rest. */
function StraightRail({ acc }: { acc: Accordion }) {
  const reduced = usePrefersReducedMotion();
  const recent = roles.slice(0, RECENT_ROLE_COUNT);
  const earlier = roles.slice(RECENT_ROLE_COUNT);

  return (
    <LayoutGroup>
      <div className="tl-straight">
        <m.span layout className="tl-line" aria-hidden="true" />
        <ol className="tl-stack">
          {recent.map((r) => (
            <li key={r.org}>{roleItem(r, acc)}</li>
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
                {roleItem(r, acc)}
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
