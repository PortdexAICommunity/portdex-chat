import type { WorkflowType } from "@/lib/types";
import { type NextRequest, NextResponse } from "next/server";
import {
	S3Client,
	ListObjectsV2Command,
	GetObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client with environment variables
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

// N8N Node type to category mapping
const NODE_CATEGORY_MAP: Record<string, string> = {
	// Email & Communication
	"n8n-nodes-base.gmail": "Email Marketing",
	"n8n-nodes-base.emailSend": "Email Marketing",
	"n8n-nodes-base.emailReadImap": "Email Marketing",
	"n8n-nodes-base.mailgun": "Email Marketing",
	"n8n-nodes-base.sendGrid": "Email Marketing",

	// Social Media & Messaging
	"n8n-nodes-base.telegram": "Social Media",
	"n8n-nodes-base.telegramTrigger": "Social Media",
	"n8n-nodes-base.discord": "Social Media",
	"n8n-nodes-base.slack": "Social Media",
	"n8n-nodes-base.twitter": "Social Media",
	"n8n-nodes-base.linkedin": "Social Media",
	"n8n-nodes-base.whatsApp": "Social Media",

	// AI & Machine Learning
	"n8n-nodes-base.openAi": "AI Automation",
	"n8n-nodes-base.anthropic": "AI Automation",
	"n8n-nodes-base.huggingFace": "AI Automation",
	"@n8n/n8n-nodes-langchain": "AI Automation",

	// Scheduling & Triggers
	"n8n-nodes-base.cron": "Scheduled Tasks",
	"n8n-nodes-base.scheduleTrigger": "Scheduled Tasks",
	"n8n-nodes-base.intervalTrigger": "Scheduled Tasks",
	"n8n-nodes-base.webhook": "API Integration",

	// Data & Databases
	"n8n-nodes-base.postgres": "Data Processing",
	"n8n-nodes-base.mysql": "Data Processing",
	"n8n-nodes-base.mongoDb": "Data Processing",
	"n8n-nodes-base.redis": "Data Processing",
	"n8n-nodes-base.airtable": "Data Processing",
	"n8n-nodes-base.googleSheets": "Data Processing",
	"n8n-nodes-base.excel": "Data Processing",
	"n8n-nodes-base.csv": "Data Processing",

	// Business & CRM
	"n8n-nodes-base.salesforce": "Business Automation",
	"n8n-nodes-base.hubspot": "Business Automation",
	"n8n-nodes-base.pipedrive": "Business Automation",
	"n8n-nodes-base.notion": "Business Automation",

	// File & Storage
	"n8n-nodes-base.googleDrive": "File Management",
	"n8n-nodes-base.dropbox": "File Management",
	"n8n-nodes-base.awsS3": "File Management",
	"n8n-nodes-base.ftp": "File Management",

	// Finance & E-commerce
	"n8n-nodes-base.stripe": "Finance",
	"n8n-nodes-base.paypal": "Finance",
	"n8n-nodes-base.shopify": "E-commerce",
	"n8n-nodes-base.wooCommerce": "E-commerce",
};

// Category to icon mapping
const CATEGORY_ICONS: Record<string, string> = {
	"Email Marketing": "📧",
	"Social Media": "📱",
	"AI Automation": "🤖",
	"Scheduled Tasks": "⏰",
	"API Integration": "🔌",
	"Data Processing": "📊",
	"Business Automation": "🏢",
	"File Management": "📁",
	Finance: "💰",
	"E-commerce": "🛒",
	"Customer Support": "🎧",
	Marketing: "📈",
	"General Automation": "⚙️",
};

// Function to categorize workflow based on node types
function categorizeWorkflow(nodes: any[]): string {
	if (!nodes || !Array.isArray(nodes)) return "General Automation";

	const nodeTypes = nodes.map((node) => node.type).filter(Boolean);
	const categoryCounts: Record<string, number> = {};

	// Count categories based on node types
	nodeTypes.forEach((nodeType) => {
		const category = NODE_CATEGORY_MAP[nodeType] || "General Automation";
		categoryCounts[category] = (categoryCounts[category] || 0) + 1;
	});

	// Return the most common category, or General Automation if none found
	if (Object.keys(categoryCounts).length === 0) return "General Automation";

	return Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Function to generate workflow description
function generateDescription(workflow: any): string {
	const name = workflow.name || "Unnamed Workflow";
	const nodes = workflow.nodes || [];

	if (nodes.length === 0) {
		return `Automated workflow: ${name}`;
	}

	// Extract key node types for description
	const nodeTypes = nodes.map((node: any) => node.type).filter(Boolean);
	const uniqueServices = new Set();

	nodeTypes.forEach((type: string) => {
		if (type.includes("gmail")) uniqueServices.add("Gmail");
		else if (type.includes("telegram")) uniqueServices.add("Telegram");
		else if (type.includes("openAi")) uniqueServices.add("OpenAI");
		else if (type.includes("slack")) uniqueServices.add("Slack");
		else if (type.includes("discord")) uniqueServices.add("Discord");
		else if (type.includes("notion")) uniqueServices.add("Notion");
		else if (type.includes("google")) uniqueServices.add("Google Services");
		else if (type.includes("schedule")) uniqueServices.add("Scheduler");
		else if (type.includes("webhook")) uniqueServices.add("Webhooks");
	});

	const services = Array.from(uniqueServices).slice(0, 3);

	if (services.length > 0) {
		return `Automated workflow integrating ${services.join(
			", "
		)} for ${name.toLowerCase()}`;
	}

	return `Professional automation workflow: ${name}`;
}

// Function to generate tags from workflow content
function generateTags(workflow: any): string[] {
	const tags = new Set<string>();
	const nodes = workflow.nodes || [];
	const name = (workflow.name || "").toLowerCase();

	// Add tags based on workflow name
	if (name.includes("schedule")) tags.add("scheduled");
	if (name.includes("email")) tags.add("email");
	if (name.includes("telegram")) tags.add("telegram");
	if (name.includes("ai")) tags.add("ai");
	if (name.includes("report")) tags.add("reporting");
	if (name.includes("automation")) tags.add("automation");
	if (name.includes("notification")) tags.add("notification");

	// Add tags based on node types
	nodes.forEach((node: any) => {
		const type = node.type || "";
		if (type.includes("gmail")) tags.add("gmail");
		if (type.includes("telegram")) tags.add("telegram");
		if (type.includes("openAi")) tags.add("ai");
		if (type.includes("schedule")) tags.add("scheduled");
		if (type.includes("webhook")) tags.add("webhook");
		if (type.includes("slack")) tags.add("slack");
		if (type.includes("discord")) tags.add("discord");
		if (type.includes("notion")) tags.add("notion");
	});

	// Add category-based tags
	const category = categorizeWorkflow(nodes);
	if (category !== "General Automation") {
		tags.add(category.toLowerCase().replace(/\s+/g, "-"));
	}

	// Always include base tags
	tags.add("workflow");
	tags.add("n8n");

	return Array.from(tags).slice(0, 6); // Limit to 6 tags
}

// Function to extract creator information
function extractCreator(workflow: any): string {
	// Check for author/creator fields
	if (workflow.author) return workflow.author;
	if (workflow.creator) return workflow.creator;
	if (workflow.meta?.author) return workflow.meta.author;

	// Check credentials for user info (be careful with sensitive data)
	if (workflow.credentials && typeof workflow.credentials === "object") {
		// Don't expose actual credentials, just check if they exist
		return "Community Contributor";
	}

	return "N8N Community";
}

// Function to transform S3 object to WorkflowType
async function transformN8nWorkflowToWorkflowType(
	s3Object: any,
	workflowContent: any
): Promise<WorkflowType | null> {
	try {
		const key = s3Object.Key || "";
		// Remove .json extension and any leading path
		const workflowId =
			key
				.replace(/\.json$/, "")
				.split("/")
				.pop() || key;

		// Parse workflow content
		const workflow =
			typeof workflowContent === "string"
				? JSON.parse(workflowContent)
				: workflowContent;

		// Extract metadata
		const name =
			workflow.name ||
			workflowId
				.replace(/-/g, " ")
				.replace(/\b\w/g, (l: string) => l.toUpperCase());
		const category = categorizeWorkflow(workflow.nodes || []);
		const description = generateDescription(workflow);
		const tags = generateTags(workflow);
		const creator = extractCreator(workflow);
		const icon = CATEGORY_ICONS[category] || "⚙️";
		const size = s3Object.Size
			? `${(s3Object.Size / 1024).toFixed(1)} KB`
			: undefined;
		const date = s3Object.LastModified
			? new Date(s3Object.LastModified).toISOString().split("T")[0]
			: new Date().toISOString().split("T")[0];

		return {
			id: workflowId,
			name,
			description,
			category,
			icon,
			creator,
			date,
			downloadUrl: `/marketplace/api/workflows/download/${encodeURIComponent(
				workflowId
			)}`,
			fileSize: size,
			fileType: "N8N Workflow",
			tags,
		};
	} catch (error) {
		console.error("❌ Error transforming workflow:", error);
		return null;
	}
}

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const page = Number(searchParams.get("page") || 1);
	const pageSize = Number(searchParams.get("pageSize") || 20);
	const category = searchParams.get("category");
	const search = searchParams.get("search");

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
				error: `Missing required environment variables: ${missingVars.join(
					", "
				)}`,
				workflows: [],
			},
			{ status: 500 }
		);
	}

	try {
		// List objects in S3 bucket (files are in root, not workflows/ folder)
		const command = new ListObjectsV2Command({
			Bucket: process.env.S3_BUCKET_NAME,
			MaxKeys: 1000,
		});

		const response = await s3Client.send(command);

		if (!response.Contents || response.Contents.length === 0) {
			return NextResponse.json({
				workflows: [],
				total: 0,
				page,
				pageSize,
			});
		}

		// Filter JSON files only
		const jsonFiles = response.Contents.filter(
			(obj) =>
				obj.Key &&
				!obj.Key.endsWith("/") &&
				obj.Key.toLowerCase().endsWith(".json")
		);

		// Fetch and parse each workflow file
		const workflowPromises = jsonFiles.map(async (file) => {
			try {
				const getObjectCommand = new GetObjectCommand({
					Bucket: process.env.S3_BUCKET_NAME,
					Key: file.Key,
				});

				const objectResponse = await s3Client.send(getObjectCommand);

				if (!objectResponse.Body) {
					return null;
				}

				const bodyBytes = await objectResponse.Body.transformToByteArray();
				const fileContent = new TextDecoder().decode(bodyBytes);

				// Transform to WorkflowType
				const workflow = await transformN8nWorkflowToWorkflowType(
					file,
					fileContent
				);

				return workflow;
			} catch (error: any) {
				return null;
			}
		});

		const allWorkflows = await Promise.all(workflowPromises);

		// Filter out failed conversions
		let workflows = allWorkflows.filter((w): w is WorkflowType => w !== null);

		// Apply filters
		if (category) {
			workflows = workflows.filter(
				(workflow) => workflow.category.toLowerCase() === category.toLowerCase()
			);
		}

		if (search) {
			const searchLower = search.toLowerCase();
			workflows = workflows.filter(
				(workflow) =>
					workflow.name.toLowerCase().includes(searchLower) ||
					workflow.description.toLowerCase().includes(searchLower) ||
					workflow.category.toLowerCase().includes(searchLower) ||
					workflow.creator.toLowerCase().includes(searchLower) ||
					workflow.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
			);
		}

		const total = workflows.length;
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const paginatedWorkflows = workflows.slice(start, end);

		return NextResponse.json({
			workflows: paginatedWorkflows,
			total,
			page,
			pageSize,
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				error: "Failed to fetch workflows from S3",
				workflows: [],
			},
			{ status: 500 }
		);
	}
}
