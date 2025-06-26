'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  fadeIn,
  staggerContainer,
  imageReveal,
  fadeInUp,
  cardVariants,
} from '@/lib/animation-constant';
import { Navbar } from '@/components/navbar';
import {
  ArrowRight,
  Code,
  Users,
  Globe,
  DollarSign,
  Zap,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DevelopersPage = () => {
  return (
    <div className="min-h-screen w-full mx-auto">
      <Navbar />
      <HeroSection />
      <WhyJoinSection />
      <ContributeSection />
      {/* <CTASection /> */}
    </div>
  );
};

export default DevelopersPage;

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
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Join Our Developer
              </span>
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-2">
              <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Community
              </span>
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-4 text-muted-foreground font-medium">
              Empower AI and Software Innovation
            </span>
          </motion.h1>

          <motion.div
            variants={fadeIn}
            custom={3}
            className="max-w-3xl mx-auto space-y-4"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Sign Up, Contribute, and Earn! Join a thriving ecosystem of AI
              developers and software creators shaping the future of technology.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed">
              Collaborate with like-minded professionals, monetize your
              innovations, and expand your global reach through our
              comprehensive platform.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-green-500 rounded-full animate-pulse" />
              <span>Innovation-Driven</span>
            </div>
            <div className="hidden sm:block size-1 bg-muted-foreground/30 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Collaborative</span>
            </div>
            <div className="hidden sm:block size-1 bg-muted-foreground/30 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 bg-teal-500 rounded-full animate-pulse" />
              <span>Rewarding</span>
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
              <div className="bg-gray-200 dark:bg-secondary/50 rounded-full px-4 py-1 text-md sm:text-lg flex items-center gap-2">
                <span className="text-green-500">🚀</span>
                <span>Start building with us today!</span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              custom={5}
              className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up Today
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/20 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-16 w-full max-w-6xl mx-auto rounded-xl border border-border overflow-hidden shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500"
        >
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full overflow-hidden rounded-lg"
            >
              <Image
                src="/hero.png"
                alt="Developer Community"
                className="w-full h-auto transition-transform duration-700 ease-out"
                width={1200}
                height={675}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto text-center mt-8 flex justify-center items-center px-4">
          <p className="text-lg md:text-xl text-muted-foreground font-sans">
            <span className="text-neutral-800 dark:text-white font-bold">
              Portdex Community
            </span>
            : Where{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              AI innovation
            </span>{' '}
            meets{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              collaborative development
            </span>
            , fostering{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              next-generation solutions
            </span>{' '}
            and{' '}
            <span className="text-neutral-800 dark:text-white font-bold">
              monetization opportunities
            </span>
            .
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const WhyJoinSection = () => {
  const benefits = [
    {
      title: 'Collaboration',
      description: 'Collaborate with like-minded professionals and companies.',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Monetization',
      description: 'Monetize your ideas and products effortlessly.',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Global Reach',
      description:
        'Expand your reach by showcasing your solutions to a global audience.',
      icon: Globe,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Innovation',
      description: 'Be at the forefront of AI and software innovation.',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),transparent_50%)]" />

      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            custom={1}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent"
          >
            Why Join Our Community?
          </motion.h2>
          <motion.p
            variants={fadeIn}
            custom={2}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Our community is made up of passionate AI developers and software
            product sellers. Whether you&apos;re an AI developer creating
            groundbreaking solutions or a product seller looking to showcase
            your offerings, this is the place for you!
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                className="h-full"
              >
                <Card
                  className={cn(
                    'h-full border bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300',
                    benefit.borderColor,
                    'hover:border-2 hover:border-dashed',
                  )}
                >
                  <CardHeader>
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                        benefit.bgColor,
                      )}
                    >
                      <IconComponent className={cn('size-6', benefit.color)} />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const ContributeSection = () => {
  const contributions = [
    {
      title: 'Contribute Use-Cases',
      description:
        'Share your innovative AI use-cases and solutions with the community.',
      icon: Code,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Earn from Contributions',
      description:
        'Get rewarded for the value you provide with each contribution.',
      icon: Gift,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
    {
      title: 'Free Product Listing',
      description:
        'List your software products for free on our marketplace and gain exposure to a wide audience.',
      icon: Globe,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(120,119,198,0.15),transparent_50%)]" />

      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            custom={1}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"
          >
            How You Can Contribute
          </motion.h2>
          <motion.p
            variants={fadeIn}
            custom={2}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Join our platform and start contributing to the future of AI and
            software development while earning rewards for your contributions.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {contributions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                className="h-full"
              >
                <Card
                  className={cn(
                    'h-full border bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300',
                    item.borderColor,
                    'hover:border-2 hover:border-dashed',
                  )}
                >
                  <CardHeader className="text-center">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto',
                        item.bgColor,
                      )}
                    >
                      <IconComponent className={cn('size-8', item.color)} />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl p-8 md:p-12 border border-green-500/20 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_70%)]" />

          <motion.h2
            variants={fadeIn}
            custom={1}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative z-10"
          >
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Ready to Make an Impact?
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn}
            custom={2}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 relative z-10 leading-relaxed"
          >
            Sign up today and start making an impact on the future of AI and
            software development. Join thousands of developers already building
            the next generation of intelligent applications.
          </motion.p>
          <motion.div
            variants={fadeIn}
            custom={3}
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign Up Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/20 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
