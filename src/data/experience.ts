export interface Role {
  org: string;
  period: string;
  title: string;
  summary: string;
  current?: boolean;
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
    current: true,
    summary:
      'I lead a team of 7, cut page load time by 20%, and build Angular 12 and 18 apps and component libraries.',
  },
  {
    org: 'Wipro',
    period: '2019 – 2022',
    title: 'Team Lead',
    summary: 'I led teams of 5 for Cisco, Intel, Visa and Transaction Data Systems.',
  },
  {
    org: 'Tavant Technologies',
    period: '2011 – 2019',
    title: 'Associate UI Architect',
    summary:
      'I defined UI architecture across 13 client projects, including Experian, Reltio and Move.',
  },
  {
    org: 'Web Originate',
    period: '2010 – 2011',
    title: 'Team Leader',
    summary: 'I managed UI development and team deliverables for website projects.',
  },
  {
    org: 'Ocean Pages',
    period: '2009 – 2010',
    title: 'Senior Web Designer',
    summary: 'I built websites and solved design and implementation issues.',
  },
  {
    org: 'Scubez Solution',
    period: '2007 – 2009',
    title: 'Web Designer',
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
