'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Server } from 'lucide-react';

interface MCPServer {
  name: string;
  url: string;
  description: string;
  category: string;
  official: boolean;
  languages: string[];
  scope: string[];
  operating_systems: string[];
}

interface MCPServerCardProps {
  server: MCPServer;
  onClick: () => void;
}

// Legend mappings for beautiful display
const LEGEND_ICONS = {
  languages: {
    Python: {
      icon: '🐍',
      color:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/50',
    },
    'TypeScript/JavaScript': {
      icon: '📇',
      color:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50',
    },
    Go: {
      icon: '🏎️',
      color:
        'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700/50',
    },
    Rust: {
      icon: '🦀',
      color:
        'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/50',
    },
    'C#': {
      icon: '#️⃣',
      color:
        'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700/50',
    },
    Java: {
      icon: '☕',
      color:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/50',
    },
    'C/C++': {
      icon: '🌊',
      color:
        'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700/50',
    },
  },
  scope: {
    Cloud: {
      icon: '☁️',
      color:
        'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-700/50',
    },
    Local: {
      icon: '🏠',
      color:
        'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/50',
    },
    Embedded: {
      icon: '📟',
      color:
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700/50',
    },
  },
  operating_systems: {
    macOS: {
      icon: '🍎',
      color:
        'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700/50',
    },
    Windows: {
      icon: '🪟',
      color:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50',
    },
    Linux: {
      icon: '🐧',
      color:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/50',
    },
  },
};

export function MCPServerCard({ server, onClick }: MCPServerCardProps) {
  // Helper function to render legend badges
  const renderLegendBadges = () => {
    const badges: JSX.Element[] = [];

    // Add language badges
    server.languages.forEach((lang) => {
      const legendInfo =
        LEGEND_ICONS.languages[lang as keyof typeof LEGEND_ICONS.languages];
      if (legendInfo) {
        badges.push(
          <Badge
            key={`lang-${lang}`}
            variant="outline"
            className={`text-xs border ${legendInfo.color} flex items-center gap-1`}
          >
            <span>{legendInfo.icon}</span>
            <span className="hidden sm:inline">{lang}</span>
          </Badge>,
        );
      }
    });

    // Add scope badges
    server.scope.forEach((scopeItem) => {
      const legendInfo =
        LEGEND_ICONS.scope[scopeItem as keyof typeof LEGEND_ICONS.scope];
      if (legendInfo) {
        badges.push(
          <Badge
            key={`scope-${scopeItem}`}
            variant="outline"
            className={`text-xs border ${legendInfo.color} flex items-center gap-1`}
          >
            <span>{legendInfo.icon}</span>
            <span className="hidden sm:inline">{scopeItem}</span>
          </Badge>,
        );
      }
    });

    // Add OS badges
    server.operating_systems.forEach((os) => {
      const legendInfo =
        LEGEND_ICONS.operating_systems[
          os as keyof typeof LEGEND_ICONS.operating_systems
        ];
      if (legendInfo) {
        badges.push(
          <Badge
            key={`os-${os}`}
            variant="outline"
            className={`text-xs border ${legendInfo.color} flex items-center gap-1`}
          >
            <span>{legendInfo.icon}</span>
            <span className="hidden sm:inline">{os}</span>
          </Badge>,
        );
      }
    });

    return badges.slice(0, 4); // Limit to 4 badges to prevent overflow
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
    >
      <Card
        className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-green-300 dark:hover:border-green-600/50 flex flex-col group"
        onClick={onClick}
      >
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon Section */}
            <div className="shrink-0">
              <div className="relative">
                <div className="size-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center text-xl shadow-sm border border-green-200 dark:border-green-700/50">
                  <Server className="size-6 text-green-600 dark:text-green-400" />
                </div>
                {server.official && (
                  <div className="absolute -top-1 -right-1 size-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-900">
                    <span className="text-xs">🎖️</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Title and URL */}
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1 flex-1">
                    {server.name}
                  </h3>
                  {server.official && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-0.5"
                    >
                      Official
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                  <Globe className="size-3 shrink-0" />
                  <span className="line-clamp-1 text-xs truncate">
                    {server.url}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 mb-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {server.description}
                </p>
              </div>

              {/* Legend badges */}
              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
                {renderLegendBadges()}
                {server.languages.length +
                  server.scope.length +
                  server.operating_systems.length >
                  4 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/50"
                  >
                    +
                    {server.languages.length +
                      server.scope.length +
                      server.operating_systems.length -
                      4}
                  </Badge>
                )}
              </div>

              {/* Footer with category badge and external link */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs"
                >
                  {server.category}
                </Badge>

                <motion.div
                  className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <ExternalLink className="size-3" />
                  <span>View →</span>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
