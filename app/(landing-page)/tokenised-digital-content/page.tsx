"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Brush,
	ChevronRight,
	Coins,
	FileText,
	FilmIcon,
	LockKeyhole,
	Music,
	ShieldCheck,
	Upload,
	Zap,
	Newspaper,
	BarChart,
	PenTool,
	Eye,
	DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

// Animation variants
const fadeInUp = {
	initial: { opacity: 0, y: 60 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.5,
		},
	},
};

const HeroSection = () => (
	<motion.section
		initial="initial"
		animate="animate"
		variants={stagger}
		className="relative overflow-hidden py-12 md:py-20 lg:py-28"
	>
		{/* Background gradient elements */}
		<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
		<div
			className="absolute inset-0"
			style={{
				background:
					"linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
				backgroundSize: "24px 24px",
			}}
		/>

		<div className="container mx-auto px-4 text-center relative">
			<motion.h1
				variants={fadeInUp}
				className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 pb-2"
			>
				AI for Tokenizing Your Digital Content
			</motion.h1>
			<motion.p
				variants={fadeInUp}
				className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
			>
				Empower yourself to import, tokenize, monetize, and generate digital
				content using advanced AI and secure blockchain technology.
			</motion.p>
			<motion.div
				variants={fadeInUp}
				className="flex flex-col sm:flex-row justify-center gap-4"
			>
				<Button
					size="lg"
					variant="ghost"
					className="hover:bg-purple-200 hover:text-purple-800"
				>
					Learn More <ArrowRight className="ml-2 size-5" />
				</Button>
			</motion.div>
		</div>
	</motion.section>
);

const WhatIsTokenizationSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-24 bg-gradient-to-b from-transparent to-purple-950/10"
	>
		<div className="container mx-auto px-4">
			<motion.div
				variants={fadeInUp}
				className="max-w-3xl mx-auto text-center mb-16"
			>
				<h2 className="text-3xl md:text-4xl font-bold mb-6">
					<span className="text-purple-500 dark:text-purple-400">🧠</span> What
					is Tokenization of Digital Content?
				</h2>
				<p className="text-lg text-muted-foreground">
					Tokenizing digital content transforms your files—art, music, videos,
					documents, and more—into unique, tradable digital assets on the
					blockchain, establishing verifiable ownership and authenticity.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
				<motion.div
					variants={fadeInUp}
					className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 shadow-sm"
				>
					<div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
						<ShieldCheck className="size-6 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 className="text-xl font-semibold mb-3">Proof of Ownership</h3>
					<p className="text-muted-foreground">
						Establish indisputable proof of ownership for your digital creations
						through blockchain&apos;s immutable ledger, protecting your
						intellectual property rights.
					</p>
				</motion.div>

				<motion.div
					variants={fadeInUp}
					className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 shadow-sm"
				>
					<div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
						<LockKeyhole className="size-6 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 className="text-xl font-semibold mb-3">
						Authentication & Traceability
					</h3>
					<p className="text-muted-foreground">
						Every digital asset comes with built-in verification, making it easy
						to prove authenticity and track the complete ownership history from
						creation to present.
					</p>
				</motion.div>

				<motion.div
					variants={fadeInUp}
					className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 shadow-sm"
				>
					<div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
						<Coins className="size-6 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 className="text-xl font-semibold mb-3">
						Smart Contract Royalties
					</h3>
					<p className="text-muted-foreground">
						Automatically receive payments whenever your content is resold or
						reused, with smart contracts ensuring you benefit from the future
						value of your work.
					</p>
				</motion.div>

				<motion.div
					variants={fadeInUp}
					className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 shadow-sm"
				>
					<div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
						<Eye className="size-6 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 className="text-xl font-semibold mb-3">Increased Visibility</h3>
					<p className="text-muted-foreground">
						Gain access to global blockchain marketplaces and communities,
						expanding your audience and opening new opportunities for discovery
						and collaboration.
					</p>
				</motion.div>
			</div>
		</div>
	</motion.section>
);

