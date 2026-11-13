import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useId, type ReactNode } from 'react';

export interface TimelineItemProps {
  org?: string;
  title: ReactNode;
  /** Current role: coral node plus the word "Present" in `org` (state is never colour alone). */
  active?: boolean;
  children?: ReactNode;
  /** Extra content behind a Show/Hide details toggle. Omit for a plain card. */
  details?: ReactNode;
  /** Controlled open state for `details` (the parent runs the accordion). */
  open?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function TimelineItem({
  org,
  title,
  active,
  children,
  details,
  open = false,
  onToggle,
  className,
}: TimelineItemProps) {
  const regionId = useId();
  const reduced = useReducedMotion();
  const hasDetails = details != null;
  // Visible text stays short; the accessible name says which role (label-in-name holds).
  const toggleText = open ? 'Hide details' : 'Show details';

  return (
    <article
      className={['fc-tl', active && 'fc-tl-active', open && 'fc-tl-open', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="fc-tl-node" aria-hidden="true" />
      <div className="fc-tl-card">
        {org ? <p className="fc-tl-org">{org}</p> : null}
        <h3 className="fc-tl-title">{title}</h3>
        {children ? <p className="fc-tl-text">{children}</p> : null}
        {hasDetails ? (
          <>
            <div id={regionId} className="fc-tl-region">
              <AnimatePresence initial={false}>
                {open ? (
                  <m.div
                    key="details"
                    className="fc-tl-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.28, ease: [0.2, 0, 0, 1] }}
                  >
                    <div className="fc-tl-details-inner">{details}</div>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
            <button
              type="button"
              className="fc-tl-toggle"
              aria-expanded={open}
              aria-controls={regionId}
              aria-label={org ? `${toggleText} for ${org}` : undefined}
              onClick={onToggle}
            >
              {toggleText}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
