'use client';

import { Timeline } from '@/components/animation/timeline';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Target } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/animation-constant';
import React from 'react';

interface RoadmapData {
  title: string;
  content: React.ReactNode;
}

// Move data outside component to prevent recreation on every render
const ROADMAP_DATA: RoadmapData[] = [
  {
    title: 'June 2025',
    content: (
      <div>
        <h3 className="text-black dark:text-white text-xl font-normal mb-4">
          Portdex.ai Beta Test Net (Blockchain Integration)
        </h3>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          <strong>Launch of Portdex.ai Beta Test Net</strong>
        </p>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
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
    title: 'September 2025',
    content: (
      <div>
        <h3 className="text-black dark:text-white text-xl font-normal mb-4">
          Developer Governed Marketplace Launch
        </h3>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          <strong>Marketplace Goes Live</strong>
        </p>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
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
    title: 'December 2025',
    content: (
      <div>
        <h3 className="text-black dark:text-white text-xl font-normal mb-4">
          Final Large Language Model (LLM) Release
        </h3>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          <strong>Portdex AI LLM Final Version</strong>
        </p>
        <p className="text-black dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
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

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto flex flex-col items-center justify-center px-4 text-center relative"
      >
        <motion.div
          variants={fadeIn}
          custom={1}
          className="max-w-4xl space-y-6 md:space-y-8"
        >
          <motion.div
            variants={fadeIn}
            custom={1}
            className="w-full flex justify-center py-2"
          >
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-lg px-4 py-2">
              <Calendar className="size-4 mr-2" />
              Our Journey
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            custom={2}
            className="text-center font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-purple-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
              Portdex Roadmap
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            custom={3}
            className="max-w-2xl text-base mx-auto text-muted-foreground sm:text-lg md:text-xl text-center"
          >
            Discover our strategic milestones and vision for the future of AI
            agent development and blockchain integration. Follow our journey as
            we revolutionize the digital landscape.
          </motion.p>

          <motion.div
            variants={fadeIn}
            custom={4}
            className="flex flex-wrap justify-center gap-6 pt-6"
          >
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <Target className="size-4" />
              <span className="font-medium">Strategic Vision</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <MapPin className="size-4" />
              <span className="font-medium">Clear Milestones</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <Calendar className="size-4" />
              <span className="font-medium">2025 Timeline</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const RoadmapPage = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full mx-auto">
      <Navbar />
      <HeroSection />
      <Timeline data={ROADMAP_DATA} />
    </div>
  );
};

export default React.memo(RoadmapPage);
