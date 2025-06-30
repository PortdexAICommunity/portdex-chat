import { motion } from "framer-motion";

export const Greeting = () => {
	return (
		<div
			key="overview"
			className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center items-center"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.5 }}
				className="text-2xl font-semibold"
			>
				Welcome to{" "}
				<span className="text-purple-500 font-bold font-sans">
					Portdex Chat
				</span>
				, I am your personal assistant.
				<br /> &quot;I am here to help you with business ideas, market research,
				crypto, finance, and more.&quot;
			</motion.div>
		</div>
	);
};
