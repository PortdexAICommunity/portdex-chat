'use client';

import { AIModelsMarquee } from '@/components/ai-model-marquee';
import { FAQSection } from '@/components/faq';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  cardVariants,
  fadeIn,
  fadeInUp,
  imageReveal,
  staggerContainer,
} from '@/lib/animation-constant';
import {
  blockchainHelpItems,
  FAQS,
  featuresAboutUs,
  helpItems,
  TOOLS,
} from '@/lib/constant';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HowWeHelp from '../blockchain/how-we-help';

interface FeatureAboutUs {
  title: string;
  description: string;
  link: string;
}

interface HelpItem {
  icon: string;
  title: string;
  description: string;
}

interface Tool {
  title: string;
  description: string;
  image: string;
}

const AboutUsPage = () => {
  return (
    <div className="min-h-screen w-full mx-auto">
      <Navbar />
      <HeroSection />
      <Features />
      <Tools />
      <FAQSection faqs={FAQS} />
    </div>
  );
};

export default AboutUsPage;

const HeroSection = () => {
  const router = useRouter();
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
        className="container mx-auto px-4 relative"
      >
        <motion.div
          variants={fadeIn}
          custom={1}
          className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8"
        >
          <motion.h1
            variants={fadeIn}
            custom={2}
            className="font-bold tracking-tight leading-tight"
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Community-Governed
              </span>
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-2">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Agent Marketplace
              </span>
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-4 text-muted-foreground font-medium">
              Tokenize Intelligence, Empower Innovation
            </span>
          </motion.h1>

          <motion.div
            variants={fadeIn}
            custom={3}
            className="max-w-3xl mx-auto space-y-4"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Transform your AI agents and digital content into valuable
              blockchain assets. Join a decentralized ecosystem where creators
              thrive and innovation flourishes.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed">
              Empowering Financial & Retail SMEs with autonomous AI agents and
              blockchain-powered intelligence solutions.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-green-500 rounded-full animate-pulse" />
              <span>Blockchain-Powered</span>
            </div>
            <div className="hidden sm:block size-1 bg-muted-foreground/30 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Community-Governed</span>
            </div>
            <div className="hidden sm:block size-1 bg-muted-foreground/30 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Creator-Focused</span>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            custom={4}
            className="flex flex-col justify-center items-center gap-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full flex justify-center py-2"
            >
              <div className="bg-secondary/50 rounded-full px-4 py-1 text-md sm:text-lg flex items-center gap-2">
                <span className="text-red-500">🎉</span>
                <span>Test our beta version live now!</span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 max-w-6xl mx-auto px-4">
              {featuresAboutUs.map((item: FeatureAboutUs, index: number) => (
                <motion.div
                  key={item.title}
                  className={cn(
                    'flex flex-col justify-between gap-2 lg:gap-4 lg:min-h-64 w-full px-6 py-4 cursor-pointer bg-white/10 border border-border rounded-2xl relative group',
                    'hover:backdrop-blur-sm transition-all duration-200',
                  )}
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl lg:text-2xl font-bold font-sans text-left">
                    {item.title}
                  </h3>
                  <span className="text-base lg:text-lg text-muted-foreground font-normal text-left pt-2">
                    {item.description}
                  </span>

                  <div className="flex flex-col justify-end items-end gap-1">
                    <motion.button
                      className="mt-5 flex items-center justify-start gap-1 px-3 py-2 text-purple-800 font-bold font-sans rounded-lg rounded-br-none bg-purple-200 hover:bg-purple-500/20 group-hover:border-solid hover:transition-all hover:duration-300 border-1 border-dashed border-purple-500"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => router.push(item.link)}
                    >
                      <span className="text-lg">Test Beta</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-16 w-full max-w-6xl mx-auto rounded-xl border border-border overflow-hidden shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500"
        >
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full overflow-hidden rounded-lg"
            >
              <Image
                src="/hero2.png"
                alt="Portdex AI Interface"
                className="w-full h-auto transition-transform duration-700 ease-out"
                width={1200}
                height={675}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.div>
        <div className="max-w-6xl mx-auto text-center mt-5 flex justify-center items-center px-4">
          <p className="text-lg md:text-xl text-muted-foreground font-sans">
            <span className="text-neutral-800 dark:text-white font-bold">
              Portdex AI
            </span>
            :{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              FinData LLM
            </span>{' '}
            — Unlocking real-time financial insights with intelligent agents for{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              market trends
            </span>
            ,{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              crypto analysis
            </span>
            , and{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              price comparisons
            </span>
            .
            <Button
              className="ml-3 dark:bg-white bg-purple-200 text-purple-800 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300"
              onClick={() =>
                router.push('https://openchat.portdex.ai/auth?redirect=%2F')
              }
            >
              Try it Now ⇗
            </Button>
          </p>
        </div>

        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-16 w-full max-w-6xl mx-auto rounded-xl border border-border overflow-hidden shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500"
        >
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full overflow-hidden rounded-lg"
            >
              <Image
                src="/hero.png"
                alt="Portdex AI Interface"
                className="w-full h-auto transition-transform duration-700 ease-out"
                width={1200}
                height={675}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.div>
        <div className="max-w-6xl mx-auto text-center mt-5 flex justify-center items-center px-4">
          <p className="text-lg md:text-xl text-muted-foreground font-sans">
            <span className="font-bold text-neutral-800 dark:text-white">
              Portdex AI
            </span>{' '}
            is a next-gen platform that combines{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              Agentic AI
            </span>
            ,{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              Large Language Models (LLMs)
            </span>
            , and{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              blockchain technology
            </span>{' '}
            to empower businesses with real-time insights, intelligent content
            creation, and secure data monetization.{' '}
            <Button
              className="ml-3 dark:bg-white bg-purple-200 text-purple-800 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300"
              onClick={() =>
                router.push('https://workflow.portdex.ai/sign-in?from=%2F')
              }
            >
              Try it Now ⇗
            </Button>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

function Features() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),transparent_50%)]" />

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Integration of Multiple AI Models
          </h2>
          <p className="mt-4 text-muted-foreground">
            Combine AI models from OpenAI, StabilityAI, Anthropic and Replicate
            for innovative outcomes.
          </p>
        </div>
        <div className="mx-auto">
          <AIModelsMarquee />
        </div>
      </div>

      <div className="mt-32 container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Integration of Blockchain Protocols
          </h2>
          <p className="mt-4 text-muted-foreground">
            Seamless Integration of Blockchain Protocols: Empowering AI Agents
            with Decentralized Intelligence.
          </p>
        </div>
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {blockchainHelpItems.map((item: HelpItem, index: number) => (
              <motion.div
                key={item.title}
                className="bg-background/60 backdrop-blur-sm border border-purple-600/50 hover:border-purple-400 hover:border-2 hover:border-dashed rounded-lg p-6 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="text-2xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-32 container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Create and List Interoperable AI Agents on Portdex
          </h2>
          <p className="mt-4 text-muted-foreground">
            Seamlessly Port AI Agents Across Platforms for Enhanced Flexibility
            and Efficiency
          </p>
        </div>
        <div className="mx-auto">
          <HowWeHelp data={helpItems} />
        </div>
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(120,119,198,0.15),transparent_50%)]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="container mx-auto px-4"
      >
        <motion.div
          variants={fadeInUp}
          custom={1}
          className="mx-auto mb-12 md:mb-16 max-w-3xl text-center"
        >
          <motion.h2
            variants={fadeInUp}
            custom={2}
            className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent"
          >
            Your AI Toolbox
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={3}
            className="mt-4 text-base md:text-lg text-muted-foreground"
          >
            Stay up to date with the latest available AI models. Get started
            with ready-to-use templates.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3"
        >
          {TOOLS.map((tool: Tool, index: number) => (
            <motion.div
              key={tool.title}
              variants={cardVariants}
              custom={index}
              whileHover="hover"
              className="h-full"
            >
              <Card className="flex flex-col h-full border border-border/60 bg-background/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardHeader className="shrink-0 pb-3">
                  <CardTitle className="text-xl md:text-2xl">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grow pt-0">
                  <motion.div className="mb-4 aspect-video w-full overflow-hidden rounded-lg shadow-md bg-muted/50 flex items-center justify-center">
                    <div className="text-4xl opacity-50">
                      {tool.title === 'AI Chat Interface' && '💬'}
                      {tool.title === 'Workflow Automation' && '⚙️'}
                      {tool.title === 'Agent Builder' && '🤖'}
                      {tool.title === 'Blockchain Integration' && '🔗'}
                      {tool.title === 'Analytics Dashboard' && '📊'}
                      {tool.title === 'API Management' && '🔌'}
                    </div>
                  </motion.div>
                  <CardDescription className="text-base text-foreground/80 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
