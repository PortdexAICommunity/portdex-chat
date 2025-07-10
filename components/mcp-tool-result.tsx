"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDownIcon, CopyIcon } from "./icons";
import { ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MCPToolResultProps {
	toolName: string;
	result: any;
}

const formatValue = (value: any): string => {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	return JSON.stringify(value, null, 2);
};

const renderValue = (
	key: string,
	value: any,
	depth: number = 0
): React.ReactNode => {
	if (value === null || value === undefined) {
		return (
			<span className="text-muted-foreground italic">
				{value === null ? "null" : "undefined"}
			</span>
		);
	}

	if (typeof value === "string") {
		return (
			<span className="text-green-600 dark:text-green-400">
				&quot;{value}&quot;
			</span>
		);
	}

	if (typeof value === "number") {
		return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
	}

	if (typeof value === "boolean") {
		return (
			<span className="text-purple-600 dark:text-purple-400">
				{String(value)}
			</span>
		);
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return <span className="text-muted-foreground">[]</span>;
		}

		return (
			<div className="space-y-1">
				<span className="text-muted-foreground">[</span>
				<div className="ml-4 space-y-1">
					{value.map((item, index) => (
						<div key={index} className="flex gap-2">
							<span className="text-muted-foreground">{index}:</span>
							{renderValue(String(index), item, depth + 1)}
						</div>
					))}
				</div>
				<span className="text-muted-foreground">]</span>
			</div>
		);
	}

	if (typeof value === "object") {
		const entries = Object.entries(value);
		if (entries.length === 0) {
			return <span className="text-muted-foreground">{"{}"}</span>;
		}

		return (
			<div className="space-y-1">
				<span className="text-muted-foreground">{"{"}</span>
				<div className="ml-4 space-y-1">
					{entries.map(([objKey, objValue]) => (
						<div key={objKey} className="flex gap-2">
							<span className="text-orange-600 dark:text-orange-400">
								{objKey}:
							</span>
							{renderValue(objKey, objValue, depth + 1)}
						</div>
					))}
				</div>
				<span className="text-muted-foreground">{"}"}</span>
			</div>
		);
	}

	return <span>{String(value)}</span>;
};

export const MCPToolResult: React.FC<MCPToolResultProps> = ({
	toolName,
	result,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const isComplexResult = typeof result === "object" && result !== null;
	const resultSummary = isComplexResult
		? `${
				Array.isArray(result)
					? `Array (${result.length} items)`
					: `Object (${Object.keys(result).length} properties)`
		  }`
		: formatValue(result);

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<CardTitle className="text-sm font-medium">Tool Result</CardTitle>
						<Badge variant="secondary" className="text-xs">
							{toolName}
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleCopy}
									className="h-7 w-7 p-0"
								>
									<CopyIcon size={12} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{copied ? "Copied!" : "Copy JSON"}
							</TooltipContent>
						</Tooltip>
						{isComplexResult && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(!isExpanded)}
								className="h-7 w-7 p-0"
							>
								{isExpanded ? (
									<ChevronDownIcon size={12} />
								) : (
									<ChevronRight className="h-3 w-3" />
								)}
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{!isComplexResult || !isExpanded ? (
					<div className="text-sm text-muted-foreground font-mono">
						{isComplexResult && !isExpanded ? (
							<button
								onClick={() => setIsExpanded(true)}
								className="hover:text-foreground transition-colors"
							>
								{resultSummary}{" "}
								<span className="text-xs">(click to expand)</span>
							</button>
						) : (
							renderValue("root", result)
						)}
					</div>
				) : (
					<div className="text-sm font-mono space-y-1 max-h-96 overflow-y-auto">
						{renderValue("root", result)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
