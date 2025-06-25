"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	ArrowRight,
	BrainCircuit,
	CheckCircle,
	Code,
	Coins,
	Cog,
	Gamepad2,
	Link as LinkIcon,
	Network,
	Puzzle,
	Upload,
	Zap,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

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
				className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-600 to-purple-600 dark:from-lime-400 dark:to-purple-400 pb-2"
			>
				Empower Your AI Agent with Blockchain
			</motion.h1>
			<motion.p
				variants={fadeInUp}
				className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
			>
				Seamlessly bring your AI agent to the decentralized world. Create,
				import, and tokenize your AI agent to unlock new revenue streams and
				integrate with blockchain-based platforms.
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
					Learn How It Works <ArrowRight className="ml-2 size-5" />
				</Button>
			</motion.div>
		</div>
	</motion.section>
);

const KeyFeaturesSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-8 md:py-24"
	>
		<div className="container mx-auto px-4">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
				Key Features
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{/* Feature 1 */}
				<motion.div variants={fadeInUp}>
					<Card className="h-full hover:shadow-lg transition-shadow bg-white/20 border-purple-700/50 duration-300">
						<CardHeader>
							<div className="flex items-center justify-center size-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
								<Cog className="size-6 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle>Create or Import Agent</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							Easily build a new AI agent or import an existing one. Customize
							its persona, capabilities, and skills.
							<ul className="mt-2 list-disc list-inside text-sm">
								<li>Drag-and-drop builder or JSON import</li>
								<li>LLM & rule-based support</li>
								<li>Fine-tune with custom data</li>
							</ul>
						</CardContent>
					</Card>
				</motion.div>
				{/* Feature 2 */}
				<motion.div variants={fadeInUp}>
					<Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/20 border-purple-700/50">
						<CardHeader>
							<div className="flex items-center justify-center size-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
								<Puzzle className="size-6 text-purple-600 dark:text-purple-400" />
							</div>
							<CardTitle>Tokenize Your AI Agent</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							Convert your AI agent into a blockchain-based asset (NFT or
							token), making it a tradable, ownable digital entity.
							<ul className="mt-2 list-disc list-inside text-sm">
								<li>ERC-721 or ERC-1155 tokens</li>
								<li>Metadata & ownership</li>
								<li>Secure smart contract</li>
							</ul>
						</CardContent>
					</Card>
				</motion.div>
				{/* Feature 3 */}
				<motion.div variants={fadeInUp}>
					<Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/20 border-purple-700/50">
						<CardHeader>
							<div className="flex items-center justify-center size-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
								<Coins className="size-6 text-green-600 dark:text-green-400" />
							</div>
							<CardTitle>Monetize with Blockchain</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							Set usage fees, subscriptions, or pay-per-call pricing. Receive
							revenue in crypto directly.
							<ul className="mt-2 list-disc list-inside text-sm">
								<li>Metered access/licensing</li>
								<li>Earn via crypto/stablecoins</li>
								<li>On-chain usage metrics</li>
							</ul>
						</CardContent>
					</Card>
				</motion.div>
				{/* Feature 4 */}
				<motion.div variants={fadeInUp}>
					<Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/20 border-purple-700/50">
						<CardHeader>
							<div className="flex items-center justify-center size-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
								<LinkIcon className="size-6 text-yellow-600 dark:text-yellow-400" />
							</div>
							<CardTitle>Integrate Ecosystems</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							Plug your agent into dApps, DAOs, or smart contracts, making AI
							part of decentralized workflows.
							<ul className="mt-2 list-disc list-inside text-sm">
								<li>Connect via Web3 APIs</li>
								<li>Add AI logic to contracts</li>
								<li>On/off-chain triggers</li>
							</ul>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	</motion.section>
);

const HowItWorksSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-24"
	>
		<div className="container mx-auto px-4">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
				How It Works
			</h2>
			<div className="relative">
				{/* Connecting line (visible on larger screens) */}
				<div
					className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-purple-700/50 -translate-y-1/2"
					style={{ zIndex: 0 }}
				></div>

				<div
					className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16"
					style={{ zIndex: 1 }}
				>
					{/* Step 1 */}
					<motion.div
						variants={fadeInUp}
						className="text-center flex flex-col items-center"
					>
						<div className="bg-background dark:bg-gray-800 p-2 rounded-full mb-4 border border-gray-300 dark:border-gray-700">
							<div className="flex items-center justify-center size-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
								<Upload className="size-8" />
							</div>
						</div>
						<h3 className="text-xl font-semibold mb-2">1. Create or Import</h3>
						<p className="text-muted-foreground text-sm">
							Define agent capabilities or bring an existing one.
						</p>
					</motion.div>
					{/* Step 2 */}
					<motion.div
						variants={fadeInUp}
						className="text-center flex flex-col items-center"
					>
						<div className="bg-background dark:bg-gray-800 p-2 rounded-full mb-4 border border-gray-300 dark:border-gray-700">
							<div className="flex items-center justify-center size-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
								<Puzzle className="size-8" />
							</div>
						</div>
						<h3 className="text-xl font-semibold mb-2">2. Tokenize</h3>
						<p className="text-muted-foreground text-sm">
							Use our UI or SDK to issue a tokenized version.
						</p>
					</motion.div>
					{/* Step 3 */}
					<motion.div
						variants={fadeInUp}
						className="text-center flex flex-col items-center"
					>
						<div className="bg-background dark:bg-gray-800 p-2 rounded-full mb-4 border border-gray-300 dark:border-gray-700">
							<div className="flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
								<Network className="size-8" />
							</div>
						</div>
						<h3 className="text-xl font-semibold mb-2">3. Deploy</h3>
						<p className="text-muted-foreground text-sm">
							Choose your preferred chain and deploy.
						</p>
					</motion.div>
					{/* Step 4 */}
					<motion.div
						variants={fadeInUp}
						className="text-center flex flex-col items-center"
					>
						<div className="bg-background dark:bg-gray-800 p-2 rounded-full mb-4 border border-gray-300 dark:border-gray-700">
							<div className="flex items-center justify-center size-16 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
								<Coins className="size-8" />
							</div>
						</div>
						<h3 className="text-xl font-semibold mb-2">4. Monetize & Share</h3>
						<p className="text-muted-foreground text-sm">
							Set rules, integrate, share, or sell your AI.
						</p>
					</motion.div>
				</div>
			</div>
		</div>
	</motion.section>
);

const UseCasesSection = () => (
	<motion.section
		initial="initial"
		whileInView="animate"
		viewport={{ once: true, amount: 0.2 }}
		variants={stagger}
		className="py-16 md:py-24"
	>
		<div className="container mx-auto px-4">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
				Use Cases
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{ icon: Gamepad2, text: "In-Game AI NPCs you can trade" },
					{
						icon: BrainCircuit,
						text: "Knowledge bots for decentralized learning",
					},
					{
						icon: Code,
						text: "Developer agents with pay-per-query pricing",
					},
					{
						icon: CheckCircle,
						text: "Legal or medical expert AIs as NFT assets",
					},
				].map((useCase, index) => (
					<motion.div variants={fadeInUp} key={index}>
						<Card className="h-full text-center p-6 hover:shadow-md transition-shadow duration-300 bg-white/20">
							<useCase.icon className="size-10 text-purple-600 mx-auto mb-4" />
							<p className="font-medium">{useCase.text}</p>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	</motion.section>
);

const TokenizedAiAgentPage = () => {
	return (
		<div className="min-h-screen w-full mx-auto">
			<Navbar />
			<HeroSection />
			<KeyFeaturesSection />
			<HowItWorksSection />
			<UseCasesSection />
			{/* <CTASection /> */}
		</div>
	);
};

export default TokenizedAiAgentPage;
