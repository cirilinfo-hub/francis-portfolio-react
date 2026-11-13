export type Framework = 'angular' | 'react' | 'web';

export interface ProjectCaseStudy {
  overview: string;
  role: string[];
  stackSummary: string;
  stackTags: string[];
  impact: string;
  facts: { label: string; value: string }[];
  /** Short description shown under the title on the detail page. */
  lede: string;
  /** Tags shown under the detail title. */
  headTags: string[];
  screenshots: { alt: string; caption: string }[];
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  initials: string;
  company: string;
  period: string;
  /** Framework as written on the card, e.g. "Angular 12". */
  framework: string;
  fw: Framework;
  tags: string[];
  /** Only projects with confirmed write-ups carry a case study. */
  caseStudy?: ProjectCaseStudy;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, (m) => m.slice(1, -1))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Raw = Omit<Project, 'slug'> & { slug?: string };

const raw: Raw[] = [
  {
    slug: 'gma',
    title: 'Global Management Access (GMA)',
    client: 'Eurofins',
    initials: 'EU',
    company: 'Eurofins IT Solutions',
    period: 'Dec 2022 – Sep 2026',
    framework: 'Angular 12',
    fw: 'angular',
    tags: ['.NET', 'Angular Material', 'SASS', 'REST API'],
    caseStudy: {
      lede: 'An automation tool that tracks each stage of a project, with an easy-to-use interface. Built in Angular 12 on a .NET backend, with Angular Material and REST APIs.',
      headTags: ['Angular 12', '.NET', 'Angular Material', 'SASS', 'REST APIs'],
      overview:
        'The client wanted an automation tool that tracks each stage of a project and gives people an easy-to-use interface to work with it. GMA was started and built in Angular 12 for the front end, with a .NET environment for the backend.',
      role: [
        'I turned the screen designs into an Angular application.',
        'I worked with the backend developer to build the RESTful API, and connected the app to external web services.',
        "I proposed solutions beyond the client's requirements so the project was covered end to end.",
        'I kept status updates and communication flowing across the team.',
      ],
      stackSummary:
        'Angular 12 on the front end, .NET services behind REST APIs, styled with Angular Material and SASS.',
      stackTags: ['Angular 12', '.NET', 'Angular Material', 'SASS', 'HTML5', 'CSS3', 'REST APIs'],
      impact:
        'Performance optimization and functionality checks, plus fixes for every cross-browser issue and leaner code and data binding, so the app behaves the same for every user.',
      facts: [
        { label: 'Client', value: 'Eurofins IT Solutions' },
        { label: 'Period', value: 'Dec 2022 – Sep 2026' },
        { label: 'Role', value: 'Technology Expert' },
        { label: 'Team', value: 'Backend, QA, BA and Scrum teams' },
      ],
      screenshots: [
        {
          alt: 'Screenshot placeholder: second GMA screen',
          caption: 'Caption: what this screen shows, in one line.',
        },
        {
          alt: 'Screenshot placeholder: third GMA screen',
          caption: 'Caption: what this screen shows, in one line.',
        },
      ],
    },
  },
  { title: 'Assurance IQ', client: 'Eurofins', initials: 'EU', company: 'Eurofins IT Solutions', period: 'Dec 2024 – Feb 2026', framework: 'Angular 18', fw: 'angular', tags: ['.NET', 'Angular Material', 'SASS', 'REST API'] },
  { title: 'PCCE', client: 'Cisco', initials: 'CI', company: 'Wipro', period: 'From Feb 2022', framework: 'React', fw: 'react', tags: ['Node.js', 'Java Spring', 'SASS', 'REST API'] },
  { title: 'Enhanced Medication Services', client: 'Transaction Data Systems', initials: 'TD', company: 'Wipro', period: 'Dec 2020 – Jan 2022', framework: 'Angular 10', fw: 'angular', tags: ['Node.js', 'Angular Material', 'SASS'] },
  { title: 'DCMS', client: 'Intel', initials: 'IN', company: 'Wipro', period: 'Apr 2020 – Dec 2020', framework: 'Angular 9', fw: 'angular', tags: ['NG Select', 'DataTables', 'NVD3', 'jQuery'] },
  { title: 'Visa Enhancement', client: 'Visa', initials: 'VI', company: 'Wipro', period: 'Jul 2019 – Apr 2020', framework: 'Angular 8', fw: 'angular', tags: ['Visa Angular UI', 'Node.js', 'SASS'] },
  { title: 'Product Builder', client: 'Experian', initials: 'EX', company: 'Tavant Technologies', period: 'Oct 2018 – May 2019', framework: 'Angular 6', fw: 'angular', tags: ['jQuery', 'Bootstrap', 'SASS'] },
  { title: 'Reltio Admin Tool', client: 'Reltio', initials: 'RE', company: 'Tavant Technologies', period: 'Aug 2017 – Oct 2018', framework: 'React', fw: 'react', tags: ['Redux', 'Bootstrap', 'LESS'] },
  { title: 'Actiwoo', client: 'Actiwoo', initials: 'AC', company: 'Tavant Technologies', period: 'Nov 2017 – Oct 2018', framework: 'Angular 2', fw: 'angular', tags: ['jQuery', 'Bootstrap', 'SASS'] },
  { title: 'ACT Personalized Web', client: 'ACT', initials: 'AT', company: 'Tavant Technologies', period: 'Jul 2016 – Oct 2018', framework: 'AngularJS 1.5', fw: 'angular', tags: ['jQuery', 'Bootstrap', 'SASS'] },
  { title: 'Move (POC)', client: 'Move Inc.', initials: 'MO', company: 'Tavant Technologies', period: 'Jul 2016 – Dec 2017', framework: 'React', fw: 'react', tags: ['Bootstrap', 'LESS', 'Google Maps API'] },
  { slug: 'experian-2016', title: 'Experian', client: 'Experian', initials: 'EX', company: 'Tavant Technologies', period: 'Jan 2016 – Jun 2016', framework: 'AngularJS 1.5', fw: 'angular', tags: ['TypeScript', 'Bootstrap', 'SASS'] },
  { title: 'Emed Events', client: 'Emedevents', initials: 'EM', company: 'Tavant Technologies', period: 'Jul 2015 – Dec 2015', framework: 'PHP', fw: 'web', tags: ['JavaScript', 'jQuery', 'HTML5'] },
  { title: 'TiVo Refresh', client: 'TiVo', initials: 'TV', company: 'Tavant Technologies', period: 'Oct 2014 – Jun 2015', framework: 'AngularJS', fw: 'angular', tags: ['TypeScript', 'Node.js', 'HTML5'] },
  { title: 'PNS Digital', client: 'PNS', initials: 'PN', company: 'Tavant Technologies', period: 'Apr 2014 – Oct 2014', framework: 'Adobe CQ5', fw: 'web', tags: ['jQuery', 'HTML5', 'CSS3'] },
  { title: 'National MI', client: 'National MI', initials: 'NM', company: 'Tavant Technologies', period: 'Oct 2013 – Mar 2014', framework: 'Java and JSP', fw: 'web', tags: ['jQuery', 'HTML5', 'CSS3'] },
  { title: 'Sims 3', client: 'Electronic Arts', initials: 'EA', company: 'Tavant Technologies', period: 'Mar 2013 – Sep 2013', framework: 'Java and JSP', fw: 'web', tags: ['jQuery', 'HTML', 'CSS'] },
  { title: 'Success Trade', client: 'Success Trade', initials: 'ST', company: 'Tavant Technologies', period: 'Aug 2012 – Feb 2013', framework: 'Java and JSP', fw: 'web', tags: ['jQuery', 'HTML', 'CSS'] },
  { title: 'Dollar Financial Group', client: 'DFG', initials: 'DF', company: 'Tavant Technologies', period: 'Jul 2011 – Aug 2012', framework: '.NET', fw: 'web', tags: ['jQuery', 'HTML', 'CSS'] },
];

