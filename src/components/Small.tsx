import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { TechIcon } from './TechIcon';

/** White pill tray holding the primary and outline buttons. Uses shadow-card. */
export function ButtonTray({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['tray', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** Plain-text client names in ink-muted, separated by dots. No logos. */
export function TrustStrip({ label, names }: { label: string; names: string[] }) {
  return (
    <section className="trust" aria-label="Brands I have delivered for">
      <div className="wrap trust-in">
        <span className="trust-label" aria-hidden="true">
          {label}
        </span>
        <ul className="trust-list">
          {names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Coral figure over an ink label. */
export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <li className="stat">
      <span className="stat-num">{value}</span>
      <span className="stat-label">{label}</span>
    </li>
  );
}

/** Row of icon-plus-text facts. */
export function FactRow({ items }: { items: { icon: IconName; text: string }[] }) {
  return (
    <ul className="facts">
      {items.map((f) => (
        <li key={f.text}>
          <Icon name={f.icon} />
          {f.text}
        </li>
      ))}
    </ul>
  );
}

/** radius-md tag. `tech` adds the monochrome technology mark. */
export function Tag({
  children,
  neutral,
  tech,
}: {
  children: string;
  neutral?: boolean;
  tech?: boolean;
}) {
  return (
    <li className={['tag', neutral && 'neutral', tech && 'tech-tag'].filter(Boolean).join(' ')}>
      {tech ? <TechIcon name={children} className="" /> : null}
      {children}
    </li>
  );
}

export function TagList({
  items,
  label,
  neutral,
  tech,
  className,
}: {
  items: string[];
  label?: string;
  neutral?: boolean;
  tech?: boolean;
  className?: string;
}) {
  return (
    <ul className={['tags', className].filter(Boolean).join(' ')} aria-label={label}>
      {items.map((t) => (
        <Tag key={t} neutral={neutral} tech={tech}>
          {t}
        </Tag>
      ))}
    </ul>
  );
}

/** Content not supplied yet. Clearly marked so it is not mistaken for real copy. */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <span className="quote-ph">
      <Icon name="alert" size="sm" />
      {children}
    </span>
  );
}

/** Flat schematic screenshot placeholder (16:10, no device frame). */
export function ScreenshotPlaceholder({
  label,
  tag = 'Placeholder',
  bars = [50, 75, 40, 62, 30],
  className,
  style,
}: {
  label: string;
  tag?: string;
  bars?: number[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={['shot', className].filter(Boolean).join(' ')} role="img" aria-label={label} style={style}>
      <div className="shot-side">
        <i />
        <i />
        <i />
      </div>
      <div className="shot-main">
        <span className="shot-top" />
        <div className="shot-kpis">
          <i />
          <i />
          <i />
        </div>
        <div className="shot-bars">
          {bars.map((h, i) => (
            <b key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <span className="shot-tag" aria-hidden="true">
        {tag}
      </span>
    </div>
  );
}
