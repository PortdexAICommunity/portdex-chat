import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blockchain Technology - Secure AI Asset Protection",
	description:
		"Discover how Portdex leverages blockchain technology to enhance asset traceability, ensure IP ownership, and integrate cross-chain capabilities for AI agents and tokenized assets.",
	keywords: [
		"blockchain AI",
		"asset traceability",
		"IP ownership blockchain",
		"cross-chain AI",
		"blockchain security",
		"AI asset protection",
		"smart contracts AI",
		"decentralized AI storage",
		"blockchain transparency",
		"tokenized assets",
		"AI intellectual property",
		"distributed ledger AI",
	],
	openGraph: {
		title: "Blockchain Technology - Secure AI Asset Protection | Portdex",
		description:
			"Leverage blockchain technology for enhanced asset traceability, IP ownership, and cross-chain capabilities in AI marketplace.",
		type: "website",
		url: "https://chat.vercel.ai/blockchain",
		images: [
			{
				url: "/blockchain-image.png",
				width: 1200,
				height: 630,
				alt: "Portdex Blockchain Technology for AI Assets",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blockchain Technology - Secure AI Asset Protection | Portdex",
		description:
			"Leverage blockchain technology for enhanced asset traceability and IP ownership in AI marketplace.",
		images: ["/blockchain-image.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/blockchain",
	},
};

export default function BlockchainLayout({
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
						"@type": "TechArticle",
						headline: "Blockchain Technology for AI Asset Protection",
						description:
							"How Portdex leverages blockchain technology to enhance asset traceability, ensure IP ownership, and integrate cross-chain capabilities",
						url: "https://chat.vercel.ai/blockchain",
						publisher: {
							"@type": "Organization",
							name: "Portdex",
							logo: "https://chat.vercel.ai/logo.webp",
						},
						mainEntity: {
							"@type": "WebPage",
							name: "Blockchain Technology Solutions",
							description:
								"Comprehensive blockchain solutions for AI asset protection and tokenization",
						},
						about: [
							{
								"@type": "Thing",
								name: "Blockchain Technology",
								description:
									"Distributed ledger technology for secure AI asset management",
							},
							{
								"@type": "Thing",
								name: "Asset Traceability",
								description:
									"Transparent tracking of AI assets throughout their lifecycle",
							},
							{
								"@type": "Thing",
								name: "IP Ownership",
								description:
									"Blockchain-verified intellectual property rights for AI creators",
							},
						],
					}),
				}}
			/>
			{children}
		</>
	);
}
