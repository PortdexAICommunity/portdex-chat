import type { DataTypes } from '@/lib/types';
import { type NextRequest, NextResponse } from 'next/server';

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md';

const LEGEND = {
  official: { '🎖️': true },
  languages: {
    '🐍': 'Python',
    '📇': 'TypeScript/JavaScript',
    '🏎️': 'Go',
    '🦀': 'Rust',
    '#️⃣': 'C#',
    '☕': 'Java',
    '🌊': 'C/C++',
  },
  scope: {
    '☁️': 'Cloud',
    '🏠': 'Local',
    '📟': 'Embedded',
  },
  operating_systems: {
    '🍎': 'macOS',
    '🪟': 'Windows',
    '🐧': 'Linux',
  },
};

// Icon mapping based on categories and keywords
const CATEGORY_ICONS: Record<string, string> = {
  // Development & Code
  development: '💻',
  code: '💻',
  programming: '💻',
  git: '🔀',
  github: '🐙',
  'version control': '🔀',

  // Data & Databases
  database: '🗄️',
  data: '📊',
  sql: '🗄️',
  analytics: '📈',
  search: '🔍',
  elasticsearch: '🔍',

  // Web & API
  web: '🌐',
  api: '🔌',
  http: '🌐',
  rest: '🔌',
  graphql: '📊',
  webhook: '⚡',

  // Cloud & Infrastructure
  cloud: '☁️',
  aws: '☁️',
  azure: '☁️',
  gcp: '☁️',
  docker: '🐳',
  kubernetes: '⚓',
  infrastructure: '🏗️',

  // Communication & Social
  chat: '💬',
  slack: '💬',
  discord: '🎮',
  telegram: '📱',
  email: '📧',
  notification: '🔔',

  // Content & Media
  content: '📝',
  cms: '📝',
  blog: '📰',
  news: '📰',
  media: '🎬',
  image: '🖼️',
  video: '🎥',

  // Finance & Business
  finance: '💰',
  trading: '📈',
  crypto: '₿',
  business: '🏢',
  crm: '🏢',
  sales: '💼',

  // Utilities & Tools
  utility: '🔧',
  tool: '🔧',
  automation: '⚙️',
  monitor: '📊',
  logging: '📝',
  security: '🔒',
  auth: '🔐',

  // AI & ML
  ai: '🤖',
  ml: '🤖',
  'machine learning': '🤖',
  nlp: '🗣️',
  openai: '🤖',
  anthropic: '🤖',

  // File & Storage
  file: '📁',
  storage: '💾',
  backup: '💾',
  sync: '🔄',

  // Time & Scheduling
  calendar: '📅',
  time: '⏰',
  schedule: '📅',
  cron: '⏰',

  // Weather & Location
  weather: '🌤️',
  location: '📍',
  maps: '🗺️',

  // Default fallbacks
  server: '🖥️',
  service: '⚙️',
  app: '📱',
};

// Language-specific icons
const LANGUAGE_ICONS: Record<string, string> = {
  Python: '🐍',
  'TypeScript/JavaScript': '📇',
  Go: '🏎️',
  Rust: '🦀',
  'C#': '#️⃣',
  Java: '☕',
  'C/C++': '🌊',
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
    return '🎖️';
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
    (a, b) => b.length - a.length,
  );

  for (const keyword of keywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return CATEGORY_ICONS[keyword];
    }
  }

  // Fallback to a default server icon
  return '🖥️';
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
      const description = (serverMatch[3] + (serverMatch[4] || ''))
        .replace(/^\s*-\s*/, '')
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 20);
  const category = searchParams.get('category');

  try {
    const readme = await (await fetch(GITHUB_RAW_URL)).text();
    let servers = parseServers(readme);

    if (!servers || servers.length === 0) {
      console.log('No servers parsed from markdown');
      return NextResponse.json({ agents: [] });
    }

    if (category) {
      servers = servers.filter(
        (srv) => srv.category.toLowerCase() === category.toLowerCase(),
      );
    }

    const total = servers.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paged = servers.slice(start, end);

    console.log('Parsed servers:', { total, pagedCount: paged.length });

    const agents: DataTypes[] = paged.map((item) => ({
      category: item.category,
      creator: item.url,
      description: item.description,
      icon: getIconForServer(item), // Use the intelligent icon assignment
      id: item.name,
      name: item.name,
    }));

    return NextResponse.json({ agents });
  } catch (e: any) {
    console.error('Error in agents API:', e);
    return NextResponse.json({ error: e.message, agents: [] }, { status: 500 });
  }
}

type Agent = DataTypes & {
  url?: string;
  author?: string;
  tags?: string[];
};
