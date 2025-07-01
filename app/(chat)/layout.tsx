import { cookies } from "next/headers";
import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";
import Script from "next/script";

export const experimental_ppr = true;

export const metadata: Metadata = {
	title: "AI Chat - Intelligent Conversations with AI Agents",
	description:
		"Experience powerful AI conversations with advanced chatbots and AI agents. Get intelligent responses, creative assistance, and problem-solving support through our AI chat platform.",
	keywords: [
		"AI chat",
		"chatbot",
		"AI conversation",
		"artificial intelligence chat",
		"AI assistant",
		"intelligent chatbot",
		"AI dialogue",
		"conversational AI",
		"chat with AI",
		"AI messaging",
		"smart chat",
		"AI communication",
		"virtual assistant",
	],
	openGraph: {
		title: "AI Chat - Intelligent Conversations with AI Agents | Portdex",
		description:
			"Experience powerful AI conversations with advanced chatbots and AI agents. Get intelligent responses and creative assistance.",
		type: "website",
		url: "https://chat.vercel.ai/chat",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Portdex AI Chat Interface",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Chat - Intelligent Conversations with AI Agents | Portdex",
		description:
			"Experience powerful AI conversations with advanced chatbots and AI agents.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/chat",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, cookieStore] = await Promise.all([auth(), cookies()]);
	// const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebApplication",
						name: "Portdex AI Chat",
						description:
							"Intelligent AI chat platform for conversations with advanced AI agents",
						url: "https://chat.vercel.ai/chat",
						applicationCategory: "CommunicationApplication",
						operatingSystem: "Web Browser",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
							category: "AI Chat Service",
						},
						provider: {
							"@type": "Organization",
							name: "Portdex",
							logo: "https://chat.vercel.ai/logo.webp",
						},
						featureList: [
							"Multi-model AI conversations",
							"Advanced AI agents",
							"Real-time responses",
							"Context-aware dialogue",
							"Creative assistance",
							"Problem-solving support",
						],
						browserRequirements:
							"Requires a modern web browser with JavaScript enabled",
					}),
				}}
			/>
			<Script
				src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
				strategy="beforeInteractive"
			/>
			<SidebarProvider defaultOpen={false}>
				<AppSidebar user={session?.user} />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
		</>
	);
}
