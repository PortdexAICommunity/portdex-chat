import { getServerSession } from "@/lib/amplify-server";
import {
	AuthGetCurrentUserServer,
	ensureUserInDatabase,
} from "@/utils/amplify-utils";

export async function GET() {
	try {
		const session = await getServerSession();
		if (!session?.user || session.user.type === "guest") {
			const user = await AuthGetCurrentUserServer();
			if (user) {
				try {
					const user = await AuthGetCurrentUserServer();
					if (user) {
						const userId = user.userId;
						const email =
							user.signInDetails?.loginId || `user-${userId}@placeholder.local`;
						await ensureUserInDatabase(userId, email);
					}
				} catch (err: any) {
					// Swallow only UserUnAuthenticatedException, rethrow others
					if (err.name !== "UserUnAuthenticatedException") {
						console.error("Warmup error:", err);
					}
				}
			}
		}
		return new Response(JSON.stringify({ warmed: !!session?.user }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch {
		return new Response(JSON.stringify({ warmed: false }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}
}
