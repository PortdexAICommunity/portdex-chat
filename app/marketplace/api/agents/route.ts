import type { DataTypes } from "@/lib/types";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";

const GITHUB_RAW_URL =
	"https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md";

const LEGEND = {
	official: { "🎖️": true },
	languages: {
		"🐍": "Python",
		"📇": "TypeScript/JavaScript",
		"🏎️": "Go",
		"🦀": "Rust",
		"#️⃣": "C#",
		"☕": "Java",
		"🌊": "C/C++",
	},
	scope: {
		"☁️": "Cloud",
		"🏠": "Local",
		"📟": "Embedded",
	},
	operating_systems: {
		"🍎": "macOS",
		"🪟": "Windows",
		"🐧": "Linux",
	},
};

// Icon mapping based on categories and keywords
const CATEGORY_ICONS: Record<string, string> = {
	// Development & Code
	development: "💻",
	code: "💻",
	programming: "💻",
	git: "🔀",
	github: "🐙",
	"version control": "🔀",

	// Data & Databases
	database: "🗄️",
	data: "📊",
	sql: "🗄️",
	analytics: "📈",
	search: "🔍",
	elasticsearch: "🔍",

	// Web & API
	web: "🌐",
	api: "🔌",
	http: "🌐",
	rest: "🔌",
	graphql: "📊",
	webhook: "⚡",

	// Cloud & Infrastructure
	cloud: "☁️",
	aws: "☁️",
	azure: "☁️",
	gcp: "☁️",
	docker: "🐳",
	kubernetes: "⚓",
	infrastructure: "🏗️",

	// Communication & Social
	chat: "💬",
	slack: "💬",
	discord: "🎮",
	telegram: "📱",
	email: "📧",
	notification: "🔔",

	// Content & Media
	content: "📝",
	cms: "📝",
	blog: "📰",
	news: "📰",
	media: "🎬",
	image: "🖼️",
	video: "🎥",

	// Finance & Business
	finance: "💰",
	trading: "📈",
	crypto: "₿",
	business: "🏢",
	crm: "🏢",
	sales: "💼",

	// Utilities & Tools
	utility: "🔧",
	tool: "🔧",
	automation: "⚙️",
	monitor: "📊",
	logging: "📝",
	security: "🔒",
	auth: "🔐",

	// AI & ML
	ai: "🤖",
	ml: "🤖",
	"machine learning": "🤖",
	nlp: "🗣️",
	openai: "🤖",
	anthropic: "🤖",

	// File & Storage
	file: "📁",
	storage: "💾",
	backup: "💾",
	sync: "🔄",

	// Time & Scheduling
	calendar: "📅",
	time: "⏰",
	schedule: "📅",
	cron: "⏰",

	// Weather & Location
	weather: "🌤️",
	location: "📍",
	maps: "🗺️",

	// Default fallbacks
	server: "🖥️",
	service: "⚙️",
	app: "📱",
};

// Language-specific icons
const LANGUAGE_ICONS: Record<string, string> = {
	Python: "🐍",
	"TypeScript/JavaScript": "📇",
	Go: "🏎️",
	Rust: "🦀",
	"C#": "#️⃣",
	Java: "☕",
	"C/C++": "🌊",
};

function extractLegendInfo(str: string) {
	let official = false;
	const languages: string[] = [];
	const scope: string[] = [];
	const operating_systems: string[] = [];

	for (const [icon, val] of Object.entries(LEGEND.official)) {
		if (str.includes(icon)) official = val;
	}
	for (const [icon, name] of Object.entries(LEGEND.languages)) {
		if (str.includes(icon)) languages.push(name);
	}
	for (const [icon, name] of Object.entries(LEGEND.scope)) {
		if (str.includes(icon)) scope.push(name);
	}
	for (const [icon, name] of Object.entries(LEGEND.operating_systems)) {
		if (str.includes(icon)) operating_systems.push(name);
	}

	return { official, languages, scope, operating_systems };
}

function getIconForServer(server: {
	name: string;
	description: string;
	category: string;
	languages: string[];
	official: boolean;
}) {
	const { name, description, category, languages, official } = server;

	// If it's official, use the official badge emoji
	if (official) {
		return "🎖️";
	}

	// Check for language-specific icons first (most specific)
	if (languages.length > 0) {
		const primaryLanguage = languages[0];
		if (LANGUAGE_ICONS[primaryLanguage]) {
			return LANGUAGE_ICONS[primaryLanguage];
		}
	}

	// Create a searchable text combining name, description, and category
	const searchText = `${name} ${description} ${category}`.toLowerCase();

	// Check for category/keyword matches (order matters - more specific first)
	const keywords = Object.keys(CATEGORY_ICONS).sort(
		(a, b) => b.length - a.length
	);

	for (const keyword of keywords) {
		if (searchText.includes(keyword.toLowerCase())) {
			return CATEGORY_ICONS[keyword];
		}
	}

	// Fallback to a default server icon
	return "🖥️";
}

