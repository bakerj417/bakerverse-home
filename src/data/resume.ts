/**
 * Structured resume data. Single source of truth for the printable /resume
 * page and (later) the /work page import.
 */

export interface ResumeLink {
  readonly label: string;
  readonly href: string;
}

export interface ResumeExperience {
  readonly title: string;
  readonly company: string;
  readonly location?: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly bullets: readonly string[];
  readonly concurrent?: boolean;
}

export interface ResumeEducation {
  readonly institution: string;
  readonly degree: string;
  readonly focus?: string;
  readonly location: string;
  readonly startYear: number;
  readonly endYear: number;
}

export interface SkillGroup {
  readonly label: string;
  readonly items: readonly string[];
}

export const resume = {
  name: 'Joseph Baker',
  title: 'Senior Frontend Engineer',
  location: 'Waxhaw, North Carolina',
  email: 'bakerj417@gmail.com',
  links: [
    {
      label: 'linkedin.com/in/josephkbaker',
      href: 'https://www.linkedin.com/in/josephkbaker/',
    },
    {
      label: 'github.com/bakerj417',
      href: 'https://github.com/bakerj417',
    },
    {
      label: 'josephkbaker.com',
      href: 'https://josephkbaker.com',
    },
  ],
  summary:
    'Senior engineer with 15+ years shipping production software across mobile, web, and platform. Currently focused on React Native, TypeScript, and design systems, with full-stack depth in Node.js, Go, and AWS. Track record of modernizing build pipelines and Git workflows, leading teams, and mentoring engineers.',
  experience: [
    {
      title: 'Senior Frontend Engineer',
      company: 'WebstaurantStore (Clark Inc.)',
      startDate: '2024-01',
      bullets: [
        'Lead the mobile app team, owning architecture modernization, security hardening, and observability while maintaining a steady cadence of customer-facing features.',
        'Rebuilt the internal web component library on shadcn-ui; designed and shipped new primitives (combobox, advanced selection patterns, and more) that improved design-parity and reduced pattern drift across the app.',
        'Modernized the build pipeline and Git workflow for the design system team, shortening iteration time and tightening release quality.',
      ],
    },
    {
      title: 'Principal Software Engineer',
      company: 'Red Ventures',
      startDate: '2021-03',
      endDate: '2023-09',
      bullets: [
        'Led React / Next.js frontends and the backend services powering them; introduced GraphQL federation via the Apollo Rust Router so multiple frontends consumed a single unified endpoint.',
        'Shipped production services in Node.js, Go, and Elixir backed by AWS \u2014 migrated IaC from Terraform to CDK paired with GitHub Actions for faster, safer deploys.',
        'Architected CI/CD including pipeline-blocking tests, ephemeral PR environments, and automated subgraph publishing keeping the federation supergraph in sync.',
        'Mentored engineers across frontend, backend, platform, and data; drove cross-team technical decisions.',
      ],
    },
    {
      title: 'Chief Technology Officer',
      company: 'Hoppthru',
      startDate: '2019-09',
      endDate: '2021-06',
      concurrent: true,
      bullets: [
        'As sole engineer, architected and shipped a React Native + Expo loyalty app with a TypeScript / NestJS backend, using json-rules-engine to drive the rewards logic.',
        'Scaled to 8,000+ users in Charlotte and expanded across much of North Carolina before the company was acquired.',
      ],
    },
    {
      title: 'Director of Engineering',
      company: 'Red Ventures',
      startDate: '2019-02',
      endDate: '2021-03',
      bullets: [
        'Led a product team that built a no-code asset builder \u2014 a TypeScript admin plus Go backend that serialized React experiences (clicks, scrolls, event handlers) as JSON and re-rendered them through a custom React engine.',
        'Designed a composable flow engine supporting API-driven branching and logic-based routing between screens, enabling analysts to build questionnaires and decision trees without engineering work.',
        'Built a .NET Core leads system with JSON-configured modular steps, absorbing diverse partner requirements without per-partner code forks.',
        'Shipped a JavaScript transformation layer translating partner request/response shapes to a common internal contract.',
      ],
    },
    {
      title: 'Senior Software Engineer',
      company: 'Red Ventures',
      startDate: '2017-03',
      endDate: '2019-02',
      bullets: [
        'Built a Node.js phone-system integration with a third-party telephony provider, enabling call-center agents to control inbound calls from internal tooling.',
        'Delivered production features across React, Node.js, PHP, and TypeScript in support of multiple product verticals.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Red Ventures',
      startDate: '2015-02',
      endDate: '2017-03',
      bullets: [
        'Built React-based partner ordering flows on the in-house ordering platform, managed through an internal admin used by the analyst team.',
        'Shipped the company\u2019s first online carts, built on the same ordering platform and admin stack.',
      ],
    },
    {
      title: 'Jr. Software Engineer',
      company: 'Red Ventures',
      startDate: '2013-03',
      endDate: '2015-02',
      bullets: [
        'Built partner integrations across multiple verticals in JavaScript, PHP, and MySQL.',
      ],
    },
    {
      title: 'Web Application Developer',
      company: 'Auction Edge, Inc.',
      startDate: '2012-02',
      endDate: '2013-03',
      bullets: [
        'Developed web applications serving the auto auction industry.',
      ],
    },
  ],
  education: [
    {
      institution: 'Appalachian State University',
      degree: 'B.S. Business Administration',
      focus: 'Computer Information Systems',
      location: 'Boone, NC',
      startYear: 2008,
      endYear: 2011,
    },
  ],
  skills: [
    {
      label: 'Mobile & Frontend',
      items: [
        'React Native',
        'Expo',
        'React',
        'Next.js',
        'TypeScript',
        'Redux',
        'Tailwind',
        'HTML5 / CSS / Sass',
      ],
    },
    {
      label: 'Backend',
      items: [
        'Node.js',
        'NestJS',
        'Go',
        'Elixir',
        '.NET Core',
        'PHP',
        'GraphQL',
      ],
    },
    {
      label: 'Data',
      items: ['PostgreSQL', 'MySQL', 'DynamoDB'],
    },
    {
      label: 'Platform',
      items: [
        'AWS',
        'Docker',
        'Terraform',
        'AWS CDK',
        'GitHub Actions',
        'CircleCI',
      ],
    },
    {
      label: 'Practice',
      items: [
        'Design Systems',
        'GraphQL Federation',
        'CI/CD Architecture',
        'Team Leadership',
        'Mentoring',
        'Agile / Kanban',
      ],
    },
  ],
} as const;

export type Resume = typeof resume;
