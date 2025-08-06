import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	loginWith: {
		email: true,
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["email", "openid", "profile"],
			},
			callbackUrls: [
				"http://localhost:3000/",
				"https://chat.portdex.ai/",
				"https://development.dgdo2awhfom3j.amplifyapp.com/",
			],
			logoutUrls: [
				"http://localhost:3000/",
				"https://chat.portdex.ai/",
				"https://development.dgdo2awhfom3j.amplifyapp.com/",
			],
		},
	},
	userAttributes: {
		email: {
			required: true,
			mutable: true,
		},
		preferredUsername: {
			required: false,
			mutable: true,
		},
		profilePicture: {
			required: false,
			mutable: true,
		},
	},
});
