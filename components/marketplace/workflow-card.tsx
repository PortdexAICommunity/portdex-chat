'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { WorkflowType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/toast';
import { N8NIcon } from '../icons';
import { formatWorkflowName } from '@/hooks/use-workflow-name-filter';

interface WorkflowCardProps {
  workflow: WorkflowType;
  onClick: () => void;
  onDownload?: (workflow: WorkflowType) => void;
  onLoginRequired?: () => void; // Keep for backwards compatibility but not used
}

export function WorkflowCard({
  workflow,
  onClick,
  onDownload,
  onLoginRequired, // Keep for backwards compatibility but not used
}: WorkflowCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    // Allow all users to download (including guests)
    if (onDownload) {
      setIsDownloading(true);
      try {
        await onDownload(workflow);
      } catch (error) {
        toast({
          type: 'error',
          description: 'Download failed. Please try again.',
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
    >
      <Card className="h-full flex flex-col" onClick={onClick}>
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-row-reverse items-center justify-between flex-1">
              <div className="">
                <div className="size-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-500 dark:to-pink-800/30 flex items-center justify-center text-2xl shadow-sm border-2 border-white dark:border-white">
                  {/* {workflow.icon} */}
                  <N8NIcon size={24} />
                </div>
              </div>
              {/* Title and Creator */}
              <div className="mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                  {formatWorkflowName(workflow.name)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                  {workflow.creator}
                </p>
                {workflow.date && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {workflow.date}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                {workflow.description}
              </p>
            </div>

            {/* File Info */}
            {(workflow.fileSize || workflow.fileType) && (
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                {workflow.fileType && (
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {workflow.fileType}
                  </span>
                )}
                {workflow.fileSize && <span>{workflow.fileSize}</span>}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border border-dashed px-4 py-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isDownloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
                className="mr-2"
              >
                ⏳
              </motion.div>
            ) : (
              <Download className="mr-2 size-4" />
            )}
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
