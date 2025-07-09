import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.POSTGRES_URL || "");
const db = drizzle(client);

export async function GET(request: NextRequest) {
	try {
		// Test database connectivity
		const result = await db.execute("SELECT 1 as test");

		return NextResponse.json({
			status: "healthy",
			database: "connected",
			timestamp: new Date().toISOString(),
			postgres_url_set: !!process.env.POSTGRES_URL,
			test_query: result,
		});
	} catch (error) {
		console.error("Health check database error:", error);

		return NextResponse.json(
			{
				status: "unhealthy",
				database: "disconnected",
				error: error instanceof Error ? error.message : "Unknown error",
				postgres_url_set: !!process.env.POSTGRES_URL,
				timestamp: new Date().toISOString(),
			},
			{ status: 503 }
		);
	}
}
