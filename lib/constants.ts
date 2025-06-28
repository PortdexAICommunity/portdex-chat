import { generateDummyPassword } from './db/utils';
import type { DataTypes, HomeMarketplaceItem, MarketplaceItem } from './types';

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
    id: 'dall-e-3',
    name: 'DALL-E 3',
    creator: 'OpenAI',
    description:
      'Advanced AI image generation model capable of producing high-quality, creative pictures from text prompts.',
    category: 'Image Generation',
    icon: 'https://cdn.activepieces.com/pieces/openai.png',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    date: '2024-05-15',
  },
  {
    id: 'dall-e-2',
    name: 'DALL-E 2',
    creator: 'OpenAI',
    description:
      "Second generation of OpenAI's image generation model, known for creative visuals.",
    category: 'Image Generation',
    icon: 'https://cdn.activepieces.com/pieces/openai.png',
    gradient: 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)',
    date: '2023-03-01',
  },
  {
    id: 'sdxl-lightning-4step',
    name: 'SDXL Lightning 4-Step',
    creator: 'Bytedance via Replicate',
    description:
      'Ultra-fast diffusion-based image synthesis model, optimized for quick results.',
    category: 'Image Generation',
    icon: 'https://cdn.activepieces.com/pieces/replicate.png',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    date: '2024-04-10',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    creator: 'Stability AI via Replicate',
    description:
      'Open-source diffusion model for generating images from natural language descriptions.',
    category: 'Image Generation',
    icon: 'https://cdn.activepieces.com/pieces/replicate.png',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    date: '2023-10-18',
  },
  {
    id: 'flux-schnell',
    name: 'Flux Schnell',
    creator: 'Black Forest Labs via Replicate',
    description:
      'Fast and flexible model for creative image generation, available on Replicate.',
    category: 'Image Generation',
    icon: 'https://cdn.activepieces.com/pieces/replicate.png',
    gradient: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    date: '2024-01-22',
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

export const homeMarketplaceItems: HomeMarketplaceItem[] = [
  {
    id: 'crypto-fraud-detector',
    title: 'Crypto Fraud Detection Agent',
    description:
      'Detect and analyze potential crypto scams, phishing, and fraud using AI.',
    category: 'Finance',
    icon: '🛡️',
    gradient: 'from-emerald-500 to-emerald-700',
    date: '2025-06-01',
    type: 'assistant',
    creator: 'Portdex',
  },
  {
    id: 'finance-realtime-chat',
    title: 'Finance Realtime Chat',
    description:
      'Chat with an AI agent about budgeting, investing, or financial planning in real-time.',
    category: 'Finance',
    icon: '💬',
    gradient: 'from-green-500 to-green-700',
    date: '2025-06-01',
    type: 'plugin',
    creator: 'Portdex',
  },
  {
    id: 'crypto-investment-recommendation',
    title: 'Crypto Investment Advisor',
    description:
      'Get personalized cryptocurrency investment suggestions based on your risk profile and goals.',
    category: 'Finance',
    icon: '📈',
    gradient: 'from-purple-500 to-purple-700',
    date: '2025-06-01',
    type: 'plugin',
    creator: 'Portdex',
  },
  {
    id: 'market-research-agent',
    title: 'Market Research Agent',
    description:
      'Perform AI-powered research on stocks, tokens, trends, and global financial data.',
    category: 'Finance',
    icon: '📊',
    gradient: 'from-indigo-500 to-indigo-700',
    date: '2025-06-01',
    type: 'plugin',
    creator: 'Portdex',
  },
  {
    id: 'legal-crypto-compliance',
    title: 'Crypto Compliance Advisor',
    description:
      'Understand crypto regulations, KYC/AML requirements, and legal obligations with AI assistance.',
    category: 'Finance',
    icon: '⚖️',
    gradient: 'from-yellow-500 to-yellow-700',
    date: '2025-06-01',
    type: 'assistant',
    creator: 'Portdex',
  },
  {
    id: 'real-time-market-analyzer',
    title: 'Realtime Market Analyzer',
    description:
      'Live analysis of crypto and financial markets using AI-driven signals and indicators.',
    category: 'Finance',
    icon: '⏱️',
    gradient: 'from-red-500 to-red-700',
    date: '2025-06-01',
    type: 'assistant',
    creator: 'Portdex',
  },
  {
    id: 'find-financial-advisors',
    title: 'Find Financial Advisors',
    description:
      'Discover and connect with qualified financial advisors based on your needs.',
    category: 'Finance',
    icon: '🧑‍💼',
    gradient: 'from-sky-500 to-sky-700',
    date: '2025-06-01',
    type: 'plugin',
    creator: 'Portdex',
  },
];
