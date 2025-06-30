import type { DataTypes } from "@/lib/types";
import { NextResponse } from "next/server";

const README_URL =
	"https://raw.githubusercontent.com/lobehub/lobe-chat-agents/main/README.md";

// Regex to extract agent blocks
const AGENT_REGEX =
	/### \[([^\]]+)\]\(([^)]+)\)\n\n<sup>By \*\*\[@([^\]]+)\]\([^)]+\)\*\* on \*\*([\d-]+)\*\*<\/sup>\n\n([^\n]+)\n\n((?:`[^`]+`\s*)+)/g;

export async function GET() {
	const res = await fetch(README_URL);
	const text = await res.text();

	const [, agentsSection] = text.split("## 🕶 Awesome Prompts");
	if (!agentsSection) return NextResponse.json({ agents: [] });

	const agents: DataTypes[] = [];
	let match: RegExpExecArray | null = null;
	while (AGENT_REGEX.exec(agentsSection) !== null) {
		match = AGENT_REGEX.exec(agentsSection);
		if (!match) break;
		const [, name, url, creator, date, description, tagsRaw] = match;
		const tags =
			tagsRaw.match(/`([^`]+)`/g)?.map((t) => t.replace(/`/g, "")) || [];

		// Enhance categorization logic
		const category = tags[0] || "General";
		const subcategory = tags[1] || undefined;
		const useCase =
			tags.find(
				(tag) =>
					tag.toLowerCase().includes("assistant") ||
					tag.toLowerCase().includes("helper") ||
					tag.toLowerCase().includes("analysis") ||
					tag.toLowerCase().includes("generation") ||
					tag.toLowerCase().includes("writing") ||
					tag.toLowerCase().includes("coding") ||
					tag.toLowerCase().includes("research")
			) ||
			tags[2] ||
			undefined;

		agents.push({
			id: url.split("/").pop() || name, // use URL slug or name as id
			name,
			creator,
			description: description.trim(),
			category,
			subcategory,
			useCase,
			tags: tags.slice(0, 5), // Include all relevant tags for filtering
			icon: "", // no icon in README, can be filled from elsewhere
			gradient: undefined, // optional, not in README
			date,
		});
	}

	return NextResponse.json({ agents });
}