export const projects: Project[] = raw.map((p) => ({ ...p, slug: p.slug ?? slugify(p.title) }));

export const projectBySlug = (slug: string | undefined) => projects.find((p) => p.slug === slug);

export const frameworkTint: Record<Framework, 'tint-sky' | 'tint-coral' | 'tint-sun'> = {
  angular: 'tint-sky',
  react: 'tint-coral',
  web: 'tint-sun',
};

export const frameworkOptions: { value: Framework | 'all'; label: string }[] = [
  { value: 'all', label: 'All Frameworks' },
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'web', label: 'Web and CMS' },
];

/** Summary tiles above the projects panel (from the canvas). */
export const projectSummary = [
  { label: 'Total Projects', value: projects.length, tint: 'tint-violet', icon: 'box' },
  { label: 'Angular Projects', value: projects.filter((p) => p.fw === 'angular').length, tint: 'tint-sky', icon: 'layers' },
  { label: 'React Projects', value: projects.filter((p) => p.fw === 'react').length, tint: 'tint-coral', icon: 'atom' },
  { label: 'Web and CMS', value: projects.filter((p) => p.fw === 'web').length, tint: 'tint-sun', icon: 'code' },
  { label: 'Years Delivering', value: 15, tint: 'tint-mint', icon: 'calendar' },
] as const;
