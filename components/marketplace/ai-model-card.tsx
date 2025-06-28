'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { DataTypes } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';

interface AIModelCardProps {
  aiModel: DataTypes;
  onClick: () => void;
}

export function AIModelCard({ aiModel, onClick }: AIModelCardProps) {
  const [imageError, setImageError] = useState(false);

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
                {aiModel.icon?.startsWith('http') && !imageError ? (
                  <Avatar className="size-12">
                    <AvatarImage
                      src={aiModel.icon}
                      className="object-cover bg-white p-1"
                      onError={() => setImageError(true)}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                      {aiModel.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : aiModel.creator ? (
                  <Image
                    src={`https://avatar.vercel.sh/${aiModel.creator}`}
                    alt={aiModel.creator ?? 'User Avatar'}
                    width={48}
                    height={48}
                    className="rounded-full size-12 object-cover bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700/50">
                    {typeof aiModel.icon === 'string' &&
                    !aiModel.icon.startsWith('http')
                      ? aiModel.icon
                      : aiModel.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Title and Creator */}
              <div className="mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                  {aiModel.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                  {aiModel.creator}
                </p>
                {aiModel.date && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {aiModel.date}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex-1 mb-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {aiModel.description}
                </p>
              </div>

              {/* Footer with category badge */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
                >
                  {aiModel.category}
                </Badge>

                <motion.div
                  className="text-blue-600 dark:text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
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
