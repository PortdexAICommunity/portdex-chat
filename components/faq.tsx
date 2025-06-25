"use client";

import { motion } from "framer-motion";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
	question: string;
	answer: string;
}

interface FAQSectionProps {
	faqs: FAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
	return (
		<section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
				>
					<h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-base md:text-lg text-muted-foreground">
						Get answers to common questions about our platform and services
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className="max-w-4xl mx-auto"
				>
					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<AccordionItem
									value={`item-${index}`}
									className="border border-border rounded-xl bg-background/50 backdrop-blur-sm overflow-hidden px-0"
								>
									<AccordionTrigger className="px-6 py-4 text-left hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180 hover:no-underline">
										<h3 className="text-lg font-semibold text-foreground pr-4 text-left">
											{faq.question}
										</h3>
									</AccordionTrigger>
									<AccordionContent className="px-6 pb-4 pt-0">
										<p className="text-muted-foreground leading-relaxed">
											{faq.answer}
										</p>
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
};
