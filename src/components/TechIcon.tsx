import { TECH_ICONS } from '../data/techIcons';
import { resolveTech } from '../lib/tech';

export function TechIcon({ name, className = 'tech-ic' }: { name: string; className?: string }) {
  const [d, rule] = TECH_ICONS[resolveTech(name)];
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} fillRule={rule} />
    </svg>
  );
}
