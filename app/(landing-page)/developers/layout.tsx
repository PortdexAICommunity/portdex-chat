import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Join Our Developer Community - AI & Software Innovation",
	description:
		"Sign up, contribute, and earn! Join a thriving ecosystem of AI developers and software creators shaping the future of technology. Collaborate, monetize innovations, and expand globally.",
	keywords: [
		"developer community",
		"AI developers",
		"software creators",
		"developer portal",
		"API documentation",
		"AI development tools",
		"blockchain developers",
		"contribute to AI",
		"developer rewards",
		"coding community",
		"open source AI",
		"developer ecosystem",
		"AI innovation community",
	],
	openGraph: {
		title: "Join Our Developer Community - AI & Software Innovation | Portdex",
		description:
			"Join a thriving ecosystem of AI developers and software creators. Collaborate, monetize innovations, and shape the future of AI technology.",
		type: "website",
		url: "https://chat.vercel.ai/developers",
		images: [
			{
				url: "/developer-image-2.jpeg",
				width: 1200,
				height: 630,
				alt: "Portdex Developer Community",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Join Our Developer Community - AI & Software Innovation | Portdex",
		description:
			"Join a thriving ecosystem of AI developers and software creators.",
		images: ["/developer-image-2.jpeg"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/developers",
	},
};

export default function DevelopersLayout({
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
						name: "Developer Community",
						description:
							"Join Portdex developer community for AI and software innovation",
						url: "https://chat.vercel.ai/developers",
						mainEntity: {
							"@type": "Organization",
							name: "Portdex Developer Community",
							description:
								"A thriving ecosystem of AI developers and software creators",
							url: "https://chat.vercel.ai/developers",
							memberOf: {
								"@type": "Organization",
								name: "Portdex",
							},
						},
						about: [
							{
								"@type": "Thing",
								name: "AI Development",
								description:
									"Artificial Intelligence development tools and resources",
							},
							{
								"@type": "Thing",
								name: "Blockchain Development",
								description:
									"Smart contract and blockchain application development",
							},
							{
								"@type": "Thing",
								name: "Developer Tools",
								description: "APIs, SDKs, and development frameworks",
							},
						],
						offers: {
							"@type": "Offer",
							name: "Developer Program",
							description:
								"Join our developer community and earn rewards for contributions",
							category: "Developer Services",
						},
					}),
				}}
			/>
			{children}
		</>
	);
}
