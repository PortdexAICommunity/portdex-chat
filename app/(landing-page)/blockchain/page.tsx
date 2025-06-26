'use client';

import { motion } from 'framer-motion';
import Products from './product';
import { TextRotate } from '@/components/animation/text-rotate';
import { Navbar } from '@/components/navbar';

const BlockchainPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <HeroSection />
        <Products />
      </div>
    </>
  );
};

export default BlockchainPage;

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 pt-32 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-start">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-2">
              <span className="text-primary flex gap-2">
                Take <TextRotate />
              </span>
            </div>
            <div className="text-primary mb-2">
              Protection Trust from Blockchain
            </div>
            {/* <div className="mb-2">from Blockchain</div> */}
            <div className="text-end">to Your Business</div>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Portdex AI leverages blockchain technology to enhance asset
            traceability, ensure IP ownership, and integrate cross-chain
            capabilities, providing a secure and transparent environment for AI
            agents and tokenized assets.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
