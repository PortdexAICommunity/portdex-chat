// app/marketplace/api/db/items/route.ts
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
	const pageSize = Math.min(
		1000,
		Math.max(1, Number(url.searchParams.get("pageSize") ?? 1000))
	);
	const category = url.searchParams.get("category");
	const search = url.searchParams.get("search");
	const tags = url.searchParams.get("tags"); // comma-separated; we will ILIKE each token

	const connectionString = process.env.MARKETPLACE_POSTGRES_URL;
	const tableName = process.env.MARKETPLACE_TABLE ?? "software";
	if (!connectionString) {
		return NextResponse.json(
			{ error: "MARKETPLACE_POSTGRES_URL is not set" },
			{ status: 500 }
		);
	}

	const client = postgres(connectionString, { max: 1 });
	const db = drizzle(client);

	try {
		const offset = (page - 1) * pageSize;

		// Build dynamic WHERE conditions safely using template tags
		const whereClauses: any[] = [];
		if (category) {
			whereClauses.push(client`category = ${category}`);
		}
		if (search) {
			const pattern = `%${search}%`;
			whereClauses.push(
				client`(name ILIKE ${pattern} OR description ILIKE ${pattern} OR category ILIKE ${pattern} OR tags ILIKE ${pattern})`
			);
		}
		if (tags) {
			const tagTokens = tags
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t.length > 0);
			if (tagTokens.length > 0) {
				// Any tag match
				const tagConditions = tagTokens.map((t) => {
					const pattern = `%${t}%`;
					return client`tags ILIKE ${pattern}`;
				});
				// Combine with OR inside parentheses
				whereClauses.push({ or: tagConditions });
			}
		}

		// Helper to render WHERE
		const renderWhere = () => {
			if (whereClauses.length === 0) return client``;
			// Handle custom { or: [...] } blocks
			const parts: any[] = [];
			for (const clause of whereClauses) {
				if (clause && typeof clause === "object" && "or" in clause) {
					const ors = (clause as any).or as any[];
					if (ors.length === 1) parts.push(ors[0]);
					else {
						let orExpr = ors[0];
						for (let i = 1; i < ors.length; i++) {
							orExpr = client`${orExpr} OR ${ors[i]}`;
						}
						parts.push(client`(${orExpr})`);
					}
				} else {
					parts.push(clause);
				}
			}
			if (parts.length === 0) return client``;
			let andExpr = parts[0];
			for (let i = 1; i < parts.length; i++) {
				andExpr = client`${andExpr} AND ${parts[i]}`;
			}
			return client`WHERE ${andExpr}`;
		};

		// Count with filters
		const [{ count }] = await client<{ count: string }[]>`
			SELECT COUNT(*)::text as count FROM ${client.unsafe(tableName)} ${renderWhere()};
		`;

		// Page query with filters; order by created_at desc if exists
		const items = await client<any[]>`
			SELECT id, created_at, name, category, description, link, icon_url, tags
			FROM ${client.unsafe(tableName)}
			${renderWhere()}
			ORDER BY created_at DESC
			LIMIT ${pageSize} OFFSET ${offset};
		`;

		return NextResponse.json({
			items,
			total: Number(count ?? 0),
			page,
			pageSize,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	} finally {
		await client.end({ timeout: 5 });
	}
}
