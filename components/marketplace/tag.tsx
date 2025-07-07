"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const aiPlatforms = [
	"Reasoning Model",
	"Hybrid Reasoning Model",
	"Code Programming",
	"Fast Response",
	"Long Text Processing",
	"Web Search",
	"Search Tool",
	"Image and Video Recognition",
	"Mathematical Logic",
	"Financial Quantitative Analysis",
	"Write a Tweet",
	"Text Detection",
	"Translation",
	"Long-form Writing",
	"Emotional Companionship",
	"Chinese Friendly",
	"European Multilingual",
	"Middle East and Southeast Asia Multilingual",
	"Text-to-Image",
	"Image-to-Image",
	"Image-to-Video",
	"Text-to-Video",
	"Continuous Editing",
	"Text Recognition",
	"Commercial Design",
	"Anti-NSFW",
	"Smooth Motion",
	"All-in-One Assistant",
	"Audio Generation",
	"Text Proofreading",
];

export default function Tags() {
	const [activeTab, setActiveTab] = useState("all");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const TagBadge = ({
		tag,
		variant = "secondary",
	}: {
		tag: string;
		variant?: "default" | "secondary" | "outline";
	}) => (
		<Badge
			variant={selectedTags.includes(tag) ? "default" : variant}
			className={`cursor-pointer transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 ${
				selectedTags.includes(tag)
					? "bg-purple-300 text-purple-800"
					: "bg-muted hover:bg-purple-300 text-muted-foreground hover:text-purple-800 transition-all duration-200"
			}`}
			onClick={() => toggleTag(tag)}
		>
			{tag}
		</Badge>
	);

	return (
		<div className="w-full max-w-7xl mx-auto p-4 space-y-6">
			<div className="flex flex-wrap gap-2">
				{aiPlatforms.map((platform) => (
					<TagBadge key={platform} tag={platform} variant="outline" />
				))}
			</div>

			{/* Selected Tags Summary */}
			{/* {selectedTags.length > 0 && (
				<Card className="border-primary/20">
					<CardContent className="p-4 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium text-primary">
								Selected ({selectedTags.length})
							</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setSelectedTags([])}
								className="text-xs"
							>
								Clear All
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{selectedTags.map((tag) => (
								<Badge key={tag} variant="default" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)} */}
		</div>
	);
}
