"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, MessageSquare, Megaphone, CreditCard } from "lucide-react";

const useCases = {
	"Customer Service": {
		icon: MessageSquare,
		color: "text-purple-600 dark:text-purple-400",
		items: [
			"Call Analytics",
			"Call Classification",
			"Call Intent Discovery",
			"Chatbot For Customers",
			"Chatbot Testing",
			"Chatbot Analytics",
			"Customer Contact Analytics",
			"Customer Service Response Suggestions",
			"Social Listening",
			"Intelligent Routing",
			"Survey and Review Analytics",
			"Voice Authentication",
		],
	},
	Marketing: {
		icon: Megaphone,
		color: "text-purple-600 dark:text-purple-400",
		items: [
			"Marketing Analytics",
			"Personalized Marketing",
			"Content Generation",
			"Content Translation",
			"Image Improvement",
			"Context-Aware Marketing",
			"Customer Segmentation",
			"Lead Scoring",
			"Brand Reputation Management",
			"Social Media Sentiment Analysis",
			"Automated A/B Testing",
			"Automated Content Distribution",
		],
	},
	Fintech: {
		icon: CreditCard,
		color: "text-purple-600 dark:text-purple-400",
		items: [
			"Fraud Detection",
			"Insurance Underwriting",
			"Financial Analytics",
			"Travel and Expense Management",
			"Credit Lending and Scoring",
			"Risk management",
			"Lead Scoring",
			"Brand Reputation Management",
			"Data Gathering",
			"Debt Collection",
			"Conversational Banking",
			"KYC Automation",
		],
	},
};

export default function UseCaseTooltip() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div>
			<div className="fixed top-4 right-4 z-50">
				<div
					className="relative"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<motion.button
						className="size-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<HelpCircle className="size-5" />
					</motion.button>

					{/* Tooltip */}
					<AnimatePresence>
						{isHovered && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 10 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="absolute top-12 right-0 w-[90vw] max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8"
								style={{ transformOrigin: "top right" }}
							>
								{/* Header */}
								<div className="mb-6">
									<h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
										Most Common{" "}
										<span className="text-purple-600 dark:text-purple-400">
											Use Cases
										</span>
									</h2>
									<p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
										The CrewAI community has already found hundreds of use cases
										for AI agents. See examples below.
									</p>
								</div>

								{/* Use Cases Grid */}
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
									{Object.entries(useCases).map(([category, data], index) => {
										const IconComponent = data.icon;
										return (
											<motion.div
												key={category}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.1, duration: 0.3 }}
												className="space-y-4"
											>
												{/* Category Header */}
												<div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
													<div className="size-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
														<IconComponent className={`size-4 ${data.color}`} />
													</div>
													<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
														{category}
													</h3>
												</div>

												{/* Use Cases List */}
												<div className="space-y-2">
													{data.items.map((item, itemIndex) => (
														<motion.div
															key={item}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{
																delay: index * 0.1 + itemIndex * 0.02,
																duration: 0.2,
															}}
															className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
														>
															<div className="size-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 shrink-0"></div>
															<span>{item}</span>
														</motion.div>
													))}
												</div>
											</motion.div>
										);
									})}
								</div>

								{/* Footer */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.3 }}
									className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center"
								>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Hover over this help button anytime to see these use cases
									</p>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
