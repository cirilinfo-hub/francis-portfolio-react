import { AnimatePresence, m } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { buttonClass } from './ds';
import { Icon } from './Icon';

interface DisclosureProps {
  /** Button text when closed, e.g. "See Earlier Roles (3)". */
  label: string;
  /** Button text when open. Defaults to `label`. */
  openLabel?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Ghost button with aria-expanded and a chevron. The region expands with a
 * Motion layout animation (transform-based FLIP), so nothing below jumps.
 */
export function Disclosure({
  label,
  openLabel,
  children,
  defaultOpen = false,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <m.div layout className={className}>
      <m.div layout="position" className="disclosure-trigger">
        <button
          type="button"
          className={buttonClass('ghost', 'md', 'disclosure')}
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (openLabel ?? label) : label}
          <Icon name="chevronDown" size="sm" />
        </button>
      </m.div>
      <div id={regionId}>
        <AnimatePresence initial={false}>{open ? children : null}</AnimatePresence>
      </div>
    </m.div>
  );
}
