'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Assistant, DataTypes, MCPServerType, Plugin } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  ExternalLink,
  Server,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import Image from 'next/image';

interface DetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: Assistant | Plugin | DataTypes | MCPServerType | null;
  type: 'assistant' | 'plugin' | 'mcp-server' | 'ai-model';
}

export function DetailDialog({
  isOpen,
  onClose,
  item,
  type,
}: DetailDialogProps) {
  if (!item) return null;

  const isAssistant = type === 'assistant';
  const isPlugin = type === 'plugin';
  const isMcpServer = type === 'mcp-server';
  const isAIModel = type === 'ai-model';

  const assistant = isAssistant ? (item as Assistant) : null;
  const plugin = isPlugin ? (item as Plugin) : null;
  const mcpServer = isMcpServer ? (item as MCPServerType) : null;
  const aiModel = isAIModel ? (item as DataTypes) : null;

  const handleUseAssistant = () => {
    if (isMcpServer && mcpServer) {
      // For MCP servers, open the GitHub URL in a new tab
      window.open(mcpServer.url, '_blank');
    } else {
      console.log(`Using ${item.name}`);
    }
    onClose();
  };

  const getButtonText = () => {
    if (isAssistant) return 'Use Assistant';
    if (isPlugin) return 'Install Plugin';
    if (isMcpServer) return 'View on GitHub';
    if (isAIModel) return 'Use AI Model';
    return 'Use';
  };

  const getButtonIcon = () => {
    if (isMcpServer) return <ExternalLink className="size-4 mr-2" />;
    return <Download className="size-4 mr-2" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800/50 text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="pb-6 pr-10">
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {item.name}
              </DialogTitle>
              <Badge
                variant="secondary"
                className={`${
                  isAssistant
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : isPlugin
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : isAIModel
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                } w-fit`}
              >
                {isMcpServer ? 'MCP Server' : item.category}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Header for Assistant */}
            {assistant && (
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-6">
                  <div
                    className={`h-24 w-full bg-gradient-to-r ${assistant.gradient} rounded-xl relative overflow-hidden mb-4`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-3 -right-3 size-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white dark:border-gray-700/50">
                      {assistant.icon}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{assistant.creator}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{assistant.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visual Header for AI Model */}
            {aiModel && (
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-6">
                  <div
                    className={`h-24 w-full bg-gradient-to-r ${aiModel.gradient} rounded-xl relative overflow-hidden mb-4`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-3 -right-3 size-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700/50 p-2">
                      {typeof aiModel.icon === 'string' &&
                      aiModel.icon.startsWith('http') ? (
                        <Image
                          src={aiModel.icon}
                          alt={aiModel.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-contain"
                        />
                      ) : (
                        <div className="text-2xl">
                          {typeof aiModel.icon === 'string'
                            ? aiModel.icon
                            : aiModel.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{aiModel.creator}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{aiModel.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visual Header for Plugin */}
            {plugin && (
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-blue-200 dark:border-blue-700/50">
                      {plugin.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {plugin.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Created by @{plugin.creator}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="size-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          4.8 • 1.2k downloads
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visual Header for MCP Server */}
            {mcpServer && (
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-green-200 dark:border-green-700/50">
                      <Server className="size-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {mcpServer.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        GitHub Repository
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Server className="size-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          MCP Server • {mcpServer.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                {isMcpServer
                  ? 'About this MCP Server'
                  : isAIModel
                    ? 'About this AI Model'
                    : 'Description'}
              </h4>
              <Card className="bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features (for plugins) */}
            {plugin && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Key Features
                </h4>
                <div className="grid gap-2">
                  {[
                    '🚀 Lightning fast performance',
                    '🔧 Easy to configure',
                    '📱 Mobile responsive',
                    '🎨 Customizable themes',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950/50 rounded-lg border border-gray-200 dark:border-gray-800/50"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Model Information */}
            {aiModel && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Model Information
                </h4>
                <Card className="bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Category
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {aiModel.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Creator
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {aiModel.creator}
                        </p>
                      </div>
                      {aiModel.date && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Release Date
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {aiModel.date}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Installation/Usage Instructions for MCP Server */}
            {mcpServer && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  How to Use
                </h4>
                <Card className="bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="size-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xs font-bold text-green-600 dark:text-green-400 mt-0.5">
                          1
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Click &quot;View on GitHub&quot; to access the
                          repository
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xs font-bold text-green-600 dark:text-green-400 mt-0.5">
                          2
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Follow the installation instructions in the README
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xs font-bold text-green-600 dark:text-green-400 mt-0.5">
                          3
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Configure the MCP server in your client application
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className={`flex-1 ${
                  isMcpServer
                    ? 'bg-green-600 hover:bg-green-700'
                    : isAIModel
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                onClick={handleUseAssistant}
              >
                {getButtonIcon()}
                {getButtonText()}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:w-auto"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
