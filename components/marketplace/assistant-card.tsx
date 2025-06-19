'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DataTypes } from '@/lib/types';

interface AssistantCardProps {
  assistant: DataTypes;
  onClick: () => void;
}

export function AssistantCard({ assistant, onClick }: AssistantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card
        className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div
            className={`h-20 w-full bg-gradient-to-r ${assistant.gradient} rounded-lg mb-3 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -bottom-2 -right-2 size-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-gray-700/50">
              {assistant.icon}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-2 line-clamp-1">
            {assistant.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {assistant.creator}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {assistant.date}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {assistant.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              {assistant.category}
            </Badge>

            <motion.div
              className="text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              View →
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
