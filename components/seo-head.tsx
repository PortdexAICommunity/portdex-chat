import Head from "next/head";

interface SEOProps {
	title?: string;
	description?: string;
	canonicalUrl?: string;
	keywords?: string[];
	ogImage?: string;
	ogType?: "website" | "article" | "product";
	twitterCard?: "summary" | "summary_large_image";
	structuredData?: object;
	noIndex?: boolean;
	noFollow?: boolean;
}

export const SEOHead: React.FC<SEOProps> = ({
	title,
	description,
	canonicalUrl,
	keywords = [],
	ogImage = "/hero.png",
	ogType = "website",
	twitterCard = "summary_large_image",
	structuredData,
	noIndex = false,
	noFollow = false,
}) => {
	const fullTitle = title
		? `${title} | Portdex Chat`
		: "Portdex Chat - AI-Powered Blockchain Marketplace";
	const metaDescription =
		description ||
		"Revolutionary AI-powered platform combining chatbot technology with blockchain marketplace features. Create, tokenize, and trade AI agents.";

	const robotsContent = `${noIndex ? "noindex" : "index"}, ${
		noFollow ? "nofollow" : "follow"
	}`;

	return (
		<Head>
			{/* Primary Meta Tags */}
			<title>{fullTitle}</title>
			<meta name="title" content={fullTitle} />
			<meta name="description" content={metaDescription} />
			<meta name="robots" content={robotsContent} />

			{keywords.length > 0 && (
				<meta name="keywords" content={keywords.join(", ")} />
			)}

			{/* Canonical URL */}
			{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={ogType} />
			<meta
				property="og:url"
				content={canonicalUrl || "https://chat.vercel.ai"}
			/>
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:site_name" content="Portdex Chat" />
			<meta property="og:locale" content="en_US" />

			{/* Twitter */}
			<meta property="twitter:card" content={twitterCard} />
			<meta
				property="twitter:url"
				content={canonicalUrl || "https://chat.vercel.ai"}
			/>
			<meta property="twitter:title" content={fullTitle} />
			<meta property="twitter:description" content={metaDescription} />
			<meta property="twitter:image" content={ogImage} />
			<meta property="twitter:creator" content="@portdex" />
			<meta property="twitter:site" content="@portdex" />

			{/* Structured Data */}
			{structuredData && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
			)}

			{/* Additional Meta Tags */}
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
			/>
			<meta name="theme-color" content="#000000" />
			<meta name="msapplication-TileColor" content="#000000" />
			<meta
				name="format-detection"
				content="telephone=no, email=no, address=no"
			/>
		</Head>
	);
};

export default SEOHead;
