'use client';

import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AI_PLATFORMS } from '@/lib/constant/marketplace-constant';

interface TagsProps {
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export default function Tags({ selectedTags = [], onTagsChange }: TagsProps) {
  const [localSelectedTags, setLocalSelectedTags] =
    useState<string[]>(selectedTags);

  // Update local state when props change
  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    const newTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag];

    setLocalSelectedTags(newTags);
    if (onTagsChange) {
      onTagsChange(newTags);
    }
  };

  const clearAllTags = () => {
    setLocalSelectedTags([]);
    if (onTagsChange) {
      onTagsChange([]);
    }
  };

  const TagBadge = ({
    tag,
    variant = 'secondary',
  }: {
    tag: string;
    variant?: 'default' | 'secondary' | 'outline';
  }) => (
    <Badge
      variant={localSelectedTags.includes(tag) ? 'default' : variant}
      className={`cursor-pointer transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 ${
        localSelectedTags.includes(tag)
          ? 'bg-purple-300 text-purple-800'
          : 'bg-muted hover:bg-purple-300 text-muted-foreground hover:text-purple-800 transition-all duration-200'
      }`}
      onClick={() => toggleTag(tag)}
    >
      {tag}
    </Badge>
  );

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {/* AI Platforms Tags */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {AI_PLATFORMS.map((platform) => (
            <TagBadge key={platform} tag={platform} variant="outline" />
          ))}
        </div>
      </div>

      {/* Selected Tags Summary */}
      {/* {localSelectedTags.length > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-primary">
                Selected ({localSelectedTags.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllTags}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localSelectedTags.map((tag) => (
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
