"use client";
import React from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
	gradientFirst?: string;
	gradientSecond?: string;
	gradientThird?: string;
	translateY?: number;
	width?: number;
	height?: number;
	smallWidth?: number;
	duration?: number;
	xOffset?: number;
};

export const Spotlight = ({
	gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(257, 100%, 85%, .08) 0, hsla(257, 100%, 55%, .02) 50%, hsla(257, 100%, 45%, 0) 80%)",
	gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(257, 100%, 85%, .06) 0, hsla(257, 100%, 55%, .02) 80%, transparent 100%)",
	gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(257, 100%, 85%, .04) 0, hsla(257, 100%, 45%, .02) 80%, transparent 100%)",
	translateY = -350,
	width = 560,
	height = 1380,
	smallWidth = 240,
	duration = 7,
	xOffset = 100,
}: SpotlightProps = {}) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			transition={{
				duration: 1.5,
			}}
			className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
			style={{
				maskImage:
					"radial-gradient(ellipse 100% 70% at 50% 50%, black 0%, black 40%, transparent 70%)",
				WebkitMaskImage:
					"radial-gradient(ellipse 100% 70% at 50% 50%, black 0%, black 40%, transparent 70%)",
			}}
		>
			<motion.div
				animate={{
					x: [0, xOffset, 0],
				}}
				transition={{
					duration,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
					ease: "easeInOut",
				}}
				className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
				style={{
					filter: "blur(1px)",
				}}
			>
				<div
					style={{
						transform: `translateY(${translateY}px) rotate(-45deg)`,
						background: gradientFirst,
						width: `${width}px`,
						height: `${height}px`,
						filter: "blur(2px)",
					}}
					className={`absolute top-0 left-0`}
				/>

				<div
					style={{
						transform: "rotate(-45deg) translate(5%, -50%)",
						background: gradientSecond,
						width: `${smallWidth}px`,
						height: `${height}px`,
						filter: "blur(1.5px)",
					}}
					className={`absolute top-0 left-0 origin-top-left`}
				/>

				<div
					style={{
						transform: "rotate(-45deg) translate(-180%, -70%)",
						background: gradientThird,
						width: `${smallWidth}px`,
						height: `${height}px`,
						filter: "blur(1px)",
					}}
					className={`absolute top-0 left-0 origin-top-left`}
				/>
			</motion.div>

			<motion.div
				animate={{
					x: [0, -xOffset, 0],
				}}
				transition={{
					duration,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
					ease: "easeInOut",
				}}
				className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
				style={{
					filter: "blur(1px)",
				}}
			>
				<div
					style={{
						transform: `translateY(${translateY}px) rotate(45deg)`,
						background: gradientFirst,
						width: `${width}px`,
						height: `${height}px`,
						filter: "blur(2px)",
					}}
					className={`absolute top-0 right-0`}
				/>

				<div
					style={{
						transform: "rotate(45deg) translate(-5%, -50%)",
						background: gradientSecond,
						width: `${smallWidth}px`,
						height: `${height}px`,
						filter: "blur(1.5px)",
					}}
					className={`absolute top-0 right-0 origin-top-right`}
				/>

				<div
					style={{
						transform: "rotate(45deg) translate(180%, -70%)",
						background: gradientThird,
						width: `${smallWidth}px`,
						height: `${height}px`,
						filter: "blur(1px)",
					}}
					className={`absolute top-0 right-0 origin-top-right`}
				/>
			</motion.div>

			{/* Additional background fade layers for smoother transitions */}
			<div
				className="absolute inset-0 w-full h-full pointer-events-none z-30"
				style={{
					background:
						"radial-gradient(ellipse 120% 80% at 50% 40%, hsla(257, 30%, 50%, .02) 0%, hsla(257, 20%, 60%, .01) 60%, transparent 100%)",
					filter: "blur(4px)",
				}}
			/>

			<div
				className="absolute inset-0 w-full h-full pointer-events-none z-20"
				style={{
					background:
						"linear-gradient(135deg, hsla(257, 25%, 70%, .015) 0%, transparent 30%, transparent 70%, hsla(257, 25%, 70%, .015) 100%)",
					filter: "blur(6px)",
				}}
			/>
		</motion.div>
	);
};
