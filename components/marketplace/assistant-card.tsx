'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { DataTypes } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface AssistantCardProps {
  assistant: DataTypes;
  onClick: () => void;
}

export function AssistantCard({ assistant, onClick }: AssistantCardProps) {
  const [imageError, setImageError] = useState(false);

  // Check if icon is an emoji (not a URL)
  const isEmojiIcon = assistant.icon && 
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
      <Card
        className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50 flex flex-col"
        onClick={onClick}
      >
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            {/* Avatar Section */}
            <div className="shrink-0">
              <div className="relative">
                {isEmojiIcon ? (
                  // Display emoji icon with nice background
                  <div className="size-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 flex items-center justify-center text-2xl shadow-sm border-2 border-blue-200 dark:border-blue-700/50">
                    {assistant.icon}
                  </div>
                ) : (
                  // Fallback to avatar with error handling
                  <Image
                    src={imageError ? '/logo.webp' : `https://avatar.vercel.sh/${assistant.creator}`}
                    alt={assistant.creator ?? 'MCP Server'}
                    width={48}
                    height={48}
                    className="rounded-full size-12 object-cover bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                    onError={() => setImageError(true)}
                    unoptimized={imageError} // Use unoptimized for fallback
                  />
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Title and Creator */}
              <div className="mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                  {assistant.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                  @{assistant.creator}
                </p>
                {assistant.date && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {assistant.date}
                  </p>
                )}
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

                <motion.div
                  className="text-purple-600 dark:text-purple-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  View →
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
