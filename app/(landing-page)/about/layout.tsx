import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us - Community-Governed AI Agent Marketplace",
	description:
		"Learn about Portdex, the revolutionary AI-powered platform combining chatbot technology with blockchain marketplace features. Discover how we empower creators and innovators in the AI space.",
	keywords: [
		"about portdex",
		"AI marketplace about",
		"blockchain AI platform",
		"community governed AI",
		"AI agent platform",
		"decentralized AI marketplace",
		"creator economy blockchain",
		"AI innovation platform",
		"tokenized intelligence",
		"blockchain technology AI",
	],
	openGraph: {
		title: "About Portdex - Community-Governed AI Agent Marketplace",
		description:
			"Learn about Portdex, the revolutionary platform transforming AI agents into valuable blockchain assets.",
		type: "website",
		url: "https://chat.vercel.ai/about",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "About Portdex - AI Agent Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About Portdex - Community-Governed AI Agent Marketplace",
		description:
			"Learn about Portdex, the revolutionary platform transforming AI agents into valuable blockchain assets.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/about",
	},
};

export default function AboutLayout({
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
						"@type": "Organization",
						name: "Portdex",
						description:
							"Community-governed AI agent marketplace enabling creators to tokenize and trade AI agents on blockchain",
						url: "https://chat.vercel.ai",
						logo: "https://chat.vercel.ai/logo.webp",
						sameAs: [
							"https://twitter.com/portdex",
							"https://github.com/portdex",
						],
						foundingDate: "2024",
						areaServed: "Worldwide",
						hasOfferCatalog: {
							"@type": "OfferCatalog",
							name: "AI Agent Marketplace",
							itemListElement: [
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "AI Agent Tokenization",
										description: "Transform AI agents into blockchain assets",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Digital Content Marketplace",
										description:
											"Trade tokenized digital content and AI models",
									},
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
