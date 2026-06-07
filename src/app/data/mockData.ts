// City Twin — curated demo data (hackathon prototype).
// Everything here is local mock data: no backend, no analytics, no real partner APIs.
// The talent flow is driven by free-text input, not by predefined personas.

export type CategoryId =
  | 'funding'
  | 'scholarship'
  | 'nationality'
  | 'entrepreneurship'
  | 'student'
  | 'social'
  | 'visa'
  | 'research';

export interface Category {
  id: CategoryId;
  label: string; // full label
  short: string; // short label shown under nodes
  color: string; // glow color
  explanation: string; // shown in the category panel
}

export interface Opportunity {
  id: string;
  category: CategoryId;
  title: string;
  partner: string;
  match: number; // 0-100
  description: string;
  why: string; // "why it matches"
  nextStep: string;
  related: string[]; // sibling opportunity ids to highlight on "Show related"
}

// ---- The eight categories ----
export const CATEGORIES: Record<CategoryId, Category> = {
  funding: {
    id: 'funding',
    label: 'Funding',
    short: 'Funding',
    color: '#FFC94D',
    explanation: 'Grants, incubators and accelerators that fund early-stage ventures in Hong Kong.',
  },
  scholarship: {
    id: 'scholarship',
    label: 'Scholarships & Education',
    short: 'Scholarships',
    color: '#5BA8FF',
    explanation: 'Scholarships, admissions and research grants across Hong Kong’s universities.',
  },
  nationality: {
    id: 'nationality',
    label: 'Communities by Nationality',
    short: 'Nationality',
    color: '#2BD9A8',
    explanation: 'Chambers and diaspora communities that help you land among people from home.',
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    label: 'Entrepreneurship Communities',
    short: 'Founders',
    color: '#FF6FA5',
    explanation: 'Founder networks, AI circles and events where Hong Kong’s builders meet.',
  },
  student: {
    id: 'student',
    label: 'Student Communities',
    short: 'Students',
    color: '#B98CFF',
    explanation: 'Student unions, residences and campus clubs for newcomers to university life.',
  },
  social: {
    id: 'social',
    label: 'Social & Cultural Integration',
    short: 'Social',
    color: '#56D9FF',
    explanation: 'Volunteering, sport and language groups that turn arrival into real belonging.',
  },
  visa: {
    id: 'visa',
    label: 'Visa & Relocation',
    short: 'Visa',
    color: '#A3FFB5',
    explanation: 'Visa schemes and relocation logistics to get you set up and legal, fast.',
  },
  research: {
    id: 'research',
    label: 'Research-to-Startup',
    short: 'Research',
    color: '#8C7CFF',
    explanation: 'Labs, clusters and programmes that turn research into a fundable company.',
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

// ---- Opportunities per category (3–5 each) ----
export const OPPORTUNITIES: Record<CategoryId, Opportunity[]> = {
  funding: [
    {
      id: 'fund-cyberport',
      category: 'funding',
      title: 'Cyberport Incubation',
      partner: 'Cyberport',
      match: 96,
      description: 'Early-stage support for startups building technology products in Hong Kong.',
      why: 'A credible first entry point into Hong Kong’s startup ecosystem, with funding and founder networks.',
      nextStep: 'Apply to the next intake or join a Cyberport founder event.',
      related: ['fund-hkstp', 'fund-brinc'],
    },
    {
      id: 'fund-hkstp',
      category: 'funding',
      title: 'HKSTP Incubation',
      partner: 'Hong Kong Science & Technology Parks',
      match: 92,
      description: 'Deep-tech incubation with lab space, grants and infrastructure.',
      why: 'Built for hardware and deep-tech founders who need compute, grants and technical neighbours.',
      nextStep: 'Submit a one-page concept to the Incu-App programme.',
      related: ['fund-cyberport', 'fund-itf'],
    },
    {
      id: 'fund-investhk',
      category: 'funding',
      title: 'InvestHK Advisory',
      partner: 'InvestHK',
      match: 88,
      description: 'Free government soft-landing advisory for overseas startups setting up in Hong Kong.',
      why: 'Practical setup help — company, intros and funding signposting — at no cost.',
      nextStep: 'Book a free InvestHK soft-landing consultation.',
      related: ['fund-cyberport', 'fund-itf'],
    },
    {
      id: 'fund-itf',
      category: 'funding',
      title: 'Innovation & Technology Fund',
      partner: 'ITC, HKSAR Government',
      match: 85,
      description: 'Government funding schemes supporting R&D and tech commercialisation.',
      why: 'Non-dilutive funding for teams turning research and technology into products.',
      nextStep: 'Review eligible schemes and prepare a project proposal.',
      related: ['fund-hkstp', 'fund-investhk'],
    },
    {
      id: 'fund-brinc',
      category: 'funding',
      title: 'Brinc Accelerator',
      partner: 'Brinc',
      match: 83,
      description: 'Global accelerator running hardware, climate and web3 programmes from Hong Kong.',
      why: 'Structured acceleration plus capital for founders ready to scale.',
      nextStep: 'Check which Brinc programme fits your stage and apply.',
      related: ['fund-cyberport', 'fund-hkstp'],
    },
  ],
  scholarship: [
    {
      id: 'sch-hku',
      category: 'scholarship',
      title: 'HKU Scholarships',
      partner: 'University of Hong Kong',
      match: 93,
      description: 'Merit scholarships covering tuition and living costs for international students.',
      why: 'Funded study removes the biggest barrier to choosing Hong Kong.',
      nextStep: 'Check eligibility and apply before the intake deadline.',
      related: ['sch-hkust', 'sch-cuhk'],
    },
    {
      id: 'sch-hkust',
      category: 'scholarship',
      title: 'HKUST Global',
      partner: 'HKUST',
      match: 91,
      description: 'Exchange and degree scholarships at one of Asia’s top universities.',
      why: 'A credible, funded academic path with an instant peer network.',
      nextStep: 'Register for the next info session for international applicants.',
      related: ['sch-hku', 'sch-exchange'],
    },
    {
      id: 'sch-cuhk',
      category: 'scholarship',
      title: 'CUHK International Admissions',
      partner: 'Chinese University of Hong Kong',
      match: 88,
      description: 'Admissions and entrance scholarships for international degree-seekers.',
      why: 'A bilingual campus that eases the transition into Hong Kong.',
      nextStep: 'Start an application and flag scholarship interest.',
      related: ['sch-hku', 'sch-hkust'],
    },
    {
      id: 'sch-rgc',
      category: 'scholarship',
      title: 'Research Grants Council',
      partner: 'RGC, Hong Kong',
      match: 84,
      description: 'Postgraduate fellowships and research funding across universities.',
      why: 'Funds PhD and research study with a stipend and tuition support.',
      nextStep: 'Identify a host supervisor and prepare a fellowship application.',
      related: ['sch-cuhk', 'sch-exchange'],
    },
    {
      id: 'sch-exchange',
      category: 'scholarship',
      title: 'University Exchange Programmes',
      partner: 'HK universities',
      match: 80,
      description: 'Semester and year-long exchange routes into Hong Kong campuses.',
      why: 'A lower-commitment first step to test life and study in Hong Kong.',
      nextStep: 'Ask your home university about HK exchange partners.',
      related: ['sch-hku', 'sch-hkust'],
    },
  ],
  nationality: [
    {
      id: 'nat-spanish',
      category: 'nationality',
      title: 'Spanish Chamber HK',
      partner: 'Cámara de Comercio de España en HK',
      match: 90,
      description: 'The hub for the Spanish-speaking community: events and mentorship.',
      why: 'The fastest route to people who made the same move from Spain.',
      nextStep: 'Join the next networking evening.',
      related: ['nat-latin', 'nat-french'],
    },
    {
      id: 'nat-german',
      category: 'nationality',
      title: 'German Chamber HK',
      partner: 'German Chamber of Commerce HK',
      match: 89,
      description: 'German business community, events and a German-speaking circle.',
      why: 'A familiar-culture anchor so you aren’t navigating a new city alone.',
      nextStep: 'Attend the monthly members’ mixer.',
      related: ['nat-french', 'nat-indian'],
    },
    {
      id: 'nat-indian',
      category: 'nationality',
      title: 'Indian Founders HK',
      partner: 'Indian Chamber of Commerce HK',
      match: 88,
      description: 'India-origin founders, researchers and professionals supporting newcomers.',
      why: 'A same-culture network that shortcuts months of figuring things out alone.',
      nextStep: 'Join the next Indian founders meetup.',
      related: ['nat-spanish', 'nat-latin'],
    },
    {
      id: 'nat-french',
      category: 'nationality',
      title: 'French Chamber HK',
      partner: 'French Chamber of Commerce HK',
      match: 84,
      description: 'One of Hong Kong’s largest international business communities.',
      why: 'Events, mentoring and introductions across the French-speaking world.',
      nextStep: 'Browse upcoming events and register.',
      related: ['nat-german', 'nat-spanish'],
    },
    {
      id: 'nat-latin',
      category: 'nationality',
      title: 'Latin Community HK',
      partner: 'Latin American community groups',
      match: 82,
      description: 'Cultural and social groups for Latin American newcomers.',
      why: 'Language, food and friendship that make arrival feel like home.',
      nextStep: 'Find the next community gathering.',
      related: ['nat-spanish', 'nat-indian'],
    },
  ],
  entrepreneurship: [
    {
      id: 'ent-startuphk',
      category: 'entrepreneurship',
      title: 'StartupHK',
      partner: 'StartupHK',
      match: 92,
      description: 'Hong Kong’s grassroots founder network — events and demo nights.',
      why: 'Where Hong Kong’s operators actually meet and help each other.',
      nextStep: 'RSVP to the next StartupHK demo night.',
      related: ['ent-ai', 'ent-events'],
    },
    {
      id: 'ent-ai',
      category: 'entrepreneurship',
      title: 'AI Community HK',
      partner: 'AI Community HK',
      match: 90,
      description: 'Engineers, researchers and AI founders sharing models, talks and hiring.',
      why: 'Plugs you into the people building AI in Hong Kong — collaborators and first hires.',
      nextStep: 'Join the community and the next paper-reading meetup.',
      related: ['ent-startuphk', 'ent-fintech'],
    },
    {
      id: 'ent-women',
      category: 'entrepreneurship',
      title: 'Women Founders HK',
      partner: 'Women Founders HK',
      match: 87,
      description: 'Peer support and visibility for women building companies in Hong Kong.',
      why: 'A founder community with mentorship and a strong support network.',
      nextStep: 'Join the next founders’ circle.',
      related: ['ent-startuphk', 'ent-events'],
    },
    {
      id: 'ent-fintech',
      category: 'entrepreneurship',
      title: 'FinTech Association HK',
      partner: 'FTAHK',
      match: 84,
      description: 'The industry body connecting Hong Kong’s fintech founders and talent.',
      why: 'Direct access to one of Hong Kong’s strongest startup verticals.',
      nextStep: 'Explore membership and upcoming events.',
      related: ['ent-ai', 'ent-startuphk'],
    },
    {
      id: 'ent-events',
      category: 'entrepreneurship',
      title: 'Founder Networking Events',
      partner: 'Ecosystem partners',
      match: 80,
      description: 'Regular meetups, pitch nights and mixers across the city.',
      why: 'Low-friction first introductions to the local founder scene.',
      nextStep: 'Add the next few events to your calendar.',
      related: ['ent-startuphk', 'ent-women'],
    },
  ],
  student: [
    {
      id: 'stu-hkusu',
      category: 'student',
      title: 'HKU Student Union',
      partner: 'University of Hong Kong',
      match: 90,
      description: 'Clubs, societies and student life at HKU.',
      why: 'A ready-made circle the day you arrive on campus.',
      nextStep: 'Browse societies and sign up during orientation.',
      related: ['stu-cuhk', 'stu-clubs'],
    },
    {
      id: 'stu-cuhk',
      category: 'student',
      title: 'CUHK International House',
      partner: 'Chinese University of Hong Kong',
      match: 87,
      description: 'Residence and community for international students.',
      why: 'Housing plus an instant international peer group.',
      nextStep: 'Apply for a place for your intake.',
      related: ['stu-hkusu', 'stu-erasmus'],
    },
    {
      id: 'stu-hkust-ec',
      category: 'student',
      title: 'HKUST Entrepreneurship Center',
      partner: 'HKUST',
      match: 85,
      description: 'Programmes and space for student founders.',
      why: 'For students who want to build, not just study.',
      nextStep: 'Join a student founder programme.',
      related: ['stu-clubs', 'stu-erasmus'],
    },
    {
      id: 'stu-erasmus',
      category: 'student',
      title: 'Erasmus Alumni HK',
      partner: 'Erasmus+ Alumni Network',
      match: 82,
      description: 'European exchange alumni building careers in Hong Kong.',
      why: 'Bridges your European background into local early-career circles.',
      nextStep: 'Connect with a chapter buddy.',
      related: ['stu-cuhk', 'stu-clubs'],
    },
    {
      id: 'stu-clubs',
      category: 'student',
      title: 'International Student Clubs',
      partner: 'HK universities',
      match: 80,
      description: 'Cross-campus clubs for newcomers to university life.',
      why: 'Friendships and orientation from people who arrived before you.',
      nextStep: 'Get matched with a student ambassador.',
      related: ['stu-hkusu', 'stu-cuhk'],
    },
  ],
  social: [
    {
      id: 'soc-hkte-vol',
      category: 'social',
      title: 'HKTE Volunteer',
      partner: 'Hong Kong Talent Engage',
      match: 88,
      description: 'Volunteering and orientation run by HK Talent Engage.',
      why: 'Turns goodwill into real local belonging from week one.',
      nextStep: 'Sign up for a volunteering activity.',
      related: ['soc-foodlink', 'soc-culture'],
    },
    {
      id: 'soc-foodlink',
      category: 'social',
      title: 'Foodlink HK',
      partner: 'Foodlink Foundation',
      match: 86,
      description: 'Volunteer with a leading charity tackling food waste and hunger.',
      why: 'Meaningful work alongside locals and other newcomers.',
      nextStep: 'Book a weekend volunteering shift.',
      related: ['soc-hkte-vol', 'soc-running'],
    },
    {
      id: 'soc-running',
      category: 'social',
      title: 'Running Clubs',
      partner: 'Community sport groups',
      match: 82,
      description: 'Social running and hiking groups across Hong Kong.',
      why: 'An easy, low-pressure way to meet people and see the city.',
      nextStep: 'Join a weekly group run.',
      related: ['soc-language', 'soc-foodlink'],
    },
    {
      id: 'soc-language',
      category: 'social',
      title: 'Language Exchange Groups',
      partner: 'Community language meetups',
      match: 80,
      description: 'Cantonese / English / multilingual exchange meetups.',
      why: 'Builds everyday confidence and a friendly local network.',
      nextStep: 'Find a weekly language exchange near you.',
      related: ['soc-running', 'soc-culture'],
    },
    {
      id: 'soc-culture',
      category: 'social',
      title: 'Cultural Onboarding Events',
      partner: 'Ecosystem partners',
      match: 78,
      description: 'Orientation and cultural events for new arrivals.',
      why: 'A guided first look at living well in Hong Kong.',
      nextStep: 'Attend the next newcomer orientation.',
      related: ['soc-hkte-vol', 'soc-language'],
    },
  ],
  visa: [
    {
      id: 'visa-hkte',
      category: 'visa',
      title: 'HKTE Talent Support',
      partner: 'Hong Kong Talent Engage',
      match: 90,
      description: 'Government onboarding: visa guidance, orientation and settling-in support.',
      why: 'Answers the practical “who do I even talk to” questions, fast.',
      nextStep: 'Book an HKTE newcomer orientation session.',
      related: ['visa-ttps', 'visa-checklist'],
    },
    {
      id: 'visa-ttps',
      category: 'visa',
      title: 'Top Talent Pass Scheme',
      partner: 'Immigration Department (guidance)',
      match: 88,
      description: 'Guidance on the Top Talent Pass Scheme (TTPS) for high-potential talent.',
      why: 'A fast route to live and work in Hong Kong for eligible talent.',
      nextStep: 'Check eligibility and prepare your documents.',
      related: ['visa-qmas', 'visa-hkte'],
    },
    {
      id: 'visa-qmas',
      category: 'visa',
      title: 'Quality Migrant Admission Scheme',
      partner: 'Immigration Department (guidance)',
      match: 84,
      description: 'Guidance on the points-based QMAS for skilled migrants.',
      why: 'A residence route that doesn’t require a job offer first.',
      nextStep: 'Run the points self-assessment.',
      related: ['visa-ttps', 'visa-housing'],
    },
    {
      id: 'visa-housing',
      category: 'visa',
      title: 'Housing Orientation',
      partner: 'Relocation partners',
      match: 80,
      description: 'Help understanding neighbourhoods, leases and costs.',
      why: 'Avoids costly first-month mistakes finding a place to live.',
      nextStep: 'Review a neighbourhood guide for your budget.',
      related: ['visa-checklist', 'visa-hkte'],
    },
    {
      id: 'visa-checklist',
      category: 'visa',
      title: 'Local Admin Checklist',
      partner: 'City Twin',
      match: 78,
      description: 'HK ID, bank account, Octopus, phone and the essentials.',
      why: 'A simple first-week checklist so nothing important slips.',
      nextStep: 'Work through the first-week checklist.',
      related: ['visa-housing', 'visa-hkte'],
    },
  ],
  research: [
    {
      id: 'res-hkstp-ai',
      category: 'research',
      title: 'HKSTP AI Lab',
      partner: 'Hong Kong Science & Technology Parks',
      match: 94,
      description: 'AI-focused lab space, mentorship and a research-to-startup pathway.',
      why: 'Bridges the gap from AI research to a fundable company.',
      nextStep: 'Apply for an AI Lab desk and a mentor match.',
      related: ['res-innohk', 'res-cyberport-ai'],
    },
    {
      id: 'res-innohk',
      category: 'research',
      title: 'InnoHK Research Clusters',
      partner: 'InnoHK',
      match: 92,
      description: 'Government-backed research clusters in AI, robotics and healthtech.',
      why: 'Do world-class research while exploring commercialisation.',
      nextStep: 'Identify a cluster lab matching your research.',
      related: ['res-hkstp-ai', 'res-commercial'],
    },
    {
      id: 'res-commercial',
      category: 'research',
      title: 'University Commercialization Offices',
      partner: 'HK universities',
      match: 86,
      description: 'Tech-transfer offices that license and spin out university research.',
      why: 'The formal path from a lab result to a company.',
      nextStep: 'Talk to the tech-transfer office at your host university.',
      related: ['res-innohk', 'res-cofounder'],
    },
    {
      id: 'res-cyberport-ai',
      category: 'research',
      title: 'Cyberport AI Programmes',
      partner: 'Cyberport',
      match: 84,
      description: 'AI-focused incubation and ecosystem programmes.',
      why: 'Funding and community specifically for AI builders.',
      nextStep: 'Explore the current AI programme intake.',
      related: ['res-hkstp-ai', 'res-cofounder'],
    },
    {
      id: 'res-cofounder',
      category: 'research',
      title: 'Co-founder Matching',
      partner: 'Founder communities',
      match: 81,
      description: 'Communities that help researchers find a business co-founder.',
      why: 'Pairs deep technical work with someone who can build the company.',
      nextStep: 'Create a co-founder-wanted profile.',
      related: ['res-commercial', 'res-cyberport-ai'],
    },
  ],
};

// Flat lookup by opportunity id.
export const OPPORTUNITY_MAP: Record<string, Opportunity> = Object.values(OPPORTUNITIES)
  .flat()
  .reduce((acc, o) => ((acc[o.id] = o), acc), {} as Record<string, Opportunity>);

// ---- Journey timeline steps ----
export interface JourneyStep {
  title: string;
  description: string;
  timestamp: string;
}
export const JOURNEY_STEPS: JourneyStep[] = [
  { title: 'Language detected and profile mapped', description: 'City Twin understood your language and built your talent profile.', timestamp: 'Day 0' },
  { title: 'Relevant opportunities identified', description: 'A personalized map of funding, study and community matches.', timestamp: 'Day 0' },
  { title: 'Community entry points suggested', description: 'Real groups and partners where people like you already gather.', timestamp: 'Week 1' },
  { title: 'Next actions created', description: 'Concrete first steps — applications, events and intros — saved to your path.', timestamp: 'Week 1' },
  { title: 'Integration Score improved', description: 'Your orientation, opportunity fit and clarity measurably increase.', timestamp: 'Month 1' },
];

// ---- Organizations dashboard (simulated 100-user pilot) ----
export const DASHBOARD = {
  stats: {
    pilotUsers: 100,
    countries: 18,
    languages: 9,
    avgScoreBefore: 34,
    avgScoreAfter: 82,
  },
  integrationGap:
    'International founders can find funding options, but still need stronger community entry points.',
  recommendedAction: 'Create a first-week onboarding path for international AI founders.',
  needsChart: [
    { label: 'Funding', value: 67 },
    { label: 'Community', value: 58 },
    { label: 'Visa guidance', value: 42 },
    { label: 'Scholarships', value: 35 },
    { label: 'Local orientation', value: 31 },
  ],
  partnerChart: [
    { label: 'Cyberport', value: 76 },
    { label: 'HKSTP', value: 69 },
    { label: 'HKTE', value: 61 },
    { label: 'Universities', value: 44 },
    { label: 'Founder communities', value: 39 },
  ],
};

// ---- Business model + GTM ----
export const BUSINESS_MODEL = [
  { title: 'Free for talent', body: 'Students, founders, researchers and professionals use City Twin for free.' },
  { title: 'Paid by institutions', body: 'HKTE, Cyberport, HKSTP, universities, accelerators and innovation districts pay for deployment and insights.' },
  { title: 'B2B / B2G SaaS', body: 'Annual subscription for a branded onboarding portal, ecosystem visibility, anonymized insights and retention intelligence.' },
];

export const GTM_PHASES = [
  { phase: 'Phase 1', body: '100-user Hong Kong pilot via QR code.' },
  { phase: 'Phase 2', body: 'University and startup ecosystem pilots.' },
  { phase: 'Phase 3', body: 'Institutional SaaS with HKTE / Cyberport / HKSTP-style partners.' },
  { phase: 'Phase 4', body: 'Expansion to other global talent cities.' },
];

export const HONESTY_NOTE =
  'Prototype: recommendations use curated demo data, dashboard metrics are simulated for a 100-user pilot, and the Integration Score is a prototype heuristic.';
