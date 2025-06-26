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

function parseServers(markdown: string) {
  const categoryRegex = /###\s+([^\n]+)\n\n([\s\S]*?)(?=\n###|$)/g;
  const serverLineRegex = /^- \[([^\]]+)\]\(([^)]+)\)\s*([^-\n]*)(.*)$/gm;

  const servers: any[] = [];

  let match: RegExpExecArray | null;

  while (categoryRegex.exec(markdown) !== null) {
    match = categoryRegex.exec(markdown);

    if (!match) {
      return;
    }
    const categoryRaw = match[1].trim();

    // Remove HTML anchor tags and extract just the text content
    // Pattern: <a name="something"></a>CategoryName or just CategoryName
    const anchorMatch = categoryRaw.match(/<a[^>]*><\/a>(.+)$/);
    const category = anchorMatch ? anchorMatch[1].trim() : categoryRaw;

    const block = match[2];
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let serverMatch;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((serverMatch = serverLineRegex.exec(block))) {
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
  const search = searchParams.get('search');

  try {
    const readme = await (await fetch(GITHUB_RAW_URL)).text();
    let servers = parseServers(readme);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      servers = servers?.filter(
        (srv) =>
          srv.name.toLowerCase().includes(searchLower) ||
          srv.description.toLowerCase().includes(searchLower) ||
          srv.category.toLowerCase().includes(searchLower),
      );
    }

    // Apply category filter
    if (category) {
      servers = servers?.filter(
        (srv) => srv.category.toLowerCase() === category.toLowerCase(),
      );
    }

    const total = servers?.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paged = servers?.slice(start, end);

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
