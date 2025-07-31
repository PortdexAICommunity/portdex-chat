import { generateDummyPassword } from "./db/utils";
import type { DataTypes, HomeMarketplaceItem, MarketplaceItem } from "./types";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment =
	process.env.NODE_ENV === "development" ||
	process.env.NEXTAUTH_URL?.includes("localhost") ||
	process.env.AUTH_URL?.includes("localhost");
export const isTestEnvironment = Boolean(
	process.env.PLAYWRIGHT_TEST_BASE_URL ||
		process.env.PLAYWRIGHT ||
		process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const marketplaceItems: MarketplaceItem[] = [
	// Courses for Professionals
	{
		id: "1",
		title: "Full-Stack Web Engineering",
		description:
			"Advanced training in scalable web application development using React, Node.js, TypeScript, and cloud-native deployment strategies.",
		image: "/images/course.jpg",
		category: "courses",
	},
	{
		id: "2",
		title: "AI & Data Science for Developers",
		description:
			"Practical course for developers to integrate AI, ML models, and data pipelines using Python, TensorFlow, and modern toolchains.",
		image: "/images/course.jpg",
		category: "courses",
	},
	{
		id: "3",
		title: "Digital Marketing for Founders",
		description:
			"A crash course for startup founders and CEOs on SEO, content strategy, analytics, and customer acquisition funnels.",
		image: "/images/course.jpg",
		category: "courses",
	},
	{
		id: "4",
		title: "Product Design & UI/UX for Developers",
		description:
			"Learn design systems, UI thinking, and user research to improve app usability and conversion.",
		image: "/images/course.jpg",
		category: "courses",
	},
	{
		id: "5",
		title: "Mobile App Engineering with Flutter & React Native",
		description:
			"Build cross-platform apps with performance optimization and CI/CD best practices.",
		image: "/images/course.jpg",
		category: "courses",
	},

	// Professional Mentors & Advisors
	{
		id: "6",
		title: "Tech Career Mentorship",
		description:
			"Get 1-on-1 career coaching from experienced engineers and hiring managers at top tech firms.",
		image: "/images/tutor.jpg",
		category: "tutors",
	},
	{
		id: "7",
		title: "Startup Founders & VC Advisors",
		description:
			"Connect with experienced startup founders and investors to get advice on fundraising, MVP, growth, and scaling.",
		image: "/images/tutor.jpg",
		category: "tutors",
	},
	{
		id: "8",
		title: "Cloud & DevOps Experts",
		description:
			"Consult certified AWS, Azure, and DevOps engineers on infrastructure, CI/CD, and cloud architecture.",
		image: "/images/tutor.jpg",
		category: "tutors",
	},
	{
		id: "9",
		title: "Interview Prep: System Design & DSA",
		description:
			"Crack FAANG interviews with mock sessions on system design, DSA, and behavioral questions.",
		image: "/images/tutor.jpg",
		category: "tutors",
	},
	{
		id: "10",
		title: "Leadership & Executive Coaching",
		description:
			"Partner with executive coaches to grow as a tech leader, improve decision-making and communication.",
		image: "/images/tutor.jpg",
		category: "tutors",
	},

	// Resources for Tech & Business Growth
	{
		id: "11",
		title: "Latest Tech Trends & Tools",
		description:
			"Stay ahead with curated insights on emerging frameworks, APIs, AI tools, and SaaS ecosystems.",
		image: "/images/education.jpg",
		category: "resources",
	},
	{
		id: "12",
		title: "Best Developer Tools & Platforms",
		description:
			"Comparisons and reviews of dev tools, hosting providers, IDEs, and workflow automation tools.",
		image: "/images/education.jpg",
		category: "resources",
	},
	{
		id: "13",
		title: "Productivity Hacks for IT Professionals",
		description:
			"Actionable techniques and tools to boost focus, manage remote work, and streamline daily tasks.",
		image: "/images/education.jpg",
		category: "resources",
	},
	{
		id: "14",
		title: "Tech Career Roadmaps",
		description:
			"Detailed skill paths for front-end, back-end, cloud, and AI roles with recommended tools and projects.",
		image: "/images/education.jpg",
		category: "resources",
	},
	{
		id: "15",
		title: "Business Tools & SaaS Recommendations",
		description:
			"Explore tools for CRMs, project management, billing, and collaboration tailored to growing teams.",
		image: "/images/education.jpg",
		category: "resources",
	},
	// AI Models
	{
		id: "16",
		title: "Code Completion with DeepCoder",
		description:
			"AI-powered code assistant for auto-completing functions, detecting bugs, and suggesting improvements in real-time.",
		image: "/images/ai-model.jpg",
		category: "ai-models",
	},
	{
		id: "17",
		title: "ChatOps Dev Assistant",
		description:
			"A developer-focused LLM trained to assist with DevOps scripting, CI/CD config, and log debugging via chat.",
		image: "/images/ai-model.jpg",
		category: "ai-models",
	},
	{
		id: "18",
		title: "Business GPT: Executive Assistant",
		description:
			"An LLM fine-tuned to assist C-suite executives with summaries, strategic insights, and automated report generation.",
		image: "/images/ai-model.jpg",
		category: "ai-models",
	},

	// Software Tools
	{
		id: "19",
		title: "Product Analytics Suite",
		description:
			"Track user behavior, funnel metrics, and retention with this self-hosted, developer-friendly analytics tool.",
		image: "/images/software.jpg",
		category: "software",
	},
	{
		id: "20",
		title: "DevEnv Manager",
		description:
			"All-in-one CLI to spin up local environments with Docker, database seeding, mock APIs, and GitHub Actions.",
		image: "/images/software.jpg",
		category: "software",
	},
	{
		id: "21",
		title: "AutoDoc Generator",
		description:
			"AI-based documentation generator for codebases, APIs, and SDKs with markdown and OpenAPI output.",
		image: "/images/software.jpg",
		category: "software",
	},

	// Templates
	{
		id: "22",
		title: "SaaS Landing Page (Next.js + Tailwind)",
		description:
			"Production-ready, responsive SaaS marketing site template with CTAs, pricing, blog, and signup flow.",
		image: "/images/template.jpg",
		category: "templates",
	},
	{
		id: "23",
		title: "Investor Pitch Deck Template (Figma)",
		description:
			"A modern, VC-ready pitch deck design template optimized for tech startups.",
		image: "/images/template.jpg",
		category: "templates",
	},
	{
		id: "24",
		title: "Admin Dashboard UI (React)",
		description:
			"Modular admin dashboard template with charts, tables, auth, and settings—ideal for SaaS and internal tools.",
		image: "/images/template.jpg",
		category: "templates",
	},
];

export const plugins: DataTypes[] = [
	{
		id: "1",
		name: "PortfolioMeta",
		creator: "portfoliometa",
		description:
			"Track stocks, crypto, and assets with real-time dashboards tailored to tech investors.",
		category: "Stocks & Finance",
		icon: "📈",
	},
	{
		id: "2",
		name: "Web",
		creator: "Proghit",
		description:
			"Smart web search that interprets content and extracts relevant insights for devs and researchers.",
		category: "Web Search",
		icon: "🌐",
	},
	{
		id: "3",
		name: "Bing_websearch",
		creator: "FineHow",
		description:
			"Retrieve fast results and summaries using Bing's powerful API stack.",
		category: "Web Search",
		icon: "🔍",
	},
	{
		id: "4",
		name: "Google CSE",
		creator: "vsnthdev",
		description: "Access curated Google results through a fast CSE interface.",
		category: "Web Search",
		icon: "🔍",
	},
	{
		id: "5",
		name: "Tongyi wanxiang Image Generator",
		creator: "YourfX",
		description:
			"Use Alibaba's generative AI to create mockups, UI illustrations, and branded visuals.",
		category: "Media Generation",
		icon: "🎨",
	},
	{
		id: "6",
		name: "Shopping tools",
		creator: "shoppingtools",
		description:
			"Compare developer gadgets, productivity gear, and accessories from eBay & AliExpress.",
		category: "Web Search",
		icon: "🛒",
	},
	{
		id: "7",
		name: "Savvy Trader AI",
		creator: "savvytrader",
		description: "AI investing assistant for stocks, crypto, and tech funds.",
		category: "Stocks & Finance",
		icon: "💹",
	},
	{
		id: "8",
		name: "Search1API",
		creator: "fatwang2",
		description:
			"Aggregated search across niche technical and business sources.",
		category: "Web Search",
		icon: "🔍",
	},
];

export const aiModels: DataTypes[] = [
	{
		id: "dall-e-3",
		name: "DALL-E 3",
		creator: "OpenAI",
		description:
			"Advanced AI image generation model capable of producing high-quality, creative pictures from text prompts.",
		category: "Image Generation",
		icon: "https://cdn.activepieces.com/pieces/openai.png",
		gradient:
			"linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
		date: "2024-05-15",
	},
	{
		id: "dall-e-2",
		name: "DALL-E 2",
		creator: "OpenAI",
		description:
			"Second generation of OpenAI's image generation model, known for creative visuals.",
		category: "Image Generation",
		icon: "https://cdn.activepieces.com/pieces/openai.png",
		gradient: "linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)",
		date: "2023-03-01",
	},
	{
		id: "sdxl-lightning-4step",
		name: "SDXL Lightning 4-Step",
		creator: "Bytedance via Replicate",
		description:
			"Ultra-fast diffusion-based image synthesis model, optimized for quick results.",
		category: "Image Generation",
		icon: "https://cdn.activepieces.com/pieces/replicate.png",
		gradient: "linear-gradient(135deg, var(--chart-1) 0%, var(--chart-2) 100%)",
		date: "2024-04-10",
	},
	{
		id: "stable-diffusion",
		name: "Stable Diffusion",
		creator: "Stability AI via Replicate",
		description:
			"Open-source diffusion model for generating images from natural language descriptions.",
		category: "Image Generation",
		icon: "https://cdn.activepieces.com/pieces/replicate.png",
		gradient: "linear-gradient(135deg, var(--chart-3) 0%, var(--chart-4) 100%)",
		date: "2023-10-18",
	},
	{
		id: "flux-schnell",
		name: "Flux Schnell",
		creator: "Black Forest Labs via Replicate",
		description:
			"Fast and flexible model for creative image generation, available on Replicate.",
		category: "Image Generation",
		icon: "https://cdn.activepieces.com/pieces/replicate.png",
		gradient:
			"linear-gradient(135deg, var(--destructive) 0%, var(--primary) 100%)",
		date: "2024-01-22",
	},
];

export const softwareTools: DataTypes[] = [
	// DevOps & Infrastructure
	{
		id: "sw-1",
		name: "InfraDesk",
		creator: "StackOps",
		description:
			"Manage cloud infrastructure, logs, and server metrics through a unified self-hosted dashboard.",
		category: "DevOps & Infrastructure",
		subcategory: "Infrastructure Management",
		useCase: "Cloud Infrastructure Monitoring",
		icon: "🛠️",
		gradient:
			"linear-gradient(135deg, var(--gray-500) 0%, var(--zinc-700) 100%)",
		date: "2025-02-20",
		tags: ["infrastructure", "monitoring", "cloud", "dashboard"],
	},
	{
		id: "sw-2",
		name: "AutoDoc AI",
		creator: "DocsifyAI",
		description:
			"Automatically generates documentation for APIs, SDKs, and codebases using AI.",
		category: "Developer Tools",
		subcategory: "Documentation",
		useCase: "API Documentation",
		icon: "📄",
		gradient:
			"linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)",
		date: "2025-03-05",
		tags: ["documentation", "ai", "api", "automation"],
	},
	{
		id: "sw-3",
		name: "StackInsights",
		creator: "EngageAnalytics",
		description:
			"Developer team analytics tool for tracking PR velocity, bottlenecks, and engineering health.",
		category: "Analytics & Monitoring",
		subcategory: "Team Analytics",
		useCase: "Development Team Performance",
		icon: "📈",
		gradient:
			"linear-gradient(135deg, var(--green-400) 0%, var(--emerald-500) 100%)",
		date: "2025-04-12",
		tags: ["analytics", "team-performance", "metrics", "development"],
	},
	// More DevOps & Infrastructure
	{
		id: "sw-4",
		name: "ContainerOps",
		creator: "CloudNative",
		description:
			"Kubernetes and Docker container orchestration platform with auto-scaling and deployment automation.",
		category: "DevOps & Infrastructure",
		subcategory: "Container Management",
		useCase: "Container Orchestration",
		icon: "🐳",
		gradient:
			"linear-gradient(135deg, var(--blue-600) 0%, var(--indigo-700) 100%)",
		date: "2025-03-15",
		tags: ["kubernetes", "docker", "containers", "orchestration"],
	},
	{
		id: "sw-5",
		name: "ServerGuard",
		creator: "SecureOps",
		description:
			"Real-time server security monitoring with threat detection and automated response capabilities.",
		category: "DevOps & Infrastructure",
		subcategory: "Security",
		useCase: "Server Security Monitoring",
		icon: "🛡️",
		gradient: "linear-gradient(135deg, var(--red-500) 0%, var(--red-700) 100%)",
		date: "2025-04-01",
		tags: ["security", "monitoring", "threat-detection", "server"],
	},
	// Analytics & Monitoring
	{
		id: "sw-6",
		name: "UserFlow Analytics",
		creator: "FlowTech",
		description:
			"Advanced user behavior analytics with heatmaps, session recordings, and conversion funnels.",
		category: "Analytics & Monitoring",
		subcategory: "User Analytics",
		useCase: "User Behavior Tracking",
		icon: "📊",
		gradient:
			"linear-gradient(135deg, var(--purple-500) 0%, var(--purple-700) 100%)",
		date: "2025-03-20",
		tags: ["analytics", "user-behavior", "heatmaps", "conversion"],
	},
	{
		id: "sw-7",
		name: "APIWatch",
		creator: "MonitorTech",
		description:
			"Comprehensive API monitoring and testing platform with uptime tracking and performance alerts.",
		category: "Analytics & Monitoring",
		subcategory: "API Monitoring",
		useCase: "API Performance Monitoring",
		icon: "⚡",
		gradient:
			"linear-gradient(135deg, var(--yellow-500) 0%, var(--orange-600) 100%)",
		date: "2025-02-28",
		tags: ["api", "monitoring", "uptime", "performance"],
	},
	// Developer Tools
	{
		id: "sw-8",
		name: "CodeReview AI",
		creator: "DevAssist",
		description:
			"AI-powered code review assistant that identifies bugs, security issues, and suggests improvements.",
		category: "Developer Tools",
		subcategory: "Code Quality",
		useCase: "Automated Code Review",
		icon: "🔍",
		gradient:
			"linear-gradient(135deg, var(--teal-500) 0%, var(--cyan-600) 100%)",
		date: "2025-04-05",
		tags: ["code-review", "ai", "security", "quality"],
	},
	{
		id: "sw-9",
		name: "TestCraft",
		creator: "QualityFirst",
		description:
			"Automated testing suite with AI-generated test cases and cross-browser compatibility testing.",
		category: "Developer Tools",
		subcategory: "Testing",
		useCase: "Automated Testing",
		icon: "🧪",
		gradient:
			"linear-gradient(135deg, var(--emerald-500) 0%, var(--teal-600) 100%)",
		date: "2025-03-25",
		tags: ["testing", "automation", "ai", "browser-testing"],
	},
	// Design & Creativity
	{
		id: "sw-10",
		name: "UIForge",
		creator: "DesignLabs",
		description:
			"AI-powered UI component generator that creates React/Vue components from design mockups.",
		category: "Design & Creativity",
		subcategory: "UI Generation",
		useCase: "Component Generation",
		icon: "🎨",
		gradient:
			"linear-gradient(135deg, var(--pink-500) 0%, var(--rose-600) 100%)",
		date: "2025-04-10",
		tags: ["ui", "design", "ai", "components"],
	},
	{
		id: "sw-11",
		name: "BrandKit AI",
		creator: "CreativeStudio",
		description:
			"Complete brand identity generator with logos, color palettes, and marketing materials.",
		category: "Design & Creativity",
		subcategory: "Brand Design",
		useCase: "Brand Identity Creation",
		icon: "🏷️",
		gradient:
			"linear-gradient(135deg, var(--violet-500) 0%, var(--purple-600) 100%)",
		date: "2025-03-30",
		tags: ["branding", "design", "ai", "identity"],
	},
	// Business & Productivity
	{
		id: "sw-12",
		name: "WorkflowMaster",
		creator: "ProductiveTech",
		description:
			"Business process automation platform with drag-and-drop workflow builder and integrations.",
		category: "Business & Productivity",
		subcategory: "Workflow Automation",
		useCase: "Business Process Automation",
		icon: "⚙️",
		gradient:
			"linear-gradient(135deg, var(--slate-500) 0%, var(--slate-700) 100%)",
		date: "2025-02-15",
		tags: ["workflow", "automation", "business", "productivity"],
	},
	{
		id: "sw-13",
		name: "InvoiceAI",
		creator: "FinanceFlow",
		description:
			"Automated invoicing and billing system with AI-powered expense tracking and financial reporting.",
		category: "Business & Productivity",
		subcategory: "Finance Management",
		useCase: "Invoice Automation",
		icon: "💰",
		gradient:
			"linear-gradient(135deg, var(--green-600) 0%, var(--emerald-700) 100%)",
		date: "2025-04-20",
		tags: ["invoicing", "finance", "automation", "reporting"],
	},
];

export const siteTemplates: DataTypes[] = [
	// Landing Pages & Marketing
	{
		id: "tpl-1",
		name: "SaaS Pro Landing",
		creator: "NextStart",
		description:
			"Responsive SaaS product site with pricing, blog, and signup CTA — built with Next.js and Tailwind.",
		category: "Landing Pages & Marketing",
		subcategory: "SaaS Landing",
		useCase: "Product Launch",
		icon: "🧩",
		gradient:
			"linear-gradient(135deg, var(--pink-500) 0%, var(--rose-600) 100%)",
		date: "2025-03-10",
		tags: ["saas", "landing-page", "nextjs", "tailwind"],
	},
	{
		id: "tpl-2",
		name: "Startup Pitch Deck",
		creator: "PitchCraft",
		description:
			"Modern investor-ready pitch deck template with financial projections and market analysis slides.",
		category: "Landing Pages & Marketing",
		subcategory: "Pitch Deck",
		useCase: "Fundraising",
		icon: "📈",
		gradient:
			"linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)",
		date: "2025-03-22",
		tags: ["pitch-deck", "investors", "startup", "presentation"],
	},
	{
		id: "tpl-3",
		name: "E-commerce Storefront",
		creator: "ShopTemplate",
		description:
			"Complete e-commerce template with product catalog, shopping cart, and checkout flow.",
		category: "E-commerce & Retail",
		subcategory: "Storefront",
		useCase: "Online Store",
		icon: "🛒",
		gradient:
			"linear-gradient(135deg, var(--green-500) 0%, var(--emerald-600) 100%)",
		date: "2025-04-01",
		tags: ["ecommerce", "shop", "products", "payments"],
	},
	// Portfolio & Personal
	{
		id: "tpl-4",
		name: "Founder Portfolio",
		creator: "DevPort",
		description:
			"Personal branding site for developers and founders, with project sections, blog, and MDX support.",
		category: "Portfolio & Personal",
		subcategory: "Developer Portfolio",
		useCase: "Personal Branding",
		icon: "👤",
		gradient:
			"linear-gradient(135deg, var(--indigo-500) 0%, var(--violet-600) 100%)",
		date: "2025-02-22",
		tags: ["portfolio", "personal", "developer", "blog"],
	},
	{
		id: "tpl-5",
		name: "Creative Agency Portfolio",
		creator: "CreativeDesign",
		description:
			"Stunning portfolio template for design agencies with animated galleries and client testimonials.",
		category: "Portfolio & Personal",
		subcategory: "Agency Portfolio",
		useCase: "Creative Showcase",
		icon: "🎨",
		gradient:
			"linear-gradient(135deg, var(--purple-500) 0%, var(--pink-600) 100%)",
		date: "2025-03-18",
		tags: ["agency", "creative", "portfolio", "design"],
	},
	// Admin & Dashboard
	{
		id: "tpl-6",
		name: "Admin Dashboard X",
		creator: "UIForge",
		description:
			"Prebuilt admin dashboard template with charts, auth pages, tables, and settings UI.",
		category: "Admin & Dashboard",
		subcategory: "Admin Panel",
		useCase: "Internal Tools",
		icon: "📊",
		gradient:
			"linear-gradient(135deg, var(--sky-500) 0%, var(--blue-600) 100%)",
		date: "2025-04-08",
		tags: ["dashboard", "admin", "charts", "tables"],
	},
	{
		id: "tpl-7",
		name: "Analytics Dashboard",
		creator: "DataViz",
		description:
			"Professional analytics dashboard with real-time charts, KPI widgets, and data visualization.",
		category: "Admin & Dashboard",
		subcategory: "Analytics",
		useCase: "Data Visualization",
		icon: "📈",
		gradient:
			"linear-gradient(135deg, var(--teal-500) 0%, var(--cyan-600) 100%)",
		date: "2025-03-28",
		tags: ["analytics", "charts", "data", "visualization"],
	},
	// Blog & Content
	{
		id: "tpl-8",
		name: "Tech Blog Template",
		creator: "BlogCraft",
		description:
			"Modern blog template optimized for technical content with syntax highlighting and SEO features.",
		category: "Blog & Content",
		subcategory: "Tech Blog",
		useCase: "Technical Writing",
		icon: "📝",
		gradient:
			"linear-gradient(135deg, var(--orange-500) 0%, var(--red-600) 100%)",
		date: "2025-02-25",
		tags: ["blog", "technical", "writing", "seo"],
	},
	{
		id: "tpl-9",
		name: "Documentation Site",
		creator: "DocBuilder",
		description:
			"Comprehensive documentation template with search, navigation, and API reference sections.",
		category: "Blog & Content",
		subcategory: "Documentation",
		useCase: "Product Documentation",
		icon: "📚",
		gradient:
			"linear-gradient(135deg, var(--slate-500) 0%, var(--gray-600) 100%)",
		date: "2025-04-15",
		tags: ["documentation", "api", "reference", "guides"],
	},
	// E-commerce & Retail
	{
		id: "tpl-10",
		name: "Marketplace Platform",
		creator: "MarketBuilder",
		description:
			"Multi-vendor marketplace template with seller dashboard, payment processing, and order management.",
		category: "E-commerce & Retail",
		subcategory: "Marketplace",
		useCase: "Multi-vendor Platform",
		icon: "🏪",
		gradient:
			"linear-gradient(135deg, var(--violet-500) 0%, var(--purple-700) 100%)",
		date: "2025-03-12",
		tags: ["marketplace", "vendors", "ecommerce", "platform"],
	},
	{
		id: "tpl-11",
		name: "Subscription Box Store",
		creator: "SubBoxTemplate",
		description:
			"Subscription-based e-commerce template with recurring billing and customer management.",
		category: "E-commerce & Retail",
		subcategory: "Subscription",
		useCase: "Subscription Business",
		icon: "📦",
		gradient:
			"linear-gradient(135deg, var(--emerald-500) 0%, var(--teal-600) 100%)",
		date: "2025-04-05",
		tags: ["subscription", "recurring", "billing", "boxes"],
	},
	// Business & Corporate
	{
		id: "tpl-12",
		name: "Corporate Website",
		creator: "CorpTemplate",
		description:
			"Professional corporate website with services pages, team sections, and contact forms.",
		category: "Business & Corporate",
		subcategory: "Corporate Site",
		useCase: "Company Website",
		icon: "🏢",
		gradient:
			"linear-gradient(135deg, var(--gray-600) 0%, var(--slate-700) 100%)",
		date: "2025-02-18",
		tags: ["corporate", "business", "professional", "services"],
	},
	{
		id: "tpl-13",
		name: "Consulting Firm Template",
		creator: "ConsultPro",
		description:
			"Elegant template for consulting firms with case studies, expertise areas, and client portals.",
		category: "Business & Corporate",
		subcategory: "Consulting",
		useCase: "Professional Services",
		icon: "💼",
		gradient:
			"linear-gradient(135deg, var(--blue-600) 0%, var(--indigo-700) 100%)",
		date: "2025-03-08",
		tags: ["consulting", "professional", "services", "case-studies"],
	},
];

export const homeMarketplaceItems: HomeMarketplaceItem[] = [
	{
		id: "coinmarketcap-mcp",
		title: "CoinMarketCap Analytics",
		description:
			"Access comprehensive cryptocurrency market data from CoinMarketCap including live prices, market cap rankings, volume data, and detailed coin analytics for informed investment decisions.",
		category: "Finance",
		icon: "💎",
		gradient:
			"linear-gradient(135deg, var(--blue-600) 0%, var(--purple-600) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "shinzo-labs",
		mcp_url: `https://server.smithery.ai/@shinzo-labs/coinmarketcap-mcp/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA`,
		systemPrompt: `Use this to access CoinMarketCap data for comprehensive crypto market analysis. Get live prices, market cap rankings, trading volumes, and detailed cryptocurrency information. Present data as market overviews, top coin rankings, or specific coin analysis with key metrics and trends.`,
		useCases: ["Prices", "Ranking", "Volume", "Metrics", "Trends"],
	},
	{
		id: "web3-research-mcp",
		title: "Web3 Research Tool",
		description:
			"Research blockchain and DeFi projects with ease. Get comprehensive insights, analyze protocols, and stay updated with the latest Web3 trends.",
		category: "Finance",
		icon: "🔬",
		gradient:
			"linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "aaronjmars",
		useCases: ["Research", "Search", "Analyze", "Summarize", "Trends"],
		mcp_url:
			"https://server.smithery.ai/@aaronjmars/web3-research-mcp/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this toolset to perform blockchain and DeFi research. Start by calling "create-research-plan" with a topic, use "search" or "research-with-keywords" to gather insights, and "fetch-content" to extract article or source content. Present results as a structured plan or content digest.`,
	},
	{
		id: "scry-mcp-raw-js",
		title: "Scry Blockchain Analytics",
		description:
			"Advanced DeFi analytics platform providing insights into protocol performance, liquidity data, yield farming opportunities, and market trends.",
		category: "Finance",
		icon: "🔮",
		gradient:
			"linear-gradient(135deg, var(--violet-500) 0%, var(--purple-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "yongkangc",
		mcp_url:
			"https://server.smithery.ai/@yongkangc/scry-mcp-raw-js/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this for advanced DeFi and protocol analytics. Query "get_top_protocols" or "defillama_search_protocols" for TVL data. Use "get_dex_volume" and "get_derivatives_volume" for liquidity stats. Display results as ecosystem rankings or protocol cards.`,
		useCases: ["TVL", "Protocols", "Liquidity", "Volume", "Yields"],
	},
	{
		id: "binance-mcp-data",
		title: "Binance Market Data",
		description:
			"Access real-time Binance trading data including live prices, market trends, order books, and trading volume for informed investment decisions.",
		category: "Finance",
		icon: "💹",
		gradient:
			"linear-gradient(135deg, var(--yellow-500) 0%, var(--yellow-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "snjyor",
		useCases: ["Live Prices", "Trends", "Order Book", "Volume", "Charts"],
		mcp_url:
			"https://server.smithery.ai/@snjyor/binance-mcp-data/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this to retrieve Binance market data. For live prices use "get_price" or "get_24hr_ticker", historical candles via "get_klines", or trades through "get_recent_trades". Present output as charts, summaries, or raw metrics based on user intent.`,
	},
	{
		id: "mcp-server-ccxt",
		title: "CCXT Trading Exchange",
		description:
			"Connect to 100+ crypto exchanges in one place. Compare prices, check balances, and manage your trading across multiple platforms seamlessly.",
		category: "Finance",
		icon: "🏦",
		gradient:
			"linear-gradient(135deg, var(--green-500) 0%, var(--green-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "doggybee",
		mcp_url:
			"https://server.smithery.ai/@doggybee/mcp-server-ccxt/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this to access exchange market data and trading actions. Use "get-ticker" for price info, "get-orderbook" for depth, and "place-market-order" to simulate trades. Structure outputs as exchange summaries or actionable trade data.`,
		useCases: ["Compare", "Balances", "Trading", "Order Book", "Exchanges"],
	},
	{
		id: "mcp-crypto-price",
		title: "Crypto Price Tracker",
		description:
			"Track cryptocurrency prices in real-time with detailed market analysis, historical data, and price alerts for your favorite coins.",
		category: "Finance",
		icon: "📈",
		gradient:
			"linear-gradient(135deg, var(--purple-500) 0%, var(--purple-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "truss44",
		mcp_url:
			"https://server.smithery.ai/@truss44/mcp-crypto-price/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this for real-time price and market analysis. "get-crypto-price" gives current stats, "get-market-analysis" reveals exchange trends, and "get-historical-analysis" offers long-term insights. Display as tables, charts, or alerts.`,
		useCases: ["Tracking", "History", "Alerts", "Analysis", "Charts"],
	},
	{
		id: "crypto-indicators-mcp",
		title: "Crypto Technical Indicators",
		description:
			"Analyze crypto trends with professional trading indicators like RSI, MACD, and Bollinger Bands. Make smarter trading decisions with technical analysis.",
		category: "Finance",
		icon: "📊",
		gradient:
			"linear-gradient(135deg, var(--indigo-500) 0%, var(--indigo-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "kukapay",
		mcp_url:
			"https://server.smithery.ai/@kukapay/crypto-indicators-mcp/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this to compute technical indicators. Choose from tools like "calculate_macd", "calculate_rsi", or "calculate_sma". Pass the symbol and timeframe to visualize momentum or trend shifts. Return clean indicator values or formatted indicator dashboards.`,
		useCases: ["Indicators", "RSI", "MACD", "Trends", "Dashboards"],
	},
	{
		id: "web3-mcp-server",
		title: "Web3 Blockchain Server",
		description:
			"Interact with blockchain networks and smart contracts. Check wallet balances, read contract data, and monitor token holdings across EVM chains.",
		category: "Finance",
		icon: "⛓️",
		gradient:
			"linear-gradient(135deg, var(--cyan-500) 0%, var(--cyan-700) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "EmanuelJr",
		mcp_url:
			"https://server.smithery.ai/@EmanuelJr/web3-mcp-server/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `For Web3 smart contract operations. Use "fetch_balance" for ETH wallet balances, "read_contract" for reading contract state, and "fetch_token_balance" for ERC20 tokens. Return concise wallet overviews or contract values.`,
		useCases: ["Wallets", "Contracts", "Balances", "Tokens", "Monitoring"],
	},
	{
		id: "crypto-feargreed-mcp",
		title: "Crypto Fear & Greed Index",
		description:
			"Track market sentiment with the Fear & Greed Index. Analyze emotions driving the crypto market and make informed decisions based on crowd psychology.",
		category: "Finance",
		icon: "😨",
		gradient:
			"linear-gradient(135deg, var(--red-500) 0%, var(--green-500) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "kukapay",
		mcp_url:
			"https://server.smithery.ai/@kukapay/crypto-feargreed-mcp/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this to access the Fear & Greed Index for crypto market sentiment analysis. The index ranges from 0 (Extreme Fear) to 100 (Extreme Greed) and helps identify market turning points. Present the data with historical context and interpretation for trading decisions.`,
		useCases: ["Sentiment", "Trends", "Signals", "Psychology", "History"],
	},
	{
		id: "amazon-product-search",
		title: "Amazon Product Search",
		description:
			"Search and analyze Amazon products with detailed information including prices, ratings, reviews, and availability. Perfect for market research and product discovery.",
		category: "Shopping",
		icon: "🛒",
		gradient:
			"linear-gradient(135deg, var(--orange-500) 0%, var(--yellow-600) 100%)",
		date: "2025-01-20",
		type: "plugin",
		creator: "SiliconValleyInsight",
		mcp_url:
			"https://server.smithery.ai/@SiliconValleyInsight/amazon-product-search/mcp?api_key=ac388943-d4dc-49f3-bf9a-cbfc2895168a&profile=voiceless-bug-rDbLmA",
		systemPrompt: `Use this to search Amazon products and gather detailed product information. You can search by keywords, get product details, prices, ratings, and reviews. Present results as organized product listings with key details like price, rating, and availability for easy comparison.`,
		useCases: ["Search", "Compare", "Ratings", "Reviews", "Research"],
	},
];
