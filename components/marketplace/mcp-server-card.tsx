'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ExternalLink, GitBranch, Star, Users } from 'lucide-react';

interface MCPServer {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  official: boolean;
  languages: string[];
  scope: string[];
  operating_systems: string[];
}

interface MCPServerCardProps {
  server: MCPServer;
  onClick: () => void;
}

// Language color mappings
const LANGUAGE_COLORS = {
  'TypeScript/JavaScript':
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Python:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Go: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  Rust: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'C#': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Java: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'C/C++':
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

// Scope color mappings
const SCOPE_COLORS = {
  Remote:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Local:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  Embedded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

// Custom hook to parse server name and extract creator/product
const useServerNameParser = (server: MCPServer) => {
  // Check if the name is in the format "creator/product"
  const hasCreatorInName = server.name.includes('/');

  if (hasCreatorInName) {
    const [creator, ...productNameParts] = server.name.split('/');
    const productName = productNameParts.join('/');
    return {
      displayName: productName,
      displayCreator: creator,
    };
  }

  // If no creator in name, return original values
  return {
    displayName: server.name,
    displayCreator: server.creator,
  };
};

export function MCPServerCard({ server, onClick }: MCPServerCardProps) {
  // Parse server name to extract creator/product
  const { displayName, displayCreator } = useServerNameParser(server);

  // Generate random-ish stats for demo purposes (in real app, these would come from API)
  const starCount = Math.floor(Math.random() * 10000) + 100;
  const forkCount = Math.floor(Math.random() * 1000) + 10;

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(server.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer h-full"
    >
      <Card className="h-full group" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-4 items-start">
                {/* Icon */}
                <div className="shrink-0 relative">
                  <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">
                    {server.icon || '📦'}
                  </div>
                  {server.official && (
                    <div className="absolute -top-1 -right-1 size-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white">✓</span>
                    </div>
                  )}
                </div>
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                      {displayName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      @{displayCreator}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="size-3" />
                      <span>{starCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="size-3" />
                      <span>{forkCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mb-3 leading-relaxed">
                {server.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                  {/* Primary Language */}
                  {server.languages.length > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 ${
                        LANGUAGE_COLORS[
                          server.languages[0] as keyof typeof LANGUAGE_COLORS
                        ] ||
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {server.languages[0]}
                    </Badge>
                  )}

                  {/* Scope */}
                  {server.scope.length > 0 && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 border ${
                        SCOPE_COLORS[
                          server.scope[0] as keyof typeof SCOPE_COLORS
                        ] ||
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {server.scope[0]}
                    </Badge>
                  )}

                  {/* Category */}
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-600 truncate max-w-24"
                  >
                    {server.category}
                  </Badge>
                </div>

                {/* External Link */}
                <button
                  type="button"
                  onClick={handleExternalLinkClick}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="View Repository"
                >
                  <ExternalLink className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
