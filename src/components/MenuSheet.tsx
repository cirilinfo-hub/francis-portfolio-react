import { m } from 'motion/react';
import { useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { navItems, person, social } from '../data/site';
import { useFocusTrap, useScrollLock } from '../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { Button, SocialBar } from './ds';
import { FloatingShape } from './Decor';
import { Icon } from './Icon';

interface MenuSheetProps {
  onClose: () => void;
  /** Where the links point: "#about" on the home page, "/#about" elsewhere. */
  hrefFor: (id: string) => string;
  current: string | null;
  /** The menu button; focus returns here when the sheet closes. */
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}

/**
 * Full-screen mobile menu. Rendered inside <AnimatePresence> by NavBar.
 * Focus lands on the first link, Tab is trapped, Esc closes and focus returns
 * to the menu button. Page scroll is locked and the page behind is inert.
 */
export function MenuSheet({ onClose, hrefFor, current, returnFocusTo }: MenuSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // Design note: focus lands on the first link; Esc closes and returns focus to the menu button.
  useFocusTrap(ref, true, onClose, { initial: '.sheet-link', returnTo: returnFocusTo });
  useScrollLock(true);

  return createPortal(
    <m.div
      ref={ref}
      id="menu-sheet"
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={reduced ? false : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }}
    >
      <FloatingShape kind="diamond-sm" mobile="show" at={{ right: 40, bottom: 210 }} />
      <FloatingShape
        kind="squiggle"
        mobile="show"
        at={{ left: 24, bottom: 250 }}
        size={{ width: 40, height: 20 }}
      />
      <div className="wrap sheet-head">
        <span className="wordmark">{person.name}</span>
        <button
          type="button"
          className="icon-btn sheet-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <nav aria-label="Primary" className="wrap sheet-nav">
        <ul>
          {navItems.map((item, i) => (
            <m.li
              key={item.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.04 * i + 0.05, duration: 0.2 }}
            >
              <a
                className="sheet-link"
                href={hrefFor(item.id)}
                aria-current={current === item.id ? 'true' : undefined}
                onClick={onClose}
              >
                {item.label}
                <Icon name="arrowRight" size="sm" />
              </a>
            </m.li>
          ))}
        </ul>
      </nav>
      <div className="wrap sheet-foot">
        <SocialBar items={social} label="Social profiles" />
        <div className="sheet-actions">
          <Button variant="primary" href={hrefFor('contact')} onClick={onClose}>
            Hire Me
          </Button>
          <Button variant="outline" href={person.cvHref} download>
            Get CV
          </Button>
        </div>
      </div>
    </m.div>,
    document.body,
  );
}
