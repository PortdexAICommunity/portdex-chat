"use client";

import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface HelpItem {
	icon: string;
	title: string;
	description: string;
}

interface HowWeHelpProps {
	data: HelpItem[];
}

const HowWeHelp = ({ data }: HowWeHelpProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
			{data.map((item, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					viewport={{ once: true }}
					whileHover={{
						y: -5,
						transition: { duration: 0.2 },
					}}
				>
					<Card className="h-full bg-background/60 backdrop-blur-sm border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
						<CardHeader className="pb-3">
							<div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
								{item.icon}
							</div>
							<CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
								{item.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-muted-foreground leading-relaxed">
								{item.description}
							</CardDescription>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

export default HowWeHelp;
