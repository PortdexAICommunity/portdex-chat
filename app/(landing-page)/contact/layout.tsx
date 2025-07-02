import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us - Get in Touch with Portdex Team",
	description:
		"Contact Portdex for support, partnerships, or inquiries about our AI agent marketplace and blockchain technology solutions. We're here to help with your questions.",
	keywords: [
		"contact portdex",
		"customer support",
		"AI marketplace support",
		"blockchain help",
		"business inquiries",
		"partnerships",
		"technical support",
		"get in touch",
		"portdex team",
		"AI agent support",
		"marketplace assistance",
		"contact form",
	],
	openGraph: {
		title: "Contact Us - Get in Touch with Portdex Team",
		description:
			"Contact Portdex for support, partnerships, or inquiries about our AI agent marketplace and blockchain solutions.",
		type: "website",
		url: "https://chat.vercel.ai/contact",
		images: [
			{
				url: "/hero.png",
				width: 1200,
				height: 630,
				alt: "Contact Portdex Team",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Us - Get in Touch with Portdex Team",
		description:
			"Contact Portdex for support, partnerships, or inquiries about our AI marketplace.",
		images: ["/hero.png"],
	},
	alternates: {
		canonical: "https://chat.vercel.ai/contact",
	},
};

export default function ContactLayout({
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
						"@type": "ContactPage",
						name: "Contact Portdex",
						description:
							"Get in touch with Portdex team for support and inquiries",
						url: "https://chat.vercel.ai/contact",
						mainEntity: {
							"@type": "Organization",
							name: "Portdex",
							url: "https://chat.vercel.ai",
							logo: "https://chat.vercel.ai/logo.webp",
							contactPoint: [
								{
									"@type": "ContactPoint",
									contactType: "customer service",
									availableLanguage: ["English"],
									areaServed: "Worldwide",
								},
								{
									"@type": "ContactPoint",
									contactType: "technical support",
									availableLanguage: ["English"],
									areaServed: "Worldwide",
								},
								{
									"@type": "ContactPoint",
									contactType: "sales",
									availableLanguage: ["English"],
									areaServed: "Worldwide",
								},
							],
							sameAs: [
								"https://twitter.com/portdex",
								"https://github.com/portdex",
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
									name: "Contact",
									item: "https://chat.vercel.ai/contact",
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
