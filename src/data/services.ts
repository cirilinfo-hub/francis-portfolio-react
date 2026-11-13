import type { Tone } from '../components/ds/types';
import type { IconName } from '../components/Icon';

export interface Service {
  title: string;
  text: string;
  tone: Tone;
  icon: IconName;
}

export const services: Service[] = [
  {
    title: 'UI Architecture',
    text: 'Technology evaluation, solution design, scalable client-side structure',
    tone: 'sky',
    icon: 'layers',
  },
  {
    title: 'Design Systems',
    text: 'Reusable component libraries, tokens, UI standards',
    tone: 'violet',
    icon: 'grid',
  },
  {
    title: 'Angular and React',
    text: 'Angular 2 to 21, AngularJS, React, Redux, TypeScript',
    tone: 'coral',
    icon: 'code',
  },
  {
    title: 'Performance and Quality',
    text: 'Optimization, cross-browser support, code reviews, testing',
    tone: 'mint',
    icon: 'gauge',
  },
  {
    title: 'Accessibility',
    text: 'WCAG audits and remediation, internationalization',
    tone: 'sun',
    icon: 'accessibility',
  },
  {
    title: 'Team Leadership',
    text: 'Mentoring, stakeholder engagement, Agile delivery',
    tone: 'sky',
    icon: 'users',
  },
];
