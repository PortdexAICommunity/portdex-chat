import { motion } from "framer-motion";

export const Greeting = () => {
	return (
		<div
			key="overview"
			className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center items-center -mb-9"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.5 }}
				className="text-4xl font-semibold"
			>
				Get started with{" "}
				<span className="text-purple-500 font-bold font-sans">
					Portdex Chat
				</span>
				<br /> A Financial and Web3.0 AI
			</motion.div>
		</div>
	);
};
