import type { MCPDataTypes } from "@/lib/types";
import { type NextRequest, NextResponse } from "next/server";

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
};

function extractCreatorFromUrl(url: string): string {
	try {
		// Extract GitHub username from URL
		const match = url.match(/github\.com\/([^\/]+)/);
		return match ? match[1] : "Unknown";
	} catch {
		return "Unknown";
	}
}

function getCategoryIcon(
	category: string,
	name: string,
	description: string
): string {
	const searchText = `${category} ${name} ${description}`.toLowerCase();

	// Check for exact category matches first
	const categoryKey = category.toLowerCase();
	if (CATEGORY_ICONS[categoryKey]) {
		return CATEGORY_ICONS[categoryKey];
	}

	// Check for keyword matches in the combined text
	for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
		if (searchText.includes(keyword)) {
			return icon;
		}
	}

	// Default icon
	return "🔧";
}

function generateId(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

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

function parseServers(markdown: string): MCPDataTypes[] {
	const categoryRegex = /###\s+([^\n]+)\n\n([\s\S]*?)(?=\n###|$)/g;
	const serverLineRegex = /^- \[([^\]]+)\]\(([^)]+)\)\s*([^-\n]*)(.*)$/gm;

	const servers: MCPDataTypes[] = [];

	categoryRegex.lastIndex = 0; // Reset regex state

	for (
		let categoryMatch = categoryRegex.exec(markdown);
		categoryMatch !== null;
		categoryMatch = categoryRegex.exec(markdown)
	) {
		const categoryRaw = categoryMatch[1].trim();

		// Remove HTML anchor tags and extract just the text content
		const anchorMatch = categoryRaw.match(/<a[^>]*><\/a>(.+)$/);
		const category = anchorMatch ? anchorMatch[1].trim() : categoryRaw;

		const block = categoryMatch[2];
		serverLineRegex.lastIndex = 0; // Reset regex state

		for (
			let serverMatch = serverLineRegex.exec(block);
			serverMatch !== null;
			serverMatch = serverLineRegex.exec(block)
		) {
			const name = serverMatch[1];
			const url = serverMatch[2];
			const description = (serverMatch[3] + (serverMatch[4] || ""))
				.replace(/^\s*-\s*/, "")
				.trim();

			const legendInfo = extractLegendInfo(serverMatch[0]);
			const creator = extractCreatorFromUrl(url);
			const icon = getCategoryIcon(category, name, description);
			const id = generateId(name);

			servers.push({
				id,
				name,
				creator,
				description,
				category,
				icon,
				url,
				...legendInfo,
			});
		}
	}

	return servers;
}

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const page = Number(searchParams.get("page") || 1);
	const pageSize = Number(searchParams.get("pageSize") || 20);
	const category = searchParams.get("category");
	const search = searchParams.get("search");

	try {
		const readme = await (await fetch(GITHUB_RAW_URL)).text();
		let servers = parseServers(readme);

		// Apply search filter
		if (search) {
			const searchLower = search.toLowerCase();
			servers = servers.filter(
				(srv) =>
					srv.name.toLowerCase().includes(searchLower) ||
					srv.description.toLowerCase().includes(searchLower) ||
					srv.category.toLowerCase().includes(searchLower)
			);
		}

		// Apply category filter
		if (category) {
			servers = servers.filter(
				(srv) => srv.category.toLowerCase() === category.toLowerCase()
			);
		}

		const total = servers.length;
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const paged = servers.slice(start, end);

		return NextResponse.json({
			page,
			pageSize,
			total,
			category: category || null,
			search: search || null,
			servers: paged,
		});
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
