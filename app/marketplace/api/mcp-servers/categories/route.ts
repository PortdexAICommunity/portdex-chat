import { NextResponse } from 'next/server';

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md';

function parseCategories(markdown: string) {
  const categoryRegex = /###\s+([^\n]+)\n\n([\s\S]*?)(?=\n###|$)/g;
  const categories = new Set<string>();

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

    if (category) {
      categories.add(category);
    }
  }

  return Array.from(categories).sort();
}

export async function GET() {
  try {
    const readme = await (await fetch(GITHUB_RAW_URL)).text();
    const categories = parseCategories(readme);

    return NextResponse.json({
      categories,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