const ImportContentSection = () => (
	<motion.section
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true, amount: 0.2 }}
		variants={containerVariants}
		className="py-16 md:py-24"
	>
		<div className="container mx-auto px-4">
			<div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
				<motion.div variants={itemVariants} className="md:w-1/2">
					<div className="h-80 bg-gradient-to-br from-purple-700/20 to-pink-700/30 rounded-xl flex items-center justify-center p-8">
						<div className="grid grid-cols-3 gap-4 w-full max-w-xs">
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<Brush className="size-8 text-purple-400" />
							</div>
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<Music className="size-8 text-purple-400" />
							</div>
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<FilmIcon className="size-8 text-purple-400" />
							</div>
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<FileText className="size-8 text-purple-400" />
							</div>
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<Upload className="size-8 text-purple-400" />
							</div>
							<div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
								<Newspaper className="size-8 text-purple-400" />
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div variants={itemVariants} className="md:w-1/2">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						<span className="text-purple-500 dark:text-purple-400">📥</span>{" "}
						Import Your Digital Content
					</h2>
					<p className="text-lg text-muted-foreground mb-6">
						Our platform supports a wide range of digital formats for seamless
						tokenization. Simply upload your content and let our AI handle the
						rest.
					</p>
					<ul className="space-y-3">
						{[
							"Support for various formats: images, videos, audio, PDFs, and more",
							"AI-powered auto-tagging and categorization",
							"Automated metadata generation for enhanced discoverability",
							"Batch uploads for efficient processing of multiple items",
							"Intuitive interface designed for creators, not developers",
						].map((item, i) => (
							<li key={i} className="flex items-start">
								<ChevronRight className="size-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
								<span className="text-muted-foreground">{item}</span>
							</li>
						))}
					</ul>
					<Button className="mt-8" variant="outline">
						Explore Supported Formats
					</Button>
				</motion.div>
			</div>
		</div>
	</motion.section>
);

const TokenizeAndMonetizeSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-24 bg-gradient-to-b from-purple-950/10 to-transparent"
	>
		<div className="container mx-auto px-4">
			<div className="text-center max-w-3xl mx-auto mb-16">
				<motion.h2
					variants={fadeInUp}
					className="text-3xl md:text-4xl font-bold mb-6"
				>
					<span className="text-purple-500 dark:text-purple-400">🪙</span>{" "}
					Tokenize and Monetize
				</motion.h2>
				<motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
					Transform your digital content into blockchain-verified assets and
					unlock multiple revenue streams with our comprehensive monetization
					tools.
				</motion.p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				<Card className="bg-white/5 border-purple-900/20">
					<CardHeader>
						<div className="mb-2 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
							<Coins className="size-6 text-purple-600 dark:text-purple-400" />
						</div>
						<CardTitle>Blockchain Integration</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground">
						<p className="mb-4">
							Seamlessly mint tokens from your content on popular blockchains
							with just a few clicks.
						</p>
						<ul className="space-y-2 text-sm">
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Support for multiple blockchain networks</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>NFT and fungible token standards</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Gas-optimized smart contracts</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card className="bg-white/5 border-purple-900/20">
					<CardHeader>
						<div className="mb-2 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
							<PenTool className="size-6 text-purple-600 dark:text-purple-400" />
						</div>
						<CardTitle>Customizable Parameters</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground">
						<p className="mb-4">
							Define exactly how your content works with flexible tokenization
							options.
						</p>
						<ul className="space-y-2 text-sm">
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Set ownership percentages and splits</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Configure resale royalties</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Create unlockable premium content</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card className="bg-white/5 border-purple-900/20">
					<CardHeader>
						<div className="mb-2 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
							<BarChart className="size-6 text-purple-600 dark:text-purple-400" />
						</div>
						<CardTitle>Smart Analytics</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground">
						<p className="mb-4">
							Track performance and monetization in real-time with advanced
							analytics.
						</p>
						<ul className="space-y-2 text-sm">
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Real-time sales and engagement metrics</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Audience demographic insights</span>
							</li>
							<li className="flex items-start">
								<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
								<span>Performance optimization suggestions</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	</motion.section>
);

