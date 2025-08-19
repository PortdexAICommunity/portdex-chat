'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { DataTypes } from '@/lib/types';
import { parseCreatorAndName } from '@/lib/utils';
import { motion } from 'framer-motion';
// import {
// 	Link2Icon,
// 	LinkIcon,
// 	SquareArrowOutUpRightIcon,
// 	Unlink2,
// 	UnlinkIcon,
// } from "lucide-react";
import Image from 'next/image';
// import Link from 'next/link';
import { useState } from 'react';
// import { EyeIcon, GlobeIcon } from "../icons";
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageOff } from 'lucide-react';

interface AssistantCardProps {
  assistant: DataTypes;
  onClick: () => void;
}

export function AssistantCard({ assistant, onClick }: AssistantCardProps) {
  const [imageError, setImageError] = useState(false);
  const { creator, name } = parseCreatorAndName(assistant?.name);

  // Check if icon is an emoji (not a URL)
  const isEmojiIcon =
    assistant.icon &&
    typeof assistant.icon === 'string' &&
    !assistant.icon.startsWith('http') &&
    !assistant.icon.includes('.') &&
    assistant.icon.length <= 4; // Most emojis are 1-4 characters

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
    >
      <Card className="h-full flex flex-col" onClick={onClick}>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col justify-between items-start h-full">
              <div className="flex items-center gap-4">
                {/* Avatar Section */}
                <div className="shrink-0">
                  <div className="relative">
                    {isEmojiIcon ? (
                      // Display emoji icon with nice background
                      <div className="size-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 flex items-center justify-center text-2xl shadow-sm border-2 border-blue-200 dark:border-blue-700/50">
                        {assistant.icon}
                      </div>
                    ) : (
                      <Avatar>
                        <AvatarImage src={assistant.icon} alt={name} />
                        <AvatarFallback>
                          <ImageOff />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                {/* Title and Creator */}
                <div className="mb-3">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                    {name}
                  </h3>
                  {creator && (
                    <span className="flex gap-2 items-center">
                      <GitHubLogoIcon />
                      <span>{creator}</span>
                    </span>
                  )}
                  {assistant.date && (
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {assistant.date}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 mb-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {assistant.description}
                </p>
              </div>

              {/* Footer with category badge */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs"
                >
                  {assistant.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="border-t border-border border-dashed"></CardFooter> */}
      </Card>
    </motion.div>
  );
}
