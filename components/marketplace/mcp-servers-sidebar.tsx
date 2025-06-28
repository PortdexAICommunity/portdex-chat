'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface MCPServersSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  totalServers: number;
  filteredServers: number;
}

export function MCPServersSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  totalServers,
  filteredServers,
}: MCPServersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <Card className="h-full border-0 lg:border lg:shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="size-5" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredServers} of {totalServers} servers
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories Filter */}
        <div>
          <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="w-full justify-start text-left h-auto py-2 px-3"
            >
              <span className="flex-1">All Categories</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {totalServers}
              </Badge>
            </Button>

            <Separator className="my-2" />

            <ScrollArea className="h-64">
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'ghost'
                    }
                    size="sm"
                    onClick={() => onCategoryChange(category)}
                    className="w-full justify-start text-left h-auto py-2 px-3"
                  >
                    <span className="flex-1 truncate">{category}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Clear Filters */}
        {selectedCategory && (
          <div>
            <Separator className="mb-4" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={toggleSidebar}
          className="flex items-center gap-2"
        >
          <Filter className="size-4" />
          Filters
          {selectedCategory && (
            <Badge variant="secondary" className="ml-1">
              1
            </Badge>
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        className={`
					fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-950 z-50 lg:z-auto
					lg:relative lg:translate-x-0 lg:w-64 lg:bg-transparent
					${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
					transition-transform duration-300 ease-in-out lg:transition-none
				`}
      >
        <div className="h-full p-4 lg:p-0">
          <SidebarContent />
        </div>
      </motion.div>
    </>
  );
}