const MonetizationOptionsSection = () => (
	<motion.section
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true, amount: 0.2 }}
		variants={containerVariants}
		className="py-16 md:py-24"
	>
		<div className="container mx-auto px-4">
			<div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto">
				<motion.div variants={itemVariants} className="md:w-1/2">
					<div className="h-80 bg-gradient-to-r from-purple-700/20 to-purple-900/30 rounded-xl flex items-center justify-center p-6">
						<div className="grid grid-cols-1 gap-6 w-full max-w-xs">
							<div className="p-4 bg-white/10 rounded-lg flex items-center justify-between">
								<div>
									<h4 className="font-medium text-white">Direct Sales</h4>
									<p className="text-xs text-purple-300">One-time purchase</p>
								</div>
								<DollarSign className="size-6 text-purple-400" />
							</div>
							<div className="p-4 bg-white/10 rounded-lg flex items-center justify-between">
								<div>
									<h4 className="font-medium text-white">Subscriptions</h4>
									<p className="text-xs text-purple-300">Recurring access</p>
								</div>
								<DollarSign className="size-6 text-purple-400" />
							</div>
							<div className="p-4 bg-white/10 rounded-lg flex items-center justify-between">
								<div>
									<h4 className="font-medium text-white">Royalties</h4>
									<p className="text-xs text-purple-300">Secondary sales</p>
								</div>
								<DollarSign className="size-6 text-purple-400" />
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div variants={itemVariants} className="md:w-1/2">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						<span className="text-purple-500 dark:text-purple-400">💸</span>{" "}
						Monetization Options
					</h2>
					<p className="text-lg text-muted-foreground mb-6">
						Choose from multiple monetization models or combine them to maximize
						your earnings potential.
					</p>
					<ul className="space-y-4">
						{[
							{
								title: "Direct Sales",
								desc: "Sell content directly to buyers using fiat or cryptocurrency payments.",
							},
							{
								title: "Subscription Access",
								desc: "Set up recurring access fees for premium content or collections.",
							},
							{
								title: "Tiered Content",
								desc: "Create exclusive content tiers with early access and premium features.",
							},
							{
								title: "Usage-Based Licensing",
								desc: "Earn based on how others use your content with smart contract automation.",
							},
						].map((item, i) => (
							<li
								key={i}
								className="bg-white/5 rounded-lg p-4 border border-purple-900/20"
							>
								<h3 className="font-semibold mb-1">{item.title}</h3>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</li>
						))}
					</ul>
				</motion.div>
			</div>
		</div>
	</motion.section>
);

const AIContentGenerationSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-24 bg-gradient-to-b from-purple-950/10 to-transparent"
	>
		<div className="container mx-auto px-4">
			<motion.div
				variants={fadeInUp}
				className="max-w-3xl mx-auto text-center mb-16"
			>
				<h2 className="text-3xl md:text-4xl font-bold mb-6">
					<span className="text-purple-500 dark:text-purple-400">🛠</span> AI
					Content Generation
				</h2>
				<p className="text-lg text-muted-foreground">
					Leverage our AI tools to generate fresh content, enhance existing
					assets, or remix your creations into something entirely new.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{[
					{
						icon: (
							<Zap className="size-6 text-purple-600 dark:text-purple-400" />
						),
						title: "Generate New Content",
						desc: "Create original digital assets from text prompts or existing content samples.",
						features: [
							"Text-to-image generation",
							"Audio and music creation",
							"Article and script writing",
							"3D model generation",
						],
					},
					{
						icon: (
							<Brush className="size-6 text-purple-600 dark:text-purple-400" />
						),
						title: "Enhance Existing Assets",
						desc: "Improve your current digital content with AI-powered enhancements.",
						features: [
							"Image upscaling and restoration",
							"Audio noise reduction",
							"Video enhancement",
							"Document formatting and editing",
						],
					},
					{
						icon: (
							<PenTool className="size-6 text-purple-600 dark:text-purple-400" />
						),
						title: "Content Strategy",
						desc: "Get AI-driven insights to optimize your monetization approach.",
						features: [
							"Market trend analysis",
							"Pricing recommendations",
							"Audience targeting suggestions",
							"Content performance predictions",
						],
					},
				].map((item, i) => (
					<motion.div
						key={i}
						variants={fadeInUp}
						className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 shadow-sm"
					>
						<div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
							{item.icon}
						</div>
						<h3 className="text-xl font-semibold mb-3">{item.title}</h3>
						<p className="text-muted-foreground mb-4">{item.desc}</p>
						<ul className="space-y-2">
							{item.features.map((feature, j) => (
								<li key={j} className="flex items-start text-sm">
									<ChevronRight className="size-4 text-purple-500 mr-1 shrink-0 mt-0.5" />
									<span className="text-muted-foreground">{feature}</span>
								</li>
							))}
						</ul>
					</motion.div>
				))}
			</div>
		</div>
	</motion.section>
);

