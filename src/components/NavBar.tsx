import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { navItems, person } from '../data/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { Button } from './ds';
import { Icon } from './Icon';
import { MenuSheet } from './MenuSheet';
import { ScrollProgress } from './ScrollProgress';

const ids = navItems.map((n) => n.id);

/**
 * Sticky translucent bar. Desktop: wordmark, six links, outline Hire Me.
 * ≤1024px: a 44px menu button that opens <MenuSheet>.
 * The current link is bold and underlined and carries aria-current.
 */
export function NavBar() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids, onHome);
  // On a project page, "Projects" is the current section.
  const current = onHome ? active : pathname.startsWith('/projects/') ? 'projects' : null;
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  // Everything behind the sheet is inert while it is open.
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    root.inert = open;
    return () => {
      root.inert = false;
    };
  }, [open]);

  // Close the sheet when the viewport grows past the mobile layout.
  useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia('(min-width: 1025px)');
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [open]);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="wordmark" to={onHome ? '#top' : '/'}>
          {person.name}
        </Link>
        <nav aria-label="Primary" className="nav-primary">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={['nav-link', current === item.id && 'is-current'].filter(Boolean).join(' ')}
                  href={hrefFor(item.id)}
                  aria-current={current === item.id ? (onHome ? 'true' : 'page') : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="outline" size="sm" href={hrefFor('contact')} className="nav-hire">
          Hire Me
        </Button>
        <button
          type="button"
          className="icon-btn nav-menu"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" />
        </button>
      </div>
      <ScrollProgress />
      <AnimatePresence>
        {open ? <MenuSheet onClose={() => setOpen(false)} hrefFor={hrefFor} current={current} /> : null}
      </AnimatePresence>
    </header>
  );
}
