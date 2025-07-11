import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFileSync, existsSync } from "fs";

export async function GET(req: NextRequest) {
	try {
		const scrapedDataPath = path.join(process.cwd(), "lib", "scrape-data.json");

		const result: any = {
			cwd: process.cwd(),
			filePath: scrapedDataPath,
			fileExists: existsSync(scrapedDataPath),
			nodeVersion: process.version,
			platform: process.platform,
		};

		if (existsSync(scrapedDataPath)) {
			const stats = require("fs").statSync(scrapedDataPath);
			result.fileSize = `${(stats.size / 1024 / 1024).toFixed(2)}MB`;

			// Try to load a small sample
			const fileContent = readFileSync(scrapedDataPath, "utf-8");
			const data = JSON.parse(fileContent);

			result.totalAgents = data.length;
			result.validAgents = data.filter(
				(a: any) => a && a.name && a.name.trim()
			).length;
			result.sampleNames = data
				.filter((a: any) => a && a.name && a.name.trim())
				.slice(0, 3)
				.map((a: any) => a.name);
		}

		return NextResponse.json(result);
	} catch (error: any) {
		return NextResponse.json(
			{
				error: error?.message || "Unknown error",
				stack: error?.stack || "No stack trace",
			},
			{ status: 500 }
		);
	}
}
