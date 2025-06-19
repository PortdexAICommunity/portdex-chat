import type { DataTypes } from '@/lib/types';
import { NextResponse } from 'next/server';

const README_URL =
  'https://raw.githubusercontent.com/lobehub/lobe-chat-agents/main/README.md';

// Regex to extract agent blocks
const AGENT_REGEX =
  /### \[([^\]]+)\]\(([^)]+)\)\n\n<sup>By \*\*\[@([^\]]+)\]\([^)]+\)\*\* on \*\*([\d-]+)\*\*<\/sup>\n\n([^\n]+)\n\n((?:`[^`]+`\s*)+)/g;

export async function GET() {
  const res = await fetch(README_URL);
  const text = await res.text();

  const [, agentsSection] = text.split('## 🕶 Awesome Prompts');
  if (!agentsSection) return NextResponse.json({ agents: [] });

  const agents: DataTypes[] = [];
  let match;
  while ((match = AGENT_REGEX.exec(agentsSection)) !== null) {
    const [, name, url, creator, date, description, tagsRaw] = match;
    const tags =
      tagsRaw.match(/`([^`]+)`/g)?.map((t) => t.replace(/`/g, '')) || [];
    agents.push({
      id: url.split('/').pop() || name, // use URL slug or name as id
      name,
      creator,
      description: description.trim(),
      category: tags[0] || '', // use the first tag as category
      icon: '', // no icon in README, can be filled from elsewhere
      gradient: undefined, // optional, not in README
      date,
    });
  }

  return NextResponse.json({ agents });
}
