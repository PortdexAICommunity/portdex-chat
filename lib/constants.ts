import { generateDummyPassword } from './db/utils';
import type { DataTypes, MarketplaceItem } from './types';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const marketplaceItems: MarketplaceItem[] = [
  // Courses for Professionals
  {
    id: '1',
    title: 'Full-Stack Web Engineering',
    description:
      'Advanced training in scalable web application development using React, Node.js, TypeScript, and cloud-native deployment strategies.',
    image: '/images/course.jpg',
    category: 'courses',
  },
  {
    id: '2',
    title: 'AI & Data Science for Developers',
    description:
      'Practical course for developers to integrate AI, ML models, and data pipelines using Python, TensorFlow, and modern toolchains.',
    image: '/images/course.jpg',
    category: 'courses',
  },
  {
    id: '3',
    title: 'Digital Marketing for Founders',
    description:
      'A crash course for startup founders and CEOs on SEO, content strategy, analytics, and customer acquisition funnels.',
    image: '/images/course.jpg',
    category: 'courses',
  },
  {
    id: '4',
    title: 'Product Design & UI/UX for Developers',
    description:
      'Learn design systems, UI thinking, and user research to improve app usability and conversion.',
    image: '/images/course.jpg',
    category: 'courses',
  },
  {
    id: '5',
    title: 'Mobile App Engineering with Flutter & React Native',
    description:
      'Build cross-platform apps with performance optimization and CI/CD best practices.',
    image: '/images/course.jpg',
    category: 'courses',
  },

  // Professional Mentors & Advisors
  {
    id: '6',
    title: 'Tech Career Mentorship',
    description:
      'Get 1-on-1 career coaching from experienced engineers and hiring managers at top tech firms.',
    image: '/images/tutor.jpg',
    category: 'tutors',
  },
  {
    id: '7',
    title: 'Startup Founders & VC Advisors',
    description:
      'Connect with experienced startup founders and investors to get advice on fundraising, MVP, growth, and scaling.',
    image: '/images/tutor.jpg',
    category: 'tutors',
  },
  {
    id: '8',
    title: 'Cloud & DevOps Experts',
    description:
      'Consult certified AWS, Azure, and DevOps engineers on infrastructure, CI/CD, and cloud architecture.',
    image: '/images/tutor.jpg',
    category: 'tutors',
  },
  {
    id: '9',
    title: 'Interview Prep: System Design & DSA',
    description:
      'Crack FAANG interviews with mock sessions on system design, DSA, and behavioral questions.',
    image: '/images/tutor.jpg',
    category: 'tutors',
  },
  {
    id: '10',
    title: 'Leadership & Executive Coaching',
    description:
      'Partner with executive coaches to grow as a tech leader, improve decision-making and communication.',
    image: '/images/tutor.jpg',
    category: 'tutors',
  },

  // Resources for Tech & Business Growth
  {
    id: '11',
    title: 'Latest Tech Trends & Tools',
    description:
      'Stay ahead with curated insights on emerging frameworks, APIs, AI tools, and SaaS ecosystems.',
    image: '/images/education.jpg',
    category: 'resources',
  },
  {
    id: '12',
    title: 'Best Developer Tools & Platforms',
    description:
      'Comparisons and reviews of dev tools, hosting providers, IDEs, and workflow automation tools.',
    image: '/images/education.jpg',
    category: 'resources',
  },
  {
    id: '13',
    title: 'Productivity Hacks for IT Professionals',
    description:
      'Actionable techniques and tools to boost focus, manage remote work, and streamline daily tasks.',
    image: '/images/education.jpg',
    category: 'resources',
  },
  {
    id: '14',
    title: 'Tech Career Roadmaps',
    description:
      'Detailed skill paths for front-end, back-end, cloud, and AI roles with recommended tools and projects.',
    image: '/images/education.jpg',
    category: 'resources',
  },
  {
    id: '15',
    title: 'Business Tools & SaaS Recommendations',
    description:
      'Explore tools for CRMs, project management, billing, and collaboration tailored to growing teams.',
    image: '/images/education.jpg',
    category: 'resources',
  },
  // AI Models
  {
    id: '16',
    title: 'Code Completion with DeepCoder',
    description:
      'AI-powered code assistant for auto-completing functions, detecting bugs, and suggesting improvements in real-time.',
    image: '/images/ai-model.jpg',
    category: 'ai-models',
  },
  {
    id: '17',
    title: 'ChatOps Dev Assistant',
    description:
      'A developer-focused LLM trained to assist with DevOps scripting, CI/CD config, and log debugging via chat.',
    image: '/images/ai-model.jpg',
    category: 'ai-models',
  },
  {
    id: '18',
    title: 'Business GPT: Executive Assistant',
    description:
      'An LLM fine-tuned to assist C-suite executives with summaries, strategic insights, and automated report generation.',
    image: '/images/ai-model.jpg',
    category: 'ai-models',
  },

  // Software Tools
  {
    id: '19',
    title: 'Product Analytics Suite',
    description:
      'Track user behavior, funnel metrics, and retention with this self-hosted, developer-friendly analytics tool.',
    image: '/images/software.jpg',
    category: 'software',
  },
  {
    id: '20',
    title: 'DevEnv Manager',
    description:
      'All-in-one CLI to spin up local environments with Docker, database seeding, mock APIs, and GitHub Actions.',
    image: '/images/software.jpg',
    category: 'software',
  },
  {
    id: '21',
    title: 'AutoDoc Generator',
    description:
      'AI-based documentation generator for codebases, APIs, and SDKs with markdown and OpenAPI output.',
    image: '/images/software.jpg',
    category: 'software',
  },

  // Templates
  {
    id: '22',
    title: 'SaaS Landing Page (Next.js + Tailwind)',
    description:
      'Production-ready, responsive SaaS marketing site template with CTAs, pricing, blog, and signup flow.',
    image: '/images/template.jpg',
    category: 'templates',
  },
  {
    id: '23',
    title: 'Investor Pitch Deck Template (Figma)',
    description:
      'A modern, VC-ready pitch deck design template optimized for tech startups.',
    image: '/images/template.jpg',
    category: 'templates',
  },
  {
    id: '24',
    title: 'Admin Dashboard UI (React)',
    description:
      'Modular admin dashboard template with charts, tables, auth, and settings—ideal for SaaS and internal tools.',
    image: '/images/template.jpg',
    category: 'templates',
  },
];

