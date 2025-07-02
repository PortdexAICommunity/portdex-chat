import { cookies } from "next/headers";
import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";
import Script from "next/script";

export const experimental_ppr = true;

export const metadata: Metadata = {
	title: "AI Marketplace - Discover AI Agents, Models & Tools",
	description:
		"Explore our comprehensive AI marketplace featuring AI agents, models, software tools, and MCP servers. Find, compare, and deploy the perfect AI solutions for your needs.",
	keywords: [
		"AI marketplace",
		"AI agents marketplace",
		"AI models",
		"MCP servers",
		"software tools",
		"artificial intelligence marketplace",
		"machine learning models",
		"AI assistants",
		"AI marketplace platform",
		"AI services",
		"AI tools directory",
		"AI agent store",
		"marketplace AI solutions",
	],
	openGraph: {
		title: "AI Marketplace - Discover AI Agents, Models & Tools | Portdex",
		description:
			"Explore our comprehensive AI marketplace featuring AI agents, models, software tools, and MCP servers.",
		type: "website",
		url: "https://chat.vercel.ai/marketplace",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Portdex AI Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Marketplace - Discover AI Agents, Models & Tools | Portdex",
		description:
			"Explore our comprehensive AI marketplace featuring AI agents, models, and tools.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/marketplace",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function MarketplaceLayout({
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
						"@type": "Marketplace",
						name: "Portdex AI Marketplace",
						description:
							"Comprehensive marketplace for AI agents, models, software tools, and MCP servers",
						url: "https://chat.vercel.ai/marketplace",
						provider: {
							"@type": "Organization",
							name: "Portdex",
							logo: "https://chat.vercel.ai/logo.webp",
						},
						hasOfferCatalog: {
							"@type": "OfferCatalog",
							name: "AI Solutions Catalog",
							itemListElement: [
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "SoftwareApplication",
										name: "AI Agents",
										description:
											"Intelligent AI agents for various tasks and industries",
										applicationCategory: "Artificial Intelligence",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "SoftwareApplication",
										name: "AI Models",
										description:
											"Pre-trained machine learning models and AI systems",
										applicationCategory: "Machine Learning",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "SoftwareApplication",
										name: "Software Tools",
										description:
											"Development tools and utilities for AI applications",
										applicationCategory: "Developer Tools",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "SoftwareApplication",
										name: "MCP Servers",
										description:
											"Model Context Protocol servers for AI integration",
										applicationCategory: "Server Software",
									},
								},
							],
						},
						breadcrumb: {
							"@type": "BreadcrumbList",
							itemListElement: [
								{
									"@type": "ListItem",
									position: 1,
									name: "Home",
									item: "https://chat.vercel.ai",
								},
								{
									"@type": "ListItem",
									position: 2,
									name: "Marketplace",
									item: "https://chat.vercel.ai/marketplace",
								},
							],
						},
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
