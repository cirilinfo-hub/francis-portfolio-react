import { Link, useLocation } from 'react-router';
import { navItems, person, social } from '../data/site';
import { SocialBar } from './ds';
import { ThemeToggle } from './ThemeToggle';

/**
 * Footer with the second navigation landmark, social chips and the theme toggle.
 * `mini` is the project-page footer from ProjectDetail.dc.html (wordmark + copyright).
 */
export function Footer({ mini = false }: { mini?: boolean }) {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const year = 2026;

  if (mini) {
    return (
      <footer className="footer footer-mini">
        <div className="wrap">
          <Link className="wordmark" to="/">
            {person.name}
          </Link>
          <p className="t-small">
            © {year} {person.name}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <Link className="wordmark" to={onHome ? '#top' : '/'}>
            {person.name}
          </Link>
          <nav aria-label="Footer">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a className="nav-link" href={hrefFor(item.id)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <SocialBar items={social} label="Social profiles, footer" className="footer-social" />
        </div>
        <div className="footer-bottom">
          <p className="t-small">
            © {year} {person.name}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
