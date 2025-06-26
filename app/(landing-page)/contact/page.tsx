'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  fadeIn,
  staggerContainer,
  cardVariants,
} from '@/lib/animation-constant';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen w-full mx-auto">
      <Navbar />
      <HeroSection />
      <ContactInfo />
      {/* <ContactForm /> */}
      <LocationSection />
    </div>
  );
}

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
              <MessageSquare className="size-4 mr-2" />
              Get in Touch
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            custom={2}
            className="text-center font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-purple-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
              Contact Portdex
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            custom={3}
            className="max-w-2xl text-base mx-auto text-muted-foreground sm:text-lg md:text-xl text-center"
          >
            Ready to transform your business with AI agents? Get in touch with
            our team and discover how Portdex can help you build, deploy, and
            monetize intelligent solutions.
          </motion.p>

          <motion.div
            variants={fadeIn}
            custom={4}
            className="flex flex-wrap justify-center gap-6 pt-6"
          >
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <Users className="size-4" />
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <CheckCircle2 className="size-4" />
              <span className="font-medium">Expert Team</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-full px-4 py-2">
              <Building2 className="size-4" />
              <span className="font-medium">Enterprise Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Mail,
      title: 'Email Address',
      content: 'info@portdex.ai',
      description: 'Send us your questions anytime',
      link: 'mailto:info@portdex.ai',
    },
    {
      icon: MapPin,
      title: 'Office Address',
      content: '16 Mount Pleasant',
      description: 'Tunbridge Wells, England TN1 1QU',
      link: 'https://maps.google.com/?q=16+Mount+Pleasant+Tunbridge+Wells+England+TN1+1QU',
    },
    {
      icon: Building2,
      title: 'Company Details',
      content: 'Portdex Limited',
      description: 'Registered in England and Wales',
      link: null,
    },
    {
      icon: Clock,
      title: 'Response Time',
      content: 'Within 24 Hours',
      description: "We'll get back to you quickly",
      link: null,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <motion.div variants={fadeIn} custom={1} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-teal-500 bg-clip-text text-transparent">
              Contact Information
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multiple ways to reach us. Choose what works best for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border border-border hover:shadow-xl transition-all duration-300 hover:border-purple-200">
                <CardHeader className="text-center">
                  <div className="mx-auto size-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <detail.icon className="size-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {detail.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  {detail.link ? (
                    <a
                      href={detail.link}
                      className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      target={
                        detail.link.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        detail.link.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {detail.content}
                    </a>
                  ) : (
                    <p className="font-medium text-purple-600">
                      {detail.content}
                    </p>
                  )}
                  <CardDescription>{detail.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50/50">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <motion.div variants={fadeIn} custom={1} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-teal-500 bg-clip-text text-transparent">
              Send Us a Message
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a specific question or want to discuss a project? Fill out the
            form below.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={2}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Get Started Today
              </CardTitle>
              <CardDescription className="text-center">
                Tell us about your project and we&apos;ll get back to you within
                24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="size-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We&apos;ll be in touch soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        required
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        required
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project, requirements, or any questions you have..."
                      required
                      rows={6}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="size-4" />
                        Send Message
                        <ArrowRight className="size-4" />
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};

const LocationSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <motion.div variants={fadeIn} custom={1} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-teal-500 bg-clip-text text-transparent">
              Our Location
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based in the heart of England, serving clients worldwide.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={2}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 bg-gradient-to-br from-purple-50 to-teal-50">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-2">
                      Portdex Limited
                    </h3>
                    <p className="text-purple-600 font-medium">
                      Registered in England and Wales
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-purple-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          16 Mount Pleasant
                        </p>
                        <p className="text-gray-600">
                          Tunbridge Wells, England TN1 1QU
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-purple-600 shrink-0" />
                      <Link
                        href="mailto:info@portdex.ai"
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        info@portdex.ai
                      </Link>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      asChild
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Link
                        href="https://maps.google.com/?q=16+Mount+Pleasant+Tunbridge+Wells+England+TN1+1QU"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="size-4 mr-2" />
                        View on Google Maps
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-64 lg:h-auto bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="size-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Tunbridge Wells, England
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    A vibrant town in Kent, known for innovation and business
                    excellence
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};