export const assistants: DataTypes[] = [
  {
    id: '1',
    name: 'Tech Paper Explainer',
    creator: 'AdjeShen',
    description:
      'Breaks down complex technical and research papers into simple summaries for engineers and product teams.',
    category: 'Engineering',
    icon: '📘',
    gradient: 'from-green-400 to-purple-500',
    date: '2025-05-09',
  },
  {
    id: '2',
    name: 'Startup Strategy Coach',
    creator: 'egornomic',
    description:
      'Helps founders with go-to-market strategies, business models, and lean startup planning.',
    category: 'Startup',
    icon: '🚀',
    gradient: 'from-indigo-400 to-blue-500',
    date: '2025-04-15',
  },
  {
    id: '3',
    name: 'Technical Writing Assistant',
    creator: 'q2019715',
    description:
      'Helps you rewrite documentation, API references, and blog posts with technical clarity.',
    category: 'Content',
    icon: '📝',
    gradient: 'from-orange-400 to-yellow-500',
    date: '2025-03-13',
  },
  {
    id: '4',
    name: 'DevOps & Infra Coach',
    creator: 'arvinxx',
    description:
      'Get expert suggestions on infra design, cost optimization, CI/CD pipelines, and cloud architecture.',
    category: 'DevOps',
    icon: '🛠️',
    gradient: 'from-cyan-400 to-blue-500',
    date: '2025-03-11',
  },
  {
    id: '5',
    name: 'AI Prompt Engineer',
    creator: 'He-Xun',
    description:
      'Generates powerful prompts and workflows to automate research, code generation, and content using LLMs.',
    category: 'AI',
    icon: '🤖',
    gradient: 'from-purple-200 to-pink-200',
    date: '2025-03-07',
  },
  {
    id: '6',
    name: 'Policy & Tax Assistant (India)',
    creator: 'lindongjie1992',
    description:
      'Provides clarity on GST, startup policies, and tax-saving schemes relevant to Indian tech businesses.',
    category: 'Business',
    icon: '📊',
    gradient: 'from-yellow-400 to-orange-500',
    date: '2025-02-26',
  },
  {
    id: '7',
    name: 'Video Content Summarizer',
    creator: 'shinishiho',
    description:
      'Summarizes podcasts, tech talks, and tutorials from YouTube into digestible notes.',
    category: 'Media',
    icon: '🎙️',
    gradient: 'from-gray-400 to-gray-600',
    date: '2025-02-24',
  },
  {
    id: '8',
    name: 'Remote Work Productivity Guide',
    creator: 'WeR-Best',
    description:
      'Helps remote developers and managers optimize focus, routines, and async workflows.',
    category: 'Productivity',
    icon: '🧠',
    gradient: 'from-green-400 to-teal-500',
    date: '2025-02-23',
  },
];

