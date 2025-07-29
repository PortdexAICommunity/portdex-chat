import { NextResponse } from "next/server";
import {
	S3Client,
	ListObjectsV2Command,
	HeadBucketCommand,
	GetObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
	region: process.env.NEXT_PUBLIC_AWS_REGION,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
	},
});

export async function GET() {
	console.log("🧪 N8N Workflow S3 Test Endpoint Called");

	const testResults = {
		timestamp: new Date().toISOString(),
		testType: "n8n-workflow-integration",
		environment: {
			NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || "NOT_SET",
			NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
				? "SET"
				: "NOT_SET",
			NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env
				.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
				? "SET"
				: "NOT_SET",
			NEXT_PUBLIC_S3_BUCKET_NAME:
				process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "NOT_SET",
		},
		tests: [] as Array<{
			name: string;
			status: "PASS" | "FAIL" | "WARNING";
			message: string;
			details?: any;
		}>,
	};

	// Test 1: Environment Variables
	console.log("🔧 Testing environment variables...");
	const requiredVars = [
		"NEXT_PUBLIC_AWS_REGION",
		"NEXT_PUBLIC_AWS_ACCESS_KEY_ID",
		"NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY",
		"NEXT_PUBLIC_S3_BUCKET_NAME",
	];
	const missingVars = requiredVars.filter((varName) => !process.env[varName]);

	if (missingVars.length === 0) {
		testResults.tests.push({
			name: "Environment Variables",
			status: "PASS",
			message: "All required environment variables are set",
		});
		console.log("✅ Environment variables check passed");
	} else {
		testResults.tests.push({
			name: "Environment Variables",
			status: "FAIL",
			message: `Missing variables: ${missingVars.join(", ")}`,
			details: { missingVars },
		});
		console.log("❌ Environment variables check failed:", missingVars);
		return NextResponse.json(testResults);
	}

	// Test 2: S3 Client Initialization
	console.log("🔌 Testing S3 client initialization...");
	try {
		testResults.tests.push({
			name: "S3 Client Initialization",
			status: "PASS",
			message: "S3 client created successfully",
		});
		console.log("✅ S3 client initialization passed");
	} catch (error: any) {
		testResults.tests.push({
			name: "S3 Client Initialization",
			status: "FAIL",
			message: error.message,
			details: { errorName: error.name },
		});
		console.log("❌ S3 client initialization failed:", error);
		return NextResponse.json(testResults);
	}

	// Test 3: Bucket Access
	console.log("🪣 Testing bucket access...");
	try {
		const headBucketCommand = new HeadBucketCommand({
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		});

		const startTime = Date.now();
		await s3Client.send(headBucketCommand);
		const duration = Date.now() - startTime;

		testResults.tests.push({
			name: "Bucket Access",
			status: "PASS",
			message: `Bucket accessible in ${duration}ms`,
			details: { duration, bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME },
		});
		console.log("✅ Bucket access test passed");
	} catch (error: any) {
		testResults.tests.push({
			name: "Bucket Access",
			status: "FAIL",
			message: error.message,
			details: {
				errorName: error.name,
				errorCode: error.code,
				bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
				statusCode: error.$metadata?.httpStatusCode,
			},
		});
		console.log("❌ Bucket access test failed:", error);
		return NextResponse.json(testResults);
	}

	// Test 4: N8N Workflows Folder Listing
	console.log("📁 Testing N8N workflows folder listing...");
	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Prefix: "workflows/",
			MaxKeys: 100,
		});

		const startTime = Date.now();
		const response = await s3Client.send(listCommand);
		const duration = Date.now() - startTime;

		const allObjects = response.Contents || [];
		const jsonFiles = allObjects.filter(
			(obj) => obj.Key && obj.Key.endsWith(".json") && !obj.Key.endsWith("/")
		);

		if (jsonFiles.length > 0) {
			testResults.tests.push({
				name: "N8N Workflows Folder Listing",
				status: "PASS",
				message: `Found ${allObjects.length} objects, ${jsonFiles.length} JSON workflow files in ${duration}ms`,
				details: {
					totalObjects: allObjects.length,
					jsonFiles: jsonFiles.length,
					duration,
					sampleFiles: jsonFiles.slice(0, 5).map((f) => f.Key),
					prefix: "workflows/",
				},
			});
			console.log("✅ N8N workflows folder listing passed");
		} else {
			testResults.tests.push({
				name: "N8N Workflows Folder Listing",
				status: "WARNING",
				message: `No JSON workflow files found (${allObjects.length} total objects)`,
				details: {
					totalObjects: allObjects.length,
					jsonFiles: 0,
					duration,
					prefix: "workflows/",
				},
			});
			console.log("⚠️ No N8N workflow files found");
		}
	} catch (error: any) {
		testResults.tests.push({
			name: "N8N Workflows Folder Listing",
			status: "FAIL",
			message: error.message,
			details: {
				errorName: error.name,
				errorCode: error.code,
				prefix: "workflows/",
				statusCode: error.$metadata?.httpStatusCode,
			},
		});
		console.log("❌ N8N workflows folder listing failed:", error);
	}

	// Test 5: N8N Workflow File Validation
	console.log("📄 Testing N8N workflow file validation...");
	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Prefix: "workflows/",
			MaxKeys: 3,
		});

		const listResponse = await s3Client.send(listCommand);
		const jsonFiles = (listResponse.Contents || []).filter(
			(obj) => obj.Key && obj.Key.endsWith(".json")
		);

		if (jsonFiles.length === 0) {
			testResults.tests.push({
				name: "N8N Workflow File Validation",
				status: "FAIL",
				message: "No JSON workflow files found to validate",
				details: { prefix: "workflows/" },
			});
		} else {
			const validationResults = [];

			for (const file of jsonFiles.slice(0, 2)) {
				// Test first 2 files
				try {
					const getObjectCommand = new GetObjectCommand({
						Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
						Key: file.Key,
					});

					const objectResponse = await s3Client.send(getObjectCommand);
					const bodyBytes = await objectResponse.Body?.transformToByteArray();
					const fileContent = new TextDecoder().decode(bodyBytes);
					const workflow = JSON.parse(fileContent);

					// Validate N8N structure
					const isValidN8N = !!(
						workflow.nodes &&
						Array.isArray(workflow.nodes) &&
						workflow.connections
					);

					const stats = {
						fileName: file.Key,
						hasId: !!workflow.id,
						hasName: !!workflow.name,
						nodesCount: workflow.nodes?.length || 0,
						connectionsCount: Object.keys(workflow.connections || {}).length,
						isActive: workflow.active,
						fileSize: file.Size,
						isValidN8N,
					};

					validationResults.push(stats);

					console.log(`✅ Validated N8N workflow: ${file.Key}`, stats);
				} catch (fileError) {
					console.error(`❌ Failed to validate ${file.Key}:`, fileError);
					validationResults.push({
						fileName: file.Key,
						error:
							fileError instanceof Error
								? fileError.message
								: String(fileError),
						isValidN8N: false,
					});
				}
			}

			const validFiles = validationResults.filter((r) => r.isValidN8N).length;
			const status = validFiles > 0 ? "PASS" : "FAIL";

			testResults.tests.push({
				name: "N8N Workflow File Validation",
				status,
				message: `Validated ${validationResults.length} files, ${validFiles} valid N8N workflows`,
				details: {
					validatedFiles: validationResults.length,
					validN8NFiles: validFiles,
					samples: validationResults,
				},
			});

			if (status === "PASS") {
				console.log("✅ N8N workflow file validation passed");
			} else {
				console.log("❌ N8N workflow file validation failed");
			}
		}
	} catch (error: any) {
		testResults.tests.push({
			name: "N8N Workflow File Validation",
			status: "FAIL",
			message: error.message,
			details: { errorName: error.name, errorCode: error.code },
		});
		console.log("❌ N8N workflow file validation failed:", error);
	}

	// Test 6: API Integration Test
	console.log("🔗 Testing workflow API integration...");
	try {
		const response = await fetch(
			`${
				process.env.NEXTAUTH_URL || "http://localhost:3000"
			}/marketplace/api/workflows?page=1&pageSize=5`
		);
		const data = await response.json();

		if (response.ok && data.workflows) {
			testResults.tests.push({
				name: "API Integration Test",
				status: "PASS",
				message: `API returned ${data.workflows.length} workflows (total: ${data.total})`,
				details: {
					statusCode: response.status,
					workflowCount: data.workflows.length,
					totalWorkflows: data.total,
					sampleWorkflow: data.workflows[0]
						? {
								name: data.workflows[0].name,
								category: data.workflows[0].category,
								creator: data.workflows[0].creator,
							}
						: null,
				},
			});
			console.log("✅ API integration test passed");
		} else {
			testResults.tests.push({
				name: "API Integration Test",
				status: "FAIL",
				message: `API failed: ${data.error || "Unknown error"}`,
				details: {
					statusCode: response.status,
					error: data.error,
					debug: data.debug,
				},
			});
			console.log("❌ API integration test failed");
		}
	} catch (error: any) {
		testResults.tests.push({
			name: "API Integration Test",
			status: "FAIL",
			message: error.message,
			details: { errorName: error.name },
		});
		console.log("❌ API integration test failed:", error);
	}

	// Summary
	const passedTests = testResults.tests.filter(
		(t) => t.status === "PASS"
	).length;
	const warningTests = testResults.tests.filter(
		(t) => t.status === "WARNING"
	).length;
	const totalTests = testResults.tests.length;
	const allPassed = passedTests === totalTests;
	const hasWarnings = warningTests > 0;

	console.log(
		`🏁 N8N Workflow Test Summary: ${passedTests}/${totalTests} tests passed, ${warningTests} warnings`
	);

	let summaryMessage: string;
	if (allPassed) {
		summaryMessage =
			"🎉 All tests passed! N8N workflow S3 integration is working perfectly.";
	} else if (passedTests > 0) {
		summaryMessage = `⚠️ ${
			totalTests - passedTests
		} test(s) failed, ${warningTests} warning(s). Check the details above.`;
	} else {
		summaryMessage =
			"❌ Integration tests failed. Please check your S3 configuration.";
	}

	if (hasWarnings && allPassed) {
		summaryMessage =
			"⚠️ Tests passed with warnings. Your S3 bucket may be empty or need N8N workflow files.";
	}

	return NextResponse.json({
		...testResults,
		summary: {
			passed: passedTests,
			warnings: warningTests,
			failed: totalTests - passedTests - warningTests,
			total: totalTests,
			allPassed,
			hasWarnings,
			message: summaryMessage,
			recommendations: [
				...(warningTests > 0
					? [
							"Upload N8N workflow JSON files to the 'workflows/' folder in your S3 bucket",
						]
					: []),
				...(passedTests < totalTests
					? ["Check AWS credentials and S3 bucket permissions"]
					: []),
				"Visit /marketplace to see your workflows in action",
			],
		},
	});
}
