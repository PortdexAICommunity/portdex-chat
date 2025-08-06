import { defineBackend, secret } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib/core";
import { GitHubProvider } from "./custom/github-provider";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	auth,
	data,
});

// backend.auth.resources.userPool.addDomain("cognito-domain", {
// 	cognitoDomain: {
// 		domainPrefix: "portdex-chat",
// 	},
// });

//Github Provider
// API gateway
// Lamba functions

const existingStack = Stack.of(backend.auth.resources.userPool);

const { userPool, userPoolClient } = backend.auth.resources;

new GitHubProvider(existingStack, "GitHubProvider", {
	clientId: secret("GITHUB_CLIENT_ID"),
	clientSecret: secret("GITHUB_CLIENT_SECRET"),
	userPool,
	userPoolClient,
});
