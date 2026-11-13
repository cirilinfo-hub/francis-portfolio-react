// Site-wide content. Items marked PLACEHOLDER are flagged in the design and
// must be replaced before launch (see README "Open items").

export const person = {
  name: 'Francis Ciril Arulsamy',
  firstName: 'Francis',
  role: 'Front-End Architect | Front-End Manager',
  intro:
    '18+ years designing scalable front-end architectures, UI design systems and reusable components in Angular, React and TypeScript.',
  location: 'Bangalore, India',
  languages: 'English, Tamil, Malayalam, Kannada',
  email: 'francis_jeni@yahoo.com',
  /** PLACEHOLDER: hidden until Francis confirms the number can be public. */
  phone: null as string | null,
  /** PLACEHOLDER: no CV file supplied yet. */
  cvHref: '#cv',
} as const;

export interface SocialLink {
  label: string;
  short: string;
  href: string;
  placeholder?: boolean;
}

export const social: SocialLink[] = [
  // PLACEHOLDER: the CV has neither a LinkedIn URL nor a GitHub profile.
  { label: 'LinkedIn', short: 'in', href: '#linkedin', placeholder: true },
  { label: 'GitHub', short: 'GH', href: '#github', placeholder: true },
  { label: 'Email', short: '@', href: `mailto:${person.email}` },
];

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof navItems)[number]['id'];

export const clients = ['Eurofins', 'Cisco', 'Intel', 'Visa', 'Experian', 'Wipro', 'Tavant'];

export const about = {
  body: 'I build front-end architectures that stay fast and easy to maintain as products grow. I set technology direction, coding standards and review practices, and I mentor teams from planning through production.',
  stats: [
    { value: '18+', label: 'Years in Front-End' },
    { value: '13', label: 'Client Projects at Tavant' },
    { value: '20%', label: 'Faster Page Loads at Eurofins' },
  ],
};

export const testimonial = {
  /** PLACEHOLDER: no quote has been invented. */
  placeholder: true,
  name: 'Recommender Name',
  role: 'Role, Company',
  initials: 'RN',
  quote:
    '[Placeholder quote. Paste a 40–70 word recommendation from a manager, client or teammate here, for example from LinkedIn. Keep their words exactly as written.]',
};

export const contact = {
  lead: 'Have a front-end platform that needs to grow without slowing down? I would like to hear about it.',
  replyNote: 'I reply within two working days.',
};