const SecurityAndOwnershipSection = () => (
	<motion.section
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true, amount: 0.2 }}
		variants={containerVariants}
		className="py-16 md:py-24"
	>
		<div className="container mx-auto px-4 max-w-4xl">
			<motion.div variants={itemVariants} className="text-center mb-12">
				<h2 className="text-3xl md:text-4xl font-bold mb-6">
					<span className="text-purple-500 dark:text-purple-400">🔒</span>{" "}
					Security and Ownership
				</h2>
				<p className="text-lg text-muted-foreground">
					Our platform prioritizes content security and true digital ownership,
					ensuring your assets remain protected and under your control.
				</p>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className="bg-white/5 backdrop-blur-md border border-purple-900/20 rounded-xl p-8 shadow-lg"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<div className="flex items-start mb-4">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
								<LockKeyhole className="size-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">Decentralized Storage</h3>
								<p className="text-sm text-muted-foreground">
									Content stored across distributed networks for maximum
									resilience and protection against single points of failure.
								</p>
							</div>
						</div>

						<div className="flex items-start mb-4">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
								<ShieldCheck className="size-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">User-Owned Keys</h3>
								<p className="text-sm text-muted-foreground">
									You maintain full custody of your private keys, ensuring only
									you can control and transfer your digital assets.
								</p>
							</div>
						</div>
					</div>

					<div>
						<div className="flex items-start mb-4">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
								<Eye className="size-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">Transparent Verification</h3>
								<p className="text-sm text-muted-foreground">
									Public blockchain verification allows anyone to confirm
									authenticity and ownership without revealing private
									information.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
								<Zap className="size-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">AI Plagiarism Detection</h3>
								<p className="text-sm text-muted-foreground">
									Advanced AI scans detect potential copyright issues and verify
									content originality before tokenization to protect creators.
								</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	</motion.section>
);

const CTASection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-32"
	>
		<div className="container mx-auto px-4">
			<motion.div
				variants={fadeInUp}
				className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-10 md:p-16 border border-purple-700/20"
			>
				<h2 className="text-3xl md:text-4xl font-bold mb-6">
					Ready to Transform Your Digital Content?
				</h2>
				<p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
					Join thousands of creators who are already leveraging AI and
					blockchain technology to monetize their digital assets in new and
					exciting ways.
				</p>
				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<Button
						size="lg"
						className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white"
					>
						Start Creating Now
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-purple-600 text-purple-100 hover:bg-purple-900/50"
					>
						Schedule a Demo
					</Button>
				</div>
			</motion.div>
		</div>
	</motion.section>
);

const TokenisedDigitalContentPage = () => {
	return (
		<div className="min-h-screen w-full mx-auto">
			<Navbar />
			<HeroSection />
			<WhatIsTokenizationSection />
			<ImportContentSection />
			<TokenizeAndMonetizeSection />
			<MonetizationOptionsSection />
			<AIContentGenerationSection />
			<SecurityAndOwnershipSection />
			{/* <CTASection /> */}
		</div>
	);
};

export default TokenisedDigitalContentPage;
