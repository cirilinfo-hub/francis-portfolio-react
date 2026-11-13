export interface Role {
  org: string;
  period: string;
  title: string;
  summary: string;
  current?: boolean;
  /** Exact dates and city, shown when the card is expanded. */
  dates: string;
  location: string;
  /** Expanded-card bullets, taken from the CV. Empty hides the toggle. */
  highlights: string[];
}

export interface Education {
  label: string;
  period: string;
  degree: string;
  school: string;
}

/** Newest first. On small screens only the first `RECENT_ROLE_COUNT` show until expanded. */
export const roles: Role[] = [
  {
    org: 'Eurofins IT Solutions',
    period: '2022 – Present',
    title: 'Technology Expert',
    dates: 'Dec 2022 – Present',
    location: 'Bangalore',
    highlights: [
      'Evaluate and select front-end technologies for enterprise apps on scalability, performance and maintainability.',
      'Own the front-end lifecycle from planning to delivery, and integrate REST APIs with backend teams.',
      'Mentor a team of 7 developers and run code reviews against shared coding standards.',
      'Improved page load time by 20% through UI optimisation and code changes.',
      'Moved legacy front-end code into reusable component libraries for faster delivery.',
      'Ran WCAG accessibility audits and fixes, and added caching to speed up data loading in the UI.',
    ],
    current: true,
    summary:
      'I lead a team of 7, cut page load time by 20%, and build Angular 12 and 18 apps and component libraries.',
  },
  {
    org: 'Wipro',
    period: '2019 – 2022',
    title: 'Team Lead',
    dates: 'Jul 2019 – Dec 2022',
    location: 'Bangalore',
    highlights: [
      'Led front-end teams of 5 for Cisco, Intel, Visa and Transaction Data Systems, assigning work by priority.',
      'Helped choose the stack and design solutions for Angular and React applications.',
      'Worked with clients on requirements and gave technical guidance through delivery.',
      'Owned code quality, performance and on-time front-end releases.',
      'Brought internationalisation, localisation and web accessibility into product architecture.',
      'Added automated testing to the development workflow to improve reliability.',
    ],
    summary: 'I led teams of 5 for Cisco, Intel, Visa and Transaction Data Systems.',
  },
  {
    org: 'Tavant Technologies',
    period: '2011 – 2019',
    title: 'Associate UI Architect',
    dates: 'Jul 2011 – May 2019',
    location: 'Bangalore',
    highlights: [
      'Defined UI architecture and led front-end teams across 13 client projects, including Experian, TiVo, Reltio, Move and ACT.',
      'Gave technical consulting to client teams and delivered responsive apps for desktop and mobile.',
      'Designed reusable UI components and widgets in AngularJS, Angular and React.',
      'Validated UI/UX designs, mentored developers and ran technical and code reviews.',
      'Coached teams on Jest to keep test coverage high.',
    ],
    summary:
      'I defined UI architecture across 13 client projects, including Experian, Reltio and Move.',
  },
  {
    org: 'Web Originate',
    period: '2010 – 2011',
    title: 'Team Leader',
    dates: 'Jul 2010 – Jul 2011',
    location: 'Bangalore',
    highlights: [
      'Managed UI development and team deliverables for website projects, keeping quality standards.',
      'Gave technical guidance on web, Android and iOS projects.',
      'Tested the usability of custom solutions before deployment.',
      'Worked with engineering teams to build and deploy secure enterprise web applications.',
    ],
    summary: 'I managed UI development and team deliverables for website projects.',
  },
  {
    org: 'Ocean Pages',
    period: '2009 – 2010',
    title: 'Senior Web Designer',
    dates: 'Mar 2009 – Jun 2010',
    location: 'Bangalore',
    highlights: [],
    summary: 'I built websites and solved design and implementation issues.',
  },
  {
    org: 'Scubez Solution',
    period: '2007 – 2009',
    title: 'Web Designer',
    dates: 'Jun 2007 – Feb 2009',
    location: 'Chennai',
    highlights: [],
    summary: 'I designed web templates in Photoshop and turned them into HTML and CSS.',
  },
];

export const RECENT_ROLE_COUNT = 3;

export const education: Education = {
  label: 'Education',
  period: '2002 – 2005',
  degree: 'B.Sc. Information Technology',
  school: 'Yadava College, Madurai (Madurai Kamaraj University)',
};
