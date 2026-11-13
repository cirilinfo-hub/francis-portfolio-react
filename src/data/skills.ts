import type { Tone } from '../components/ds/types';

export interface SkillYears {
  label: string;
  /** Displayed figure, e.g. "18+". */
  display: string;
  /** Numeric years used for the arc. */
  years: number;
  span: string;
  tone: Tone;
}

/** Career length the ring arc is measured against. */
export const CAREER_YEARS = 18;

// OPEN ITEM: years come from CV project dates. Francis should confirm them.
export const rings: SkillYears[] = [
  { label: 'Angular', display: '9', years: 9, span: 'Versions 2 to 21', tone: 'sky' },
  { label: 'TypeScript', display: '10', years: 10, span: 'Since 2016', tone: 'violet' },
  { label: 'React', display: '6', years: 6, span: '2016 – 2022, with Redux', tone: 'coral' },
  { label: 'HTML5 and CSS3', display: '18+', years: 18, span: 'Since 2007', tone: 'mint' },
];

export const skillGroups: { name: string; items: string[] }[] = [
  { name: 'Frameworks', items: ['Angular (v2 to 21)', 'React', 'Redux', 'AngularJS'] },
  { name: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
  { name: 'Styling', items: ['Angular Material', 'PrimeNG', 'Bootstrap', 'SCSS/Sass'] },
  {
    name: 'Backend and Data',
    items: ['REST', 'Node.js', '.NET', 'GraphQL', 'MySQL', 'MongoDB', 'Firebase'],
  },
  { name: 'Tooling', items: ['Figma', 'Docker', 'Kubernetes', 'Azure', 'VS Code'] },
];