function parseServers(markdown: string) {
	const categoryRegex = /###\s+([^\n]+)\n\n([\s\S]*?)(?=\n###|$)/g;
	const serverLineRegex = /^- \[([^\]]+)\]\(([^)]+)\)\s*([^-\n]*)(.*)$/gm;

	const servers = [];
	let categoryMatch: RegExpExecArray | null = null;

	while (true) {
		categoryMatch = categoryRegex.exec(markdown);
		if (categoryMatch === null) break;

		const categoryRaw = categoryMatch[1].trim();
		const anchorMatch = categoryRaw.match(/<a[^>]*><\/a>(.+)$/);
		const category = anchorMatch ? anchorMatch[1].trim() : categoryRaw;

		const block = categoryMatch[2];
		let serverMatch: RegExpExecArray | null = null;

		serverLineRegex.lastIndex = 0;

		while (true) {
			serverMatch = serverLineRegex.exec(block);
			if (serverMatch === null) break;

			const name = serverMatch[1];
			const url = serverMatch[2];
			const description = (serverMatch[3] + (serverMatch[4] || ""))
				.replace(/^\s*-\s*/, "")
				.trim();
			const legendInfo = extractLegendInfo(serverMatch[0]);

			servers.push({
				name,
				url,
				description,
				...legendInfo,
				category,
			});
		}
	}

	return servers;
}

// Function to get category from agent name and tags
function getAgentCategory(name: string, tags: any[]): string {
	const nameUpper = name.toUpperCase();

	// Check tags first
	if (tags && tags.length > 0) {
		const tagNames = tags.map((tag) => tag.name?.toLowerCase() || "").join(" ");
		if (tagNames.includes("social")) return "Social Media";
		if (tagNames.includes("content")) return "Content Creation";
		if (tagNames.includes("marketing")) return "Marketing";
		if (tagNames.includes("tutorial")) return "Education";
	}

	// Categorize based on name keywords
	if (
		nameUpper.includes("JOB") ||
		nameUpper.includes("CAREER") ||
		nameUpper.includes("HIRING")
	) {
		return "HR & Recruitment";
	}
	if (
		nameUpper.includes("LEAD") ||
		nameUpper.includes("SALES") ||
		nameUpper.includes("CRM")
	) {
		return "Sales & Marketing";
	}
	if (
		nameUpper.includes("EMAIL") ||
		nameUpper.includes("GMAIL") ||
		nameUpper.includes("MAIL")
	) {
		return "Communication";
	}
	if (
		nameUpper.includes("SOCIAL") ||
		nameUpper.includes("LINKEDIN") ||
		nameUpper.includes("TWITTER")
	) {
		return "Social Media";
	}
	if (
		nameUpper.includes("CONTENT") ||
		nameUpper.includes("BLOG") ||
		nameUpper.includes("WRITE")
	) {
		return "Content Creation";
	}
	if (
		nameUpper.includes("DATA") ||
		nameUpper.includes("ANALYZE") ||
		nameUpper.includes("REPORT")
	) {
		return "Data & Analytics";
	}
	if (
		nameUpper.includes("SHEET") ||
		nameUpper.includes("EXCEL") ||
		nameUpper.includes("DOCUMENT")
	) {
		return "Document Management";
	}
	if (
		nameUpper.includes("CHAT") ||
		nameUpper.includes("SUPPORT") ||
		nameUpper.includes("CUSTOMER")
	) {
		return "Customer Support";
	}
	if (
		nameUpper.includes("AUTOMATION") ||
		nameUpper.includes("WORKFLOW") ||
		nameUpper.includes("PROCESS")
	) {
		return "Process Automation";
	}
	if (
		nameUpper.includes("AI") ||
		nameUpper.includes("AGENT") ||
		nameUpper.includes("GPT") ||
		nameUpper.includes("ASSISTANT")
	) {
		return "AI & Machine Learning";
	}
	if (
		nameUpper.includes("SCRAPE") ||
		nameUpper.includes("FETCH") ||
		nameUpper.includes("RSS")
	) {
		return "Data Collection";
	}

	return "General Automation";
}

// Function to generate description from agent name and purpose
function getAgentDescription(name: string, tags: any[]): string {
	const baseDesc = `AI-powered automation workflow for ${name
		.toLowerCase()
		.replace(/_/g, " ")}`;

	if (tags && tags.length > 0) {
		const tagNames = tags
			.map((tag) => tag.name)
			.filter(Boolean)
			.join(", ");
		return `${baseDesc}. Tags: ${tagNames}`;
	}

	return `${baseDesc}. Streamline your workflow with this automated solution.`;
}

