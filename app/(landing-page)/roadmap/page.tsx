"use client";

import { Timeline } from "@/components/animation/timeline";
import { Navbar } from "@/components/navbar";
// import Image from "next/image";
import React from "react";

interface RoadmapData {
	title: string;
	content: React.ReactNode;
}

// Move data outside component to prevent recreation on every render
const ROADMAP_DATA: RoadmapData[] = [
	{
		title: "June 2025",
		content: (
			<div>
				<h3 className="text-white text-xl font-normal mb-4">
					Portdex.ai Beta Test Net (Blockchain Integration)
				</h3>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
					<strong>Launch of Portdex.ai Beta Test Net</strong>
				</p>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
					The initial beta release of Portdex.ai will include blockchain
					integration, enabling developers and businesses to begin testing the
					platform&apos;s core features. This phase will focus on AI agent
					deployment, blockchain protocol integration, and cross-chain asset
					functionality. Users will have the opportunity to provide feedback to
					refine and improve the platform before the full launch.
				</p>
			</div>
		),
	},
	{
		title: "September 2025",
		content: (
			<div>
				<h3 className="text-white text-xl font-normal mb-4">
					Developer Governed Marketplace Launch
				</h3>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
					<strong>Marketplace Goes Live</strong>
				</p>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
					The Portdex Marketplace will officially launch, providing content
					creators, developers, and businesses a free space to list, sell, and
					collaborate on AI agents and digital content. The marketplace will
					support the listing and exchange of tokenized assets, with
					blockchain-backed traceability for each transaction. This milestone
					will open new opportunities for content monetization and collaboration
					within the Portdex ecosystem.
				</p>
			</div>
		),
	},
	{
		title: "December 2025",
		content: (
			<div>
				<h3 className="text-white text-xl font-normal mb-4">
					Final Large Language Model (LLM) Release
				</h3>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
					<strong>Portdex AI LLM Final Version</strong>
				</p>
				<p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
					Portdex will release the final version of its Large Language Model
					(LLM) integrated into the platform. This advanced AI model will
					enhance content creation, automation, and AI agent development,
					providing businesses and developers with an even more powerful tool to
					build sophisticated agents and applications. The LLM will be optimized
					for both centralized and decentralized environments, making it a
					versatile tool for a wide range of industries.
				</p>
			</div>
		),
	},
] as const;

const RoadmapPage = (): JSX.Element => {
	return (
		<div className="w-full">
			<Navbar />
			<Timeline data={ROADMAP_DATA} />
		</div>
	);
};

export default React.memo(RoadmapPage);
