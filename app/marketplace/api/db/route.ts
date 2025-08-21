import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export async function GET() {
	const baseUrl = process.env.POSTGRES_URL;
	if (!baseUrl) {
		return NextResponse.json(
			{ error: "POSTGRES_URL is not set" },
			{ status: 500 }
		);
	}
	const connectionString = `${baseUrl}/marketplace`;

	const client = postgres(connectionString, { max: 1 });
	// Create a drizzle instance so Drizzle Studio can discover this DB
	const db = drizzle(client);

	try {
		const rows = await client<
			{
				table_schema: string;
				table_name: string;
			}[]
		>`
			SELECT table_schema, table_name
			FROM information_schema.tables
			WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
			ORDER BY table_schema, table_name;
		`;
		return NextResponse.json({ tables: rows });
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	} finally {
		await client.end({ timeout: 5 });
	}
}
