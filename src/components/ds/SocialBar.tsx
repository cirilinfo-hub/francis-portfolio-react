import type { SocialLink } from '../../data/site';

export interface SocialBarProps {
  items: SocialLink[];
  label?: string;
  className?: string;
}

/**
 * Round social chips in a white tray. The glyph is hidden from screen readers;
 * the accessible name is the network ("LinkedIn", "GitHub", "Email").
 * Rendered as a labelled list rather than <nav> so the page keeps exactly two
 * navigation landmarks (primary and footer), as the Spec asks.
 */
export function SocialBar({ items, label = 'Social profiles', className }: SocialBarProps) {
  return (
    <ul className={['fc-social', className].filter(Boolean).join(' ')} aria-label={label}>
      {items.map((it) => (
        <li key={it.label}>
          <a
            className="fc-social-btn"
            href={it.href}
            aria-label={it.label}
            title={it.label}
            {...(it.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <span aria-hidden="true">{it.short}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
