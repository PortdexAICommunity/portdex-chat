import { cookies } from "next/headers";
import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";
import Script from "next/script";
import { Footer } from "@/components/footer";

export const experimental_ppr = true;

export const metadata: Metadata = {
	title: {
		default: "Portdex - Community-Governed AI Agent Marketplace",
		template: "%s | Portdex",
	},
	description:
		"Transform your AI agents and digital content into valuable blockchain assets. Join a decentralized ecosystem where creators thrive and innovation flourishes in the AI marketplace.",
	keywords: [
		"AI agent marketplace",
		"blockchain AI",
		"tokenized AI agents",
		"decentralized AI",
		"AI tokenization",
		"community governed",
		"digital content tokenization",
		"blockchain marketplace",
		"AI innovation",
		"creator economy",
		"smart contracts AI",
		"NFT AI agents",
	],
	openGraph: {
		title: "Portdex - Community-Governed AI Agent Marketplace",
		description:
			"Transform your AI agents and digital content into valuable blockchain assets. Join a decentralized ecosystem where creators thrive.",
		type: "website",
		url: "https://chat.vercel.ai",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Portdex AI Agent Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Portdex - Community-Governed AI Agent Marketplace",
		description:
			"Transform your AI agents and digital content into valuable blockchain assets.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, cookieStore] = await Promise.all([auth(), cookies()]);
	// const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

	return (
		<>
			<Script
				src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
				strategy="beforeInteractive"
			/>
			<SidebarProvider defaultOpen={false}>
				<AppSidebar user={session?.user} />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
			<Footer />
		</>
	);
}