// Cache for scraped agents to avoid re-parsing the large file on every request
let scrapedAgentsCache: DataTypes[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for large file
let isLoading = false;

// Function to load and transform scraped agents with caching
function loadScrapedAgents(): DataTypes[] {
	try {
		// Check if cache is valid
		const now = Date.now();
		if (scrapedAgentsCache && now - cacheTimestamp < CACHE_DURATION) {
			console.log(
				`Using cached scraped agents (${scrapedAgentsCache.length} items)`
			);
			return scrapedAgentsCache;
		}

		// Prevent multiple simultaneous loads of the large file
		if (isLoading) {
			console.log("Already loading scraped agents, returning empty array");
			return [];
		}

		isLoading = true;

		const scrapedDataPath = path.join(process.cwd(), "lib", "scrape-data.json");
		console.log("Checking for scraped data file at:", scrapedDataPath);

		// Check if file exists
		if (!require("fs").existsSync(scrapedDataPath)) {
			console.warn("Scrape data file not found at:", scrapedDataPath);
			isLoading = false;
			return [];
		}

		console.log(
			"Loading large scraped agents file (this may take a moment)..."
		);
		const startTime = Date.now();

		const fileContent = readFileSync(scrapedDataPath, "utf-8");
		console.log(
			`File loaded in ${Date.now() - startTime}ms. Size: ${(
				fileContent.length /
				1024 /
				1024
			).toFixed(2)}MB`
		);

		const parseStartTime = Date.now();
		const scrapedData = JSON.parse(fileContent);
		console.log(`JSON parsed in ${Date.now() - parseStartTime}ms`);

		if (!Array.isArray(scrapedData)) {
			console.error("Scraped data is not an array, type:", typeof scrapedData);
			isLoading = false;
			return [];
		}

		console.log("Raw scraped data length:", scrapedData.length);

		// Filter agents with valid names and transform to DataTypes
		const filterStartTime = Date.now();
		const validAgents = scrapedData.filter(
			(agent: any) =>
				agent &&
				agent.name &&
				agent.name.trim() !== "" &&
				typeof agent.name === "string"
		);

		console.log(
			`Found ${validAgents.length} valid agents out of ${
				scrapedData.length
			} total (filtered in ${Date.now() - filterStartTime}ms)`
		);

		const transformStartTime = Date.now();
		const transformedAgents = validAgents.map((agent: any): DataTypes => {
			const category = getAgentCategory(agent.name, agent.tags || []);
			const description = getAgentDescription(agent.name, agent.tags || []);

			return {
				id:
					agent.id ||
					`scraped-${agent.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
				name: agent.name,
				creator: "n8n Community",
				description,
				category,
				icon: getIconForServer({
					name: agent.name,
					description,
					category,
					languages: [],
					official: false,
				}),
				tags: agent.tags?.map((tag: any) => tag.name).filter(Boolean) || [],
			};
		});

		console.log(
			`Transformed ${transformedAgents.length} agents in ${
				Date.now() - transformStartTime
			}ms`
		);

		// Update cache
		scrapedAgentsCache = transformedAgents;
		cacheTimestamp = now;
		isLoading = false;

		console.log(
			`Successfully cached ${
				transformedAgents.length
			} scraped agents. Total processing time: ${Date.now() - startTime}ms`
		);
		return transformedAgents;
	} catch (error) {
		console.error("Error loading scraped agents:", error);
		isLoading = false;
		// Return empty array on error to prevent API from failing
		return [];
	}
}

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const page = Number(searchParams.get("page") || 1);
	const pageSize = Number(searchParams.get("pageSize") || 20);
	const category = searchParams.get("category");
	const search = searchParams.get("search");

	try {
		// Get GitHub MCP servers
		console.log("Fetching GitHub MCP servers...");
		const readme = await (await fetch(GITHUB_RAW_URL)).text();
		let mcpServers = parseServers(readme);

		const mcpAgents: DataTypes[] = mcpServers.map((item) => ({
			category: item.category,
			creator: item.url,
			description: item.description,
			icon: getIconForServer(item),
			id: item.name,
			name: item.name,
		}));

		console.log(`Loaded ${mcpAgents.length} MCP agents`);

		// Get scraped agents
		console.log("Loading scraped agents...");
		const scrapedAgents = loadScrapedAgents();
		console.log(`Loaded ${scrapedAgents.length} scraped agents`);

		// Combine both data sources
		let allAgents = [...mcpAgents, ...scrapedAgents];
		console.log(`Total combined agents: ${allAgents.length}`);

		// Apply filters
		if (category) {
			allAgents = allAgents.filter(
				(agent) => agent.category.toLowerCase() === category.toLowerCase()
			);
		}

		if (search) {
			const searchLower = search.toLowerCase();
			allAgents = allAgents.filter(
				(agent) =>
					agent.name.toLowerCase().includes(searchLower) ||
					agent.description.toLowerCase().includes(searchLower) ||
					agent.category.toLowerCase().includes(searchLower)
			);
		}

		const total = allAgents.length;
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const paged = allAgents.slice(start, end);

		console.log("Combined agents data:", {
			mcpCount: mcpAgents.length,
			scrapedCount: scrapedAgents.length,
			total,
			pagedCount: paged.length,
		});

		return NextResponse.json({ agents: paged, total });
	} catch (e: any) {
		console.error("Error in agents API:", e);
		return NextResponse.json({ error: e.message, agents: [] }, { status: 500 });
	}
}

type Agent = DataTypes & {
	url?: string;
	author?: string;
	tags?: string[];
};
