
import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "./shinny-text";

export interface AnimatedBadgeProps extends ComponentPropsWithoutRef<"div"> {
	text: string;
	shimmerWidth?: number;
}

export const AnimatedBadge: FC<AnimatedBadgeProps> = ({
	text,
	className,
	shimmerWidth = 100,
	...props
}) => {
	return (
		<div
			className={cn(
				"group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
				className
			)}
			{...props}
		>
			<span
				style={
					{
						"--shiny-width": `${shimmerWidth}px`,
					} as CSSProperties
				}
				className={cn(
					"inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400",
					"mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",
					// Shine effect
					"animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
					// Shine gradient
					"bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80"
				)}
			>
				<AnimatedShinyText text={text} />
			</span>
		</div>
	);
};
