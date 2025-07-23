"use client";
import { Amplify } from "aws-amplify";

const amplifyConfig = {
	Auth: {
		Cognito: {
			userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
			userPoolClientId:
				process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
			userPoolClientSecret:
				process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_SECRET || "",
			identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || "",
			allowGuestAccess: true, // This enables guest access via Identity Pool
			loginWith: {
				oauth: {
					domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
					scopes: ["email", "profile", "openid"],
					redirectSignIn: [
						process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || "",
					],
					redirectSignOut: [
						process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT || "",
					],
					responseType: "code" as const,
				},
			},
		},
	},
};

// Check if all required values are present
const missingValues = [];
if (!amplifyConfig.Auth.Cognito.userPoolId) missingValues.push("userPoolId");
if (!amplifyConfig.Auth.Cognito.userPoolClientId)
	missingValues.push("userPoolClientId");
if (!amplifyConfig.Auth.Cognito.identityPoolId)
	missingValues.push("identityPoolId");

if (missingValues.length > 0) {
	console.error(
		"❌ Missing required Cognito configuration values:",
		missingValues
	);
} else {
	console.log("✅ AWS Cognito configuration loaded successfully");
	console.log(
		"🔑 Identity Pool ID:",
		amplifyConfig.Auth.Cognito.identityPoolId
	);
	console.log("👤 User Pool ID:", amplifyConfig.Auth.Cognito.userPoolId);
	console.log(
		"🔐 Client Secret:",
		amplifyConfig.Auth.Cognito.userPoolClientSecret
			? "✓ Configured"
			: "✗ Missing"
	);
}

Amplify.configure(amplifyConfig, {
	ssr: true,
});

export default function ConfigureAmplifyClientSide() {
	return null;
}
