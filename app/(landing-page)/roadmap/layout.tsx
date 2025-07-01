import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Product Roadmap - Future of AI & Blockchain Innovation",
	description:
		"Explore Portdex roadmap and upcoming features. Discover our plans for advancing AI agent marketplace, blockchain integration, and community-driven innovation.",
	keywords: [
		"portdex roadmap",
		"AI development roadmap",
		"blockchain roadmap",
		"product roadmap",
		"AI marketplace future",
		"upcoming features",
		"innovation roadmap",
		"technology roadmap",
		"AI agent development",
		"blockchain features",
		"product timeline",
		"future updates",
	],
	openGraph: {
		title: "Product Roadmap - Future of AI & Blockchain Innovation | Portdex",
		description:
			"Explore Portdex roadmap and upcoming features for AI agent marketplace and blockchain integration.",
		type: "website",
		url: "https://chat.vercel.ai/roadmap",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Portdex Product Roadmap",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Product Roadmap - Future of AI & Blockchain Innovation | Portdex",
		description:
			"Explore Portdex roadmap and upcoming features for AI marketplace.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/roadmap",
	},
};

export default function RoadmapLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: "Product Roadmap",
						description: "Portdex development roadmap and future features",
						url: "https://chat.vercel.ai/roadmap",
						mainEntity: {
							"@type": "TechArticle",
							headline: "Portdex Product Roadmap",
							description:
								"Comprehensive roadmap for AI marketplace and blockchain innovation",
							publisher: {
								"@type": "Organization",
								name: "Portdex",
								logo: "https://chat.vercel.ai/logo.webp",
							},
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
									name: "Roadmap",
									item: "https://chat.vercel.ai/roadmap",
								},
							],
						},
					}),
				}}
			/>
			{children}
		</>
	);
}
