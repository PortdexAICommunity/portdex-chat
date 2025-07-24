import { getServerSession } from "@/lib/amplify-server";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	// Await params before accessing properties (Next.js 15+ requirement)
	const { id } = await params;
	const workflowId = id;

	try {
		// TODO: Re-enable authentication when needed
		// Check authentication
		// const session = await getServerSession();

		// if (!session?.user || session.user.type === "guest") {
		// 	return NextResponse.json(
		// 		{ error: "Authentication required to download workflows" },
		// 		{ status: 401 }
		// 	);
		// }

		// Temporarily allow all downloads (including guests)

		// Validate environment variables
		const requiredEnvVars = {
			AWS_REGION: process.env.AWS_REGION,
			AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
			AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
			S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		};

		const missingVars = Object.entries(requiredEnvVars)
			.filter(([_, value]) => !value)
			.map(([key, _]) => key);

		if (missingVars.length > 0) {
			return NextResponse.json(
				{
					error: `Server configuration error: Missing ${missingVars.join(
						", "
					)}`,
				},
				{ status: 500 }
			);
		}

		// Construct S3 key - if files are in bucket root, don't add workflows/ prefix
		const s3Key = `${workflowId}.json`;

		// Fetch workflow file from S3
		const getObjectCommand = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: s3Key,
		});

		try {
			const response = await s3Client.send(getObjectCommand);

			// Read the stream
			if (!response.Body) {
				return NextResponse.json(
					{ error: "Workflow file content not available" },
					{ status: 500 }
				);
			}

			const bodyBytes = await response.Body.transformToByteArray();
			const fileContent = new TextDecoder().decode(bodyBytes);

			// Parse and validate N8N workflow JSON
			let n8nWorkflow: any;
			try {
				n8nWorkflow = JSON.parse(fileContent);
			} catch (parseError) {
				return NextResponse.json(
					{ error: "Invalid N8N workflow file format" },
					{ status: 500 }
				);
			}

			// Validate it's an N8N workflow
			if (!n8nWorkflow.nodes || !Array.isArray(n8nWorkflow.nodes)) {
				return NextResponse.json(
					{ error: "Invalid N8N workflow: missing nodes structure" },
					{ status: 400 }
				);
			}

			// Add download metadata while preserving original N8N structure
			const enrichedWorkflow = {
				...n8nWorkflow,
				// Add metadata section if it doesn't exist
				meta: {
					...n8nWorkflow.meta,
					downloadInfo: {
						downloadedBy: "guest", // Assuming guest user for now
						downloadedAt: new Date().toISOString(),
						downloadedFrom: "Portdex Marketplace",
						originalWorkflowId: workflowId,
						fileSize: fileContent.length,
						version: "1.0.0",
					},
				},
				// Preserve original structure but add marketplace info
				portdexInfo: {
					originalId: workflowId,
					downloadTimestamp: new Date().toISOString(),
					source: "portdex-marketplace",
				},
			};

			// Extract workflow statistics for response headers
			const stats = {
				nodeCount: n8nWorkflow.nodes.length,
				connectionCount: Object.keys(n8nWorkflow.connections || {}).length,
			};

			// Return the enriched N8N workflow
			return NextResponse.json(enrichedWorkflow, {
				headers: {
					"Content-Disposition": `attachment; filename="${workflowId}.json"`,
					"Content-Type": "application/json",
					"Cache-Control": "no-cache",
					"X-Workflow-Type": "n8n",
					"X-Workflow-Nodes": stats.nodeCount.toString(),
					"X-Download-Source": "portdex-marketplace",
				},
			});
		} catch (s3Error: any) {
			// Handle specific S3 errors
			if (s3Error.name === "NoSuchKey" || s3Error.code === "NoSuchKey") {
				return NextResponse.json(
					{
						error: "Workflow not found",
						message: `The workflow '${workflowId}' does not exist in our repository`,
					},
					{ status: 404 }
				);
			} else if (s3Error.name === "NoSuchBucket") {
				return NextResponse.json(
					{ error: "Storage configuration error" },
					{ status: 500 }
				);
			} else if (s3Error.name === "AccessDenied") {
				return NextResponse.json(
					{ error: "Access denied to workflow file" },
					{ status: 403 }
				);
			}

			throw s3Error; // Re-throw for general error handler
		}
	} catch (error: any) {
		return NextResponse.json(
			{
				error: "Download failed",
				message: "Unable to download the workflow. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
