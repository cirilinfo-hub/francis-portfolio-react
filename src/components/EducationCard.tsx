import type { Education } from '../data/experience';
import { Icon } from './Icon';

/** Compact card that closes the rail: violet hollow node and an icon chip. */
export function EducationCard({ item, compact = false }: { item: Education; compact?: boolean }) {
  return (
    <article className="tl-edu">
      <span className="tl-edu-node" aria-hidden="true" />
      <div className={['edu-card', compact && 'compact'].filter(Boolean).join(' ')}>
        {compact ? null : (
          <span className="fc-chip fc-chip-violet" aria-hidden="true">
            <Icon name="graduation" />
          </span>
        )}
        <div>
          <p className="fc-tl-org edu-org">
            {item.label} · {item.period}
          </p>
          <h3 className="t-title">{item.degree}</h3>
          <p className="t-small">{item.school}</p>
        </div>
      </div>
    </article>
  );
}
