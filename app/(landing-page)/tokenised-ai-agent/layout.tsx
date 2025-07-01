import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tokenised AI Agents - Transform AI into Valuable Assets",
	description:
		"Discover how to tokenize AI agents and transform them into valuable blockchain assets. Create, trade, and monetize intelligent AI agents in our decentralized marketplace.",
	keywords: [
		"tokenized AI agents",
		"AI agent tokenization",
		"blockchain AI assets",
		"tokenize AI",
		"AI NFTs",
		"smart contract AI",
		"AI agent trading",
		"blockchain AI marketplace",
		"tokenized intelligence",
		"AI asset creation",
		"decentralized AI agents",
		"AI agent monetization",
	],
	openGraph: {
		title: "Tokenised AI Agents - Transform AI into Valuable Assets | Portdex",
		description:
			"Discover how to tokenize AI agents and transform them into valuable blockchain assets in our decentralized marketplace.",
		type: "website",
		url: "https://chat.vercel.ai/tokenised-ai-agent",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Tokenised AI Agents on Portdex",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Tokenised AI Agents - Transform AI into Valuable Assets | Portdex",
		description:
			"Discover how to tokenize AI agents and transform them into valuable blockchain assets.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/tokenised-ai-agent",
	},
};

export default function TokenisedAIAgentLayout({
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
						"@type": "Service",
						name: "AI Agent Tokenization",
						description:
							"Transform AI agents into valuable blockchain assets through tokenization",
						url: "https://chat.vercel.ai/tokenised-ai-agent",
						provider: {
							"@type": "Organization",
							name: "Portdex",
							logo: "https://chat.vercel.ai/logo.webp",
						},
						serviceType: "AI Tokenization Service",
						areaServed: "Worldwide",
						hasOfferCatalog: {
							"@type": "OfferCatalog",
							name: "AI Agent Tokenization Services",
							itemListElement: [
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "AI Agent Creation",
										description: "Create and develop intelligent AI agents",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Blockchain Tokenization",
										description: "Transform AI agents into blockchain tokens",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Marketplace Trading",
										description:
											"Trade tokenized AI agents in decentralized marketplace",
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
									name: "Tokenised AI Agents",
									item: "https://chat.vercel.ai/tokenised-ai-agent",
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
