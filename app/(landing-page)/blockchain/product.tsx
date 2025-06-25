"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Products = () => {
	const products = [
		{
			id: "traceability",
			title: "Blockchain AI Asset Traceability",
			description:
				"Portdex AI uses blockchain to ensure the traceability of AI assets, allowing businesses to track the origin, updates, and ownership of digital content with transparency and security.",
			icon: "🧩",
			category: "Security",
			gradient: "from-blue-500 to-purple-600",
		},
		{
			id: "ipownership",
			title: "IP Ownership",
			description:
				"Blockchain enables clear and secure intellectual property (IP) ownership for AI assets, ensuring that creators and businesses maintain control over their work and digital creations.",
			icon: "📄",
			category: "Legal",
			gradient: "from-green-500 to-teal-600",
		},
		{
			id: "protocolintegration",
			title: "Blockchain Protocol Integration",
			description:
				"Portdex AI integrates multiple blockchain protocols to provide seamless interaction across different blockchain networks, ensuring greater interoperability and flexibility for developers and businesses.",
			icon: "🔗",
			category: "Integration",
			gradient: "from-orange-500 to-red-600",
		},
		{
			id: "crosschain",
			title: "Cross-Chain Assets",
			description:
				"With cross-chain asset support, Portdex AI facilitates the movement and exchange of digital assets across various blockchain ecosystems, enhancing the accessibility and flexibility of AI solutions.",
			icon: "🔄",
			category: "Interoperability",
			gradient: "from-purple-500 to-pink-600",
		},
		{
			id: "tokenizedtraceability",
			title: "Tokenized Assets Traceability",
			description:
				"Blockchain ensures that tokenized assets on Portdex AI are traceable, providing a transparent history of transactions, transfers, and ownership for every asset listed on the platform.",
			icon: "🧾",
			category: "Transparency",
			gradient: "from-cyan-500 to-blue-600",
		},
		{
			id: "tokenizationai",
			title: "Tokenization of Assets Through AI on Blockchain",
			description:
				"Portdex AI uses artificial intelligence to automate the tokenization of assets, securely recording ownership and transaction history on the blockchain, allowing for efficient management and exchange of digital assets.",
			icon: "🤖",
			category: "AI & Blockchain",
			gradient: "from-indigo-500 to-purple-600",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
						Blockchain Integration in Portdex
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Discover how blockchain technology powers our AI platform with
						transparency, security, and innovation.
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{products.map((product) => (
						<motion.div
							key={product.id}
							variants={itemVariants}
							whileHover={{ y: -5, scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="cursor-pointer h-full"
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default Products;

interface ProductCardProps {
	product: {
		id: string;
		title: string;
		description: string;
		icon: string;
		category: string;
		gradient: string;
	};
}

const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Card className="h-full bg-card hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-primary/30 group border-border flex flex-col">
			<CardHeader className="pb-3 flex-shrink-0">
				{/* Icon with gradient background */}
				<div
					className={`h-16 w-full bg-gradient-to-r ${product.gradient} rounded-lg mb-3 relative overflow-hidden`}
				>
					<div className="absolute inset-0 bg-black/10" />
					<div className="absolute -bottom-2 -right-2 size-10 bg-card rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-border">
						{product.icon}
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0 flex-1 flex flex-col">
				<h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-2 leading-tight">
					{product.title}
				</h3>

				<p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
					{product.description}
				</p>

				<div className="flex items-center justify-between gap-2 mt-auto pt-2">
					<Badge
						variant="secondary"
						className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs flex-shrink-0"
					>
						{product.category}
					</Badge>

					<motion.div
						className="text-primary text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0"
						initial={{ opacity: 0.7 }}
						whileHover={{ opacity: 1 }}
					>
						Learn more →
					</motion.div>
				</div>
			</CardContent>
		</Card>
	);
};
