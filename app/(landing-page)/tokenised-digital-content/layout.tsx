import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tokenised Digital Content - Monetize Your Creative Assets",
	description:
		"Transform your digital content into valuable tokenized assets. Create, trade, and monetize digital content including images, videos, documents, and more on blockchain.",
	keywords: [
		"tokenized digital content",
		"digital content tokenization",
		"content monetization",
		"digital asset tokenization",
		"content NFTs",
		"blockchain content",
		"digital content marketplace",
		"tokenize content",
		"creative asset tokenization",
		"digital media tokens",
		"content creator economy",
		"decentralized content",
	],
	openGraph: {
		title:
			"Tokenised Digital Content - Monetize Your Creative Assets | Portdex",
		description:
			"Transform your digital content into valuable tokenized assets. Create, trade, and monetize digital content on blockchain.",
		type: "website",
		url: "https://chat.vercel.ai/tokenised-digital-content",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Tokenised Digital Content on Portdex",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title:
			"Tokenised Digital Content - Monetize Your Creative Assets | Portdex",
		description:
			"Transform your digital content into valuable tokenized assets on blockchain.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/tokenised-digital-content",
	},
};

export default function TokenisedDigitalContentLayout({
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
						name: "Digital Content Tokenization",
						description:
							"Transform digital content into valuable tokenized blockchain assets",
						url: "https://chat.vercel.ai/tokenised-digital-content",
						provider: {
							"@type": "Organization",
							name: "Portdex",
							logo: "https://chat.vercel.ai/logo.webp",
						},
						serviceType: "Digital Content Tokenization Service",
						areaServed: "Worldwide",
						hasOfferCatalog: {
							"@type": "OfferCatalog",
							name: "Digital Content Tokenization Services",
							itemListElement: [
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Image Tokenization",
										description:
											"Transform digital images into blockchain tokens",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Video Tokenization",
										description: "Convert videos into tradeable digital assets",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Document Tokenization",
										description: "Tokenize documents and written content",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Creative Asset Trading",
										description:
											"Trade tokenized creative content in marketplace",
									},
								},
							],
						},
						audience: {
							"@type": "Audience",
							audienceType: "Content Creators",
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
									name: "Tokenised Digital Content",
									item: "https://chat.vercel.ai/tokenised-digital-content",
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
