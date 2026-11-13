import { m } from 'motion/react';
import { ViewTransition } from 'react';
import { Link } from 'react-router';
import { frameworkTint, type Project } from '../data/projects';
import { cardVariants, projectTitleTransition } from '../lib/projectMotion';
import { Icon, type IconName } from './Icon';
import { TagList } from './Small';
import { TechIcon } from './TechIcon';

const FW_ICON: Record<Project['fw'], IconName> = { angular: 'layers', react: 'atom', web: 'code' };

/**
 * Project card from the canvas projects panel: icon, title, status, meta list,
 * tech tags and a "View Details" link. Hover rises 1px on a gentle spring and
 * the title turns violet-ink with an underline (Spec).
 */
export function ProjectGridCard({ project: p }: { project: Project }) {
  const tint = frameworkTint[p.fw];
  return (
    <m.article
      className="pv-card"
      variants={cardVariants}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="pv-card-head">
        <span className={`pv-card-ic ${tint}`} aria-hidden="true">
          <Icon name={FW_ICON[p.fw]} />
        </span>
        <ViewTransition name={projectTitleTransition(p.slug)} default="none" share="auto">
          <h3 className="pv-card-title" title={p.title}>
            {p.title}
          </h3>
        </ViewTransition>
        <span className="pv-status">
          <Icon name="check" />
          Delivered
        </span>
      </div>
      <dl className="pv-meta">
        <div>
          <dt>Client:</dt>
          <dd>
            <span className={`pv-avatar ${tint}`} aria-hidden="true">
              {p.initials}
            </span>
            {p.client}
          </dd>
        </div>
        <div>
          <dt>Company:</dt>
          <dd>{p.company}</dd>
        </div>
        <div>
          <dt>Duration:</dt>
          <dd>{p.period}</dd>
        </div>
        <div>
          <dt>Framework:</dt>
          <dd>
            <TechIcon name={p.framework} />
            {p.framework}
          </dd>
        </div>
      </dl>
      <TagList items={p.tags} label="Tech stack" neutral tech />
      <Link className="pv-btn" to={`/projects/${p.slug}`} aria-label={`View details: ${p.title}`}>
        View Details
        <Icon name="arrowRight" />
      </Link>
    </m.article>
  );
}