export const plugins: DataTypes[] = [
  {
    id: '1',
    name: 'PortfolioMeta',
    creator: 'portfoliometa',
    description:
      'Track stocks, crypto, and assets with real-time dashboards tailored to tech investors.',
    category: 'Stocks & Finance',
    icon: '📈',
  },
  {
    id: '2',
    name: 'Web',
    creator: 'Proghit',
    description:
      'Smart web search that interprets content and extracts relevant insights for devs and researchers.',
    category: 'Web Search',
    icon: '🌐',
  },
  {
    id: '3',
    name: 'Bing_websearch',
    creator: 'FineHow',
    description:
      "Retrieve fast results and summaries using Bing's powerful API stack.",
    category: 'Web Search',
    icon: '🔍',
  },
  {
    id: '4',
    name: 'Google CSE',
    creator: 'vsnthdev',
    description: 'Access curated Google results through a fast CSE interface.',
    category: 'Web Search',
    icon: '🔍',
  },
  {
    id: '5',
    name: 'Tongyi wanxiang Image Generator',
    creator: 'YourfX',
    description:
      "Use Alibaba's generative AI to create mockups, UI illustrations, and branded visuals.",
    category: 'Media Generation',
    icon: '🎨',
  },
  {
    id: '6',
    name: 'Shopping tools',
    creator: 'shoppingtools',
    description:
      'Compare developer gadgets, productivity gear, and accessories from eBay & AliExpress.',
    category: 'Web Search',
    icon: '🛒',
  },
  {
    id: '7',
    name: 'Savvy Trader AI',
    creator: 'savvytrader',
    description: 'AI investing assistant for stocks, crypto, and tech funds.',
    category: 'Stocks & Finance',
    icon: '💹',
  },
  {
    id: '8',
    name: 'Search1API',
    creator: 'fatwang2',
    description:
      'Aggregated search across niche technical and business sources.',
    category: 'Web Search',
    icon: '🔍',
  },
];

export const aiModels: DataTypes[] = [
  {
    id: 'ai-1',
    name: 'DevCode Pro',
    creator: 'CodeAI Inc.',
    description:
      'AI model optimized for intelligent code completion, bug detection, and real-time refactoring for developers.',
    category: 'AI Model',
    icon: '🧠',
    gradient: 'from-purple-500 to-indigo-600',
    date: '2025-04-01',
  },
  {
    id: 'ai-2',
    name: 'BizGPT Executive',
    creator: 'EnterpriseAI',
    description:
      'An AI assistant for executives and managers that generates summaries, memos, and strategic insights.',
    category: 'AI Model',
    icon: '📊',
    gradient: 'from-yellow-500 to-orange-600',
    date: '2025-03-28',
  },
  {
    id: 'ai-3',
    name: 'CloudOps LLM',
    creator: 'DevCloud',
    description:
      'Built to assist DevOps teams with Terraform scripts, CI/CD setups, and cloud service automation.',
    category: 'AI Model',
    icon: '☁️',
    gradient: 'from-blue-400 to-cyan-500',
    date: '2025-03-15',
  },
];

export const softwareTools: DataTypes[] = [
  {
    id: 'sw-1',
    name: 'InfraDesk',
    creator: 'StackOps',
    description:
      'Manage cloud infrastructure, logs, and server metrics through a unified self-hosted dashboard.',
    category: 'Software',
    icon: '🛠️',
    gradient: 'from-gray-500 to-zinc-700',
    date: '2025-02-20',
  },
  {
    id: 'sw-2',
    name: 'AutoDoc AI',
    creator: 'DocsifyAI',
    description:
      'Automatically generates documentation for APIs, SDKs, and codebases using AI.',
    category: 'Software',
    icon: '📄',
    gradient: 'from-blue-500 to-blue-700',
    date: '2025-03-05',
  },
  {
    id: 'sw-3',
    name: 'StackInsights',
    creator: 'EngageAnalytics',
    description:
      'Developer team analytics tool for tracking PR velocity, bottlenecks, and engineering health.',
    category: 'Software',
    icon: '📈',
    gradient: 'from-green-400 to-emerald-500',
    date: '2025-04-12',
  },
];

export const siteTemplates: DataTypes[] = [
  {
    id: 'tpl-1',
    name: 'SaaS Pro Landing',
    creator: 'NextStart',
    description:
      'Responsive SaaS product site with pricing, blog, and signup CTA — built with Next.js and Tailwind.',
    category: 'Template',
    icon: '🧩',
    gradient: 'from-pink-500 to-rose-600',
    date: '2025-03-10',
  },
  {
    id: 'tpl-2',
    name: 'Founder Portfolio',
    creator: 'DevPort',
    description:
      'Personal branding site for developers and founders, with project sections, blog, and MDX support.',
    category: 'Template',
    icon: '👤',
    gradient: 'from-indigo-500 to-violet-600',
    date: '2025-02-22',
  },
  {
    id: 'tpl-3',
    name: 'Admin Dashboard X',
    creator: 'UIForge',
    description:
      'Prebuilt admin dashboard template with charts, auth pages, tables, and settings UI.',
    category: 'Template',
    icon: '📊',
    gradient: 'from-sky-500 to-blue-600',
    date: '2025-04-08',
  },
];
