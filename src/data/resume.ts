export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  badges?: string[];
}

export interface Education {
  degree: string;
  field: string;
  school: string;
  start?: string;
  end?: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

/** Work history — newest first. Shown on /work */
export const experience: Experience[] = [
  {
    role: 'Technical Writer',
    company: 'PayIt',
    companyUrl: 'https://payitgov.com',
    location: 'Remote',
    start: 'Jul 2024',
    end: 'Present',
    current: true,
    summary:
      'Develop and maintain client-facing instructional materials and documentation from the ground up for an enterprise government technology suite.',
    bullets: [
      'Develop and maintain client-facing instructional materials and documentation from the ground up for an enterprise government technology suite.',
      'Create comprehensive performance-support materials—including job aids, quick-reference guides, and desk-side references—tailored for non-technical government agency users.',
      'Apply adult learning principles to script, storyboard, and produce short-form e-learning video content, editing in Camtasia to improve client onboarding and reduce support requests.',
      'Partner with Product, Delivery, and Subject Matter Experts (SMEs) to validate technical accuracy and ensure alignment across all training pathways.',
      'Implement content governance procedures to standardize creation, ensuring structural consistency, accessibility, and terminology alignment.',
    ],
    badges: ['Technical Writing', 'Instructional Design', 'Camtasia', 'Section 508', 'Content Governance'],
  },
  {
    role: 'Video Content Creator',
    company: 'Awesome Motive (OptinMonster)',
    companyUrl: 'https://optinmonster.com',
    location: 'Remote',
    start: 'Dec 2020',
    end: 'Jun 2024',
    current: false,
    summary:
      'Managed all phases of multimedia e-learning development, translating complex software features into engaging instructional video content.',
    bullets: [
      'Managed all phases of multimedia e-learning development, including ideation, scripting, storyboarding, shooting, and post-production.',
      'Collaborated with Engineering and Product SMEs to translate complex software features into engaging instructional video content.',
      'Achieved a 150% increase in YouTube channel subscribers by optimizing educational content.',
      'Integrated AI technologies into the video production process to maximize efficiency and instructional effectiveness.',
    ],
    badges: ['Video Production', 'E-learning', 'YouTube Optimization', 'AI Integration', 'SaaS'],
  },
  {
    role: 'Content Designer & Video Content Creator',
    company: 'Blackboard',
    companyUrl: 'https://www.blackboard.com',
    location: 'Remote',
    start: 'Sep 2013',
    end: 'Sep 2020',
    current: false,
    summary:
      'Led the instructional video content strategy, producing over 300 accessible, Section 508-compliant video titles to support the enterprise Learning Management System (LMS).',
    bullets: [
      'Led the instructional video content strategy, producing over 300 accessible, Section 508-compliant video titles to support the enterprise Learning Management System (LMS).',
      'Developed modular written curriculum alongside video content, ensuring reusable instructional frameworks across diverse learner pathways.',
      'Curated and updated training content, continuously monitoring materials for usability, technical accuracy, and structural organization.',
    ],
    badges: ['LMS', 'Section 508 Compliance', 'Curriculum Design', 'Video Production', 'Accessibility'],
  },
  {
    role: 'Technical Writer & Instructional Designer',
    company: 'Edline',
    location: 'Carbondale, IL',
    start: 'Apr 2011',
    end: 'Sep 2013',
    current: false,
    summary:
      'Created and maintained audience-appropriate end-user training documentation for a SaaS learning management platform.',
    bullets: [
      'Created and maintained clear, audience-appropriate end-user training documentation for a SaaS learning management platform.',
      'Developed cross-functional review workflows with product owners to continuously edit and enhance instructional materials based on stakeholder feedback.',
    ],
    badges: ['Technical Writing', 'Instructional Design', 'SaaS', 'Training Documentation'],
  },
  {
    role: 'Technical Writer',
    company: 'SchoolCenter',
    location: 'Carbondale, IL',
    start: 'Nov 2004',
    end: 'Apr 2011',
    current: false,
    summary:
      'Wrote and structured end-user documentation, migrating help content to an accessible HTML and wiki-based system.',
    bullets: [
      'Wrote and structured end-user documentation, migrating help content to an accessible HTML and wiki-based system.',
      'Authored software functional requirements and conducted usability testing to ensure product alignment.',
    ],
    badges: ['Technical Writing', 'HTML & Wiki', 'Usability Testing', 'Functional Requirements'],
  },
];

/** Smaller/older roles — rendered as compact rows under the main timeline */
export const earlierRoles: { role: string; company: string; start: string; end: string }[] = [];

export const education: Education[] = [
  {
    degree: "Bachelor's Degree",
    field: 'English',
    school: 'Southern Illinois University, Carbondale, IL',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Instructional Design & Content',
    skills: [
      'Technical Writing',
      'Curriculum Development',
      'Adult Learning Principles',
      'Scripting & Storyboarding',
      'E-learning Content',
      'Section 508 Compliance',
      'Accessibility',
    ],
  },
  {
    title: 'Video & Multimedia Production',
    skills: [
      'End-to-end Video Production',
      'Camtasia',
      'DaVinci Resolve',
      'Audio Recording & Editing',
      'AI Technologies in Video Production',
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      'Learning Management Systems (LMS)',
      'Agile Development',
      'Content Strategy',
      'Usability Testing',
      'Adobe Creative Suite',
      'HTML',
      'WordPress',
      'SaaS',
      'Jira',
      'Confluence',
    ],
  },
];

/** Words typed out one character at a time in the hero */
export const typingRoles = [
  'the funhavers',
  'weekend adventurers',
  'storytellers',
  'outdoor enthusiasts',
];
