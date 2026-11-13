import { m, type Variants } from 'motion/react';
import { useDeferredValue, useId, useState, useTransition } from 'react';
import { Link } from 'react-router';
import { SectionHeading } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { Icon, type IconName } from '../components/Icon';
import { ProjectGridCard } from '../components/ProjectGridCard';
import { TechIcon } from '../components/TechIcon';
import {
  frameworkOptions,
  frameworkTint,
  projects,
  projectSummary,
  type Framework,
} from '../data/projects';
import { useIsCompact, usePrefersReducedMotion } from '../hooks/useMediaQuery';

type View = 'card' | 'list';

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export function Projects() {
  const compact = useIsCompact();
  const perPage = compact ? 3 : 6;
  const reduced = usePrefersReducedMotion();
  const ids = { q: useId(), fw: useId() };

  const [query, setQuery] = useState('');
  const [fw, setFw] = useState<Framework | 'all'>('all');
  const [view, setView] = useState<View>('card');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Typing stays responsive; the list re-filters at lower priority.
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query || isPending;

  const q = deferredQuery.trim().toLowerCase();
  const found = projects.filter(
    (p) =>
      (fw === 'all' || p.fw === fw) &&
      (!q ||
        `${p.title} ${p.client} ${p.company} ${p.framework} ${p.tags.join(' ')}`
          .toLowerCase()
          .includes(q)),
  );
  const total = found.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, pages);
  const items = found.slice((current - 1) * perPage, current * perPage);
  const from = total ? (current - 1) * perPage + 1 : 0;
  const to = Math.min(current * perPage, total);

  const go = (n: number) => startTransition(() => setPage(n));

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <FloatingShape kind="diamond" at={{ left: '4%', top: 380 }} />
      <FloatingShape kind="squiggle" at={{ right: '4%', top: 140 }} />
      <div className="wrap">
        <SectionHeading
          eyebrow="Portfolios"
          title="Latest Projects"
          align="left"
          id="projects-title"
        >
          19 front-end projects for Eurofins, Cisco, Intel, Visa, Experian and more, from 2011 to
          2026.
        </SectionHeading>

        <ul className="pv-tiles" aria-label="Project summary">
          {projectSummary.map((t) => (
            <li className="pv-tile" key={t.label}>
              <span className={`pv-tile-ic ${t.tint}`} aria-hidden="true">
                <Icon name={t.icon as IconName} />
              </span>
              <span>
                <span className="pv-tile-label">{t.label}</span>
                <span className="pv-tile-num">{t.value}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="pv-panel" id="all-projects">
          <div className="pv-toolbar">
            <div className="pv-search">
              <label className="sr-only" htmlFor={ids.q}>
                Search projects
              </label>
              <Icon name="search" />
              <input
                className="pv-input"
                id={ids.q}
                type="search"
                placeholder="Search project, client or tech"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <label className="sr-only" htmlFor={ids.fw}>
              Framework
            </label>
            <select
              className="pv-select"
              id={ids.fw}
              value={fw}
              onChange={(e) => {
                const next = e.target.value as Framework | 'all';
                startTransition(() => {
                  setFw(next);
                  setPage(1);
                });
              }}
            >
              {frameworkOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="pv-seg" role="group" aria-label="View">
              {(['list', 'card'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => startTransition(() => setView(v))}
                >
                  <Icon name={v === 'list' ? 'list' : 'grid'} />
                  {v === 'list' ? 'List' : 'Card'}
                </button>
              ))}
            </div>
          </div>

          <div className="pv-results" data-stale={isStale || undefined}>
            {total === 0 ? (
              <p className="pv-empty">
                No projects match that search. Try another name, client or technology.
              </p>
            ) : view === 'card' ? (
              <m.div
                key={`${fw}-${current}-${perPage}`}
                className="pv-grid"
                variants={grid}
                initial={reduced ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {items.map((p) => (
                  <ProjectGridCard key={p.slug} project={p} />
                ))}
              </m.div>
            ) : (
              <ul className="pv-list" aria-label="Projects">
                <li className="pv-row pv-row-head" aria-hidden="true">
                  <span>Project</span>
                  <span>Client</span>
                  <span>Company</span>
                  <span>Duration</span>
                  <span>Framework</span>
                  <span>Status</span>
                </li>
                {items.map((p) => (
                  <li className="pv-row" key={p.slug}>
                    <span>
                      <Link to={`/projects/${p.slug}`}>
                        <span className={`pv-avatar ${frameworkTint[p.fw]}`} aria-hidden="true">
                          {p.initials}
                        </span>
                        {p.title}
                      </Link>
                    </span>
                    <span>
                      <span className="pv-cell-label">Client:</span>
                      {p.client}
                    </span>
                    <span>
                      <span className="pv-cell-label">Company:</span>
                      {p.company}
                    </span>
                    <span>
                      <span className="pv-cell-label">Duration:</span>
                      {p.period}
                    </span>
                    <span className="tech-cell">
                      <span className="pv-cell-label">Framework:</span>
                      <TechIcon name={p.framework} />
                      {p.framework}
                    </span>
                    <span>
                      <span className="pv-status">
                        <Icon name="check" />
                        Delivered
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pv-foot">
            <div className="pv-pages" role="group" aria-label="Project pages">
              <button
                className="pv-page"
                type="button"
                disabled={current <= 1}
                onClick={() => go(current - 1)}
              >
                <Icon name="chevronLeft" />
                Previous
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className="pv-page"
                  type="button"
                  aria-current={n === current ? 'page' : undefined}
                  aria-label={`Page ${n}`}
                  onClick={() => go(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="pv-page"
                type="button"
                disabled={current >= pages}
                onClick={() => go(current + 1)}
              >
                Next
                <Icon name="chevronRight" />
              </button>
            </div>
            <p className="pv-count" aria-live="polite">
              Showing {from} to {to} of {total} projects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
