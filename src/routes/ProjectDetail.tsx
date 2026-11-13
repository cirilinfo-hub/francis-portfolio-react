import { ViewTransition, type ReactNode } from 'react';
import { Link, useLoaderData } from 'react-router';
import { Button } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { Icon, type IconName } from '../components/Icon';
import { projectTitleTransition } from '../lib/projectMotion';
import { Reveal } from '../components/Reveal';
import { PlaceholderNote, ScreenshotPlaceholder, TagList } from '../components/Small';
import type { Tone } from '../components/ds/types';
import type { loader } from './projectDetailLoader';
import './project-detail.css';

/** Numbered section with an icon chip: Overview, My Role, Stack, Impact. */
function NumberedBlock({
  n,
  title,
  icon,
  tone,
  children,
}: {
  n: number;
  title: string;
  icon: IconName;
  tone: Tone;
  children: ReactNode;
}) {
  const id = `pd-${title.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <Reveal as="article" className="pd-block">
      <span className={`fc-chip fc-chip-${tone}`} aria-hidden="true">
        <Icon name={icon} />
      </span>
      <div>
        <p className="t-eyebrow">{String(n).padStart(2, '0')}</p>
        <h2 className="t-section pd-h" id={id}>
          {title}
        </h2>
      </div>
      <div className="pd-body">{children}</div>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { project: p, prev, next } = useLoaderData<typeof loader>();
  const cs = p.caseStudy;
  const year = (s: string) => s.match(/\d{4}/g) ?? [];
  const years = year(p.period);
  const eyebrow = `${p.client} · ${years.length > 1 ? `${years[0]} – ${years[years.length - 1]}` : p.period}`;
  const headTags = cs?.headTags ?? [p.framework, ...p.tags];

  return (
    <article className="pd" aria-labelledby="pd-title">
      <title>{`${p.title} — Francis Ciril Arulsamy`}</title>
      <meta
        name="description"
        content={cs?.lede ?? `${p.title}: a ${p.framework} project for ${p.client}, delivered with ${p.company}.`}
      />

      <section className="pd-hero">
        <FloatingShape kind="diamond" at={{ right: '8%', top: 80 }} />
        <FloatingShape kind="squiggle" at={{ right: '14%', top: 200 }} />
        <div className="wrap pd-head">
          <nav aria-label="Breadcrumb">
            <Link className="pd-back" to="/#projects">
              <Icon name="arrowLeft" size="sm" />
              All Projects
            </Link>
          </nav>
          <p className="t-eyebrow">{eyebrow}</p>
          <ViewTransition name={projectTitleTransition(p.slug)} default="none" share="auto">
            <h1 className="t-section pd-title" id="pd-title">
              {p.title}
            </h1>
          </ViewTransition>
          {cs ? <p className="t-body pd-lede">{cs.lede}</p> : null}
          <TagList items={headTags} label="Tech stack" />
        </div>
        <div className="wrap pd-shot-wrap">
          <ScreenshotPlaceholder
            className="pd-shot"
            label={`Screenshot placeholder: ${p.title} main screen. Final alt text should describe what the screen does.`}
            tag="Screenshot Placeholder · 16:10 Flat, No Device Frame"
            bars={[55, 35, 70, 45, 80, 30, 60, 50]}
          />
        </div>
      </section>

      <section className="section" aria-label="Case study">
        <div className="wrap">
          <div className="split pd-split">
            <div className="col-8">
              {cs ? (
                <>
                  <NumberedBlock n={1} title="Overview" icon="info" tone="sky">
                    <p className="t-body">{cs.overview}</p>
                  </NumberedBlock>
                  <NumberedBlock n={2} title="My Role" icon="user" tone="violet">
                    <ul className="pd-list">
                      {cs.role.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </NumberedBlock>
                  <NumberedBlock n={3} title="Stack" icon="layers" tone="coral">
                    <p className="t-body">{cs.stackSummary}</p>
                    <TagList items={cs.stackTags} neutral />
                  </NumberedBlock>
                  <NumberedBlock n={4} title="Impact" icon="gauge" tone="mint">
                    <p className="t-body">{cs.impact}</p>
                    <PlaceholderNote>Add A Measured Outcome Only Once Confirmed</PlaceholderNote>
                  </NumberedBlock>
                </>
              ) : (
                <div className="pd-pending">
                  <PlaceholderNote>Case Study To Be Written</PlaceholderNote>
                  <p className="t-body">
                    The overview, role, stack and impact write-up for this project has not been supplied yet. The
                    facts on the right come from the project list.
                  </p>
                </div>
              )}
            </div>
            <aside className="col-4" aria-label="Project facts">
              <dl className="facts-card panel">
                {(cs?.facts ?? [
                  { label: 'Client', value: p.client },
                  { label: 'Company', value: p.company },
                  { label: 'Period', value: p.period },
                  { label: 'Framework', value: p.framework },
                ]).map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
                <div>
                  <dt>Stack</dt>
                  <dd>
                    <TagList items={[p.framework, ...p.tags].slice(0, 3)} />
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {cs && cs.screenshots.length > 0 ? (
        <section className="section bg-raised pd-more" aria-labelledby="pd-more">
          <div className="wrap pd-more-in">
            <h2 className="t-title" id="pd-more">
              More Screens
            </h2>
            <div className="pd-more-grid">
              {cs.screenshots.map((s, i) => (
                <figure key={s.alt} className="pd-fig">
                  <ScreenshotPlaceholder label={s.alt} bars={i % 2 ? [65, 35, 75, 50] : [40, 70, 55, 30]} />
                  <figcaption className="t-small">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section pd-end" aria-label="More projects and contact">
        <div className="wrap pd-end-in">
          <nav className="pager" aria-label="More projects">
            <Link to={`/projects/${prev.slug}`} rel="prev">
              <span className="pcard-meta">Previous</span>
              <span className="t-title">
                {prev.title} · {prev.client}
              </span>
            </Link>
            <Link to={`/projects/${next.slug}`} rel="next" className="pager-next">
              <span className="pcard-meta">Next</span>
              <span className="t-title">
                {next.title} · {next.client}
              </span>
            </Link>
          </nav>
          <div className="panel pd-cta">
            <div className="pd-cta-copy">
              <p className="t-eyebrow">Get In Touch</p>
              <h2 className="t-section">Let&apos;s Work Together</h2>
            </div>
            <Button variant="primary" to="/#contact">
              Hire Me
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
