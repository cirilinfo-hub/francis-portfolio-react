import type { ReactNode } from 'react';

export interface TimelineItemProps {
  org?: string;
  title: ReactNode;
  /** Current role: coral node plus the word "Present" in `org` (state is never colour alone). */
  active?: boolean;
  children?: ReactNode;
  className?: string;
}

export function TimelineItem({ org, title, active, children, className }: TimelineItemProps) {
  return (
    <article className={['fc-tl', active && 'fc-tl-active', className].filter(Boolean).join(' ')}>
      <span className="fc-tl-node" aria-hidden="true" />
      <div className="fc-tl-card">
        {org ? <p className="fc-tl-org">{org}</p> : null}
        <h3 className="fc-tl-title">{title}</h3>
        {children ? <p className="fc-tl-text">{children}</p> : null}
      </div>
    </article>
  );
}
