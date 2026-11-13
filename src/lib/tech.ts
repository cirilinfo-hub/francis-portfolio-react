import { TECH_ICONS, type TechIconName } from '../data/techIcons';

// Same lookup rules as the design canvas: alias, then strip a version number,
// then the first word, then fall back to the REST mark.
const ALIAS: Record<string, TechIconName> = {
  'Angular (v2 to 21)': 'Angular',
  'SCSS/Sass': 'SASS',
  REST: 'REST API',
  'REST APIs': 'REST API',
  'HTML5 and CSS3': 'HTML5',
  'Java and JSP': 'Java',
};

const has = (k: string): k is TechIconName => k in TECH_ICONS;

export function resolveTech(name: string): TechIconName {
  const key = ALIAS[name] ?? name;
  if (has(key)) return key;
  const noVersion = key.replace(/ [0-9.]+$/, '');
  if (has(noVersion)) return noVersion;
  const first = key.split(' ')[0] ?? '';
  if (has(first)) return first;
  return 'REST API';
}
