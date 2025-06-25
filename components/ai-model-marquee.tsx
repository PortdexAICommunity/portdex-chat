"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

export const AIModelsMarquee: React.FC = () => {
	const { theme } = useTheme();
	const slides = [
		{
			dark: "/openai-text.svg",
			light: "/openai-text-light.svg",
			alt: "openai",
		},
		{
			dark: "/deepseek-text.svg",
			light: "/deepseek-text-light.svg",
			alt: "deepseek",
		},
		{
			dark: "/claude-text.svg",
			light: "/claude-text-light.svg",
			alt: "claude",
		},
		{
			dark: "/gemini-brand-color.svg",
			light: "/gemini-brand-color-light.svg",
			alt: "google-gemini",
		},
		{ dark: "/qwen-text.svg", light: "/qwen-text-light.svg", alt: "openai" },
	];
	const duplicatedSlides = [...slides, ...slides];

	return (
		<div className="relative w-full overflow-hidden">
			{/* Wrapping div for seamless looping */}
			<motion.div
				className="flex gap-4 items-center "
				animate={{
					x: ["-100%", "0%"],
					transition: {
						ease: "linear",
						duration: 15,
						repeat: Infinity,
					},
				}}
			>
				{/* Render duplicated slides */}
				{duplicatedSlides.map((slide, index) => (
					<div
						key={index}
						className="shrink-0"
						style={{ width: `${100 / slides.length}%` }}
					>
						<div className="flex flex-col items-center justify-center h-full text-6xl pb-5 font-mono font-bold">
							<Image
								src={theme === "dark" ? slide.dark : slide.light || ""}
								alt={slide.alt || ""}
								width={100}
								height={100}
								className=""
							/>
						</div>
					</div>
				))}
			</motion.div>
			<motion.div
				className="flex pt-4 gap-4 items-center"
				animate={{
					x: ["0%", "-100%"],
					transition: {
						ease: "linear",
						duration: 15,
						repeat: Infinity,
					},
				}}
			>
				{/* Render duplicated slides */}
				{duplicatedSlides.map((slide, index) => (
					<div
						key={index}
						className="shrink-0"
						style={{ width: `${100 / slides.length}%` }}
					>
						<div className="flex flex-col items-center justify-center h-full text-6xl font-mono font-bold gap-4">
							<Image
								src={theme === "dark" ? slide.dark : slide.light || ""}
								alt={slide.alt || ""}
								width={100}
								height={100}
							/>
						</div>
					</div>
				))}
			</motion.div>
		</div>
	);
};
