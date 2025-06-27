"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { homeMarketplaceItems, marketplaceItems } from "@/lib/constants";
import type { HomeMarketplaceItem } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Download, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MarketplaceItemCardProps {
  item: HomeMarketplaceItem;
  index: number;
  onCardClick: (item: HomeMarketplaceItem) => void;
}

interface MarketplaceItemDialogProps {
  item: HomeMarketplaceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MarketplaceItemDialog = ({
  item,
  isOpen,
  onClose,
}: MarketplaceItemDialogProps) => {
  if (!item) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "courses":
        return "📚";
      case "tutors":
        return "👨‍🏫";
      case "resources":
        return "📖";
      case "ai-models":
        return "🤖";
      case "software":
        return "💻";
      case "templates":
        return "🎨";
      default:
        return "📄";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "courses":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "tutors":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "resources":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "ai-models":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "software":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      case "templates":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
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
                {item.title} {getCategoryIcon(item.category)}
              </DialogTitle>
              <Badge
                variant="secondary"
                className={`${getCategoryColor(item.category)} w-fit`}
              >
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Header */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
              <CardContent className="p-6">
                <div className="h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl relative overflow-hidden mb-4 flex items-center justify-center">
                  <div className="text-4xl">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="size-4" />
                    <span>{item.creator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                Description
              </h4>
              <Card className="bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50">
                <CardContent className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => {
                  console.log(`Using ${item.title}`);
                  onClose();
                }}
              >
                <Download className="size-4 mr-2" />
                Use Assistant
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
};

const MarketplaceItemCard = ({
  item,
  index,
  onCardClick,
}: MarketplaceItemCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "education":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30";
      case "courses":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30";
      case "tutors":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/30";
      case "resources":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/30";
      case "ai-models":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/30";
      case "software":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-800/30";
      case "templates":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "assistant":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/25";
      case "plugin":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25";
      case "ai-model":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25";
      case "software":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/25";
      case "template":
        return "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/25";
    }
  };

  const handleCardClick = () => {
    onCardClick(item);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full group"
      onClick={handleCardClick}
    >
      <Card className="h-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-900/40 transition-all duration-300 hover:border-purple-300/60 dark:hover:border-purple-600/40 flex flex-col overflow-hidden">
        {/* Header with gradient and badges */}
        <div className="relative overflow-hidden">
          {item.gradient ? (
            <div
              className={`h-28 sm:h-32 lg:h-36 w-full bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl relative z-10 drop-shadow-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          ) : (
            <div className="h-28 sm:h-32 lg:h-36 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
            </div>
          )}

          {/* Type badge - top left */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <Badge
              className={`${getTypeColor(
                item.type
              )} text-xs font-semibold shadow-lg border-0 px-2 py-1`}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
          </div>

          {/* Category badge - top right */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <Badge
              variant="outline"
              className={`${getCategoryColor(
                item.category
              )} text-xs font-medium shadow-sm backdrop-blur-sm`}
            >
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
          </div>

          {/* Sparkle effect on hover */}
          <motion.div
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles className="size-4 text-white/80" />
          </motion.div>
        </div>

        <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
          {/* Title and Creator in same row */}
          <div className="flex items-start gap-2 sm:gap-3 mb-2">
            <div className="size-8 sm:size-9 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 shrink-0">
              {item.creator.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-gray-900 dark:text-white font-bold text-base sm:text-lg lg:text-xl line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                {item.title}
              </motion.h3>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                <User className="size-3" />
                <span>by {item.creator}</span>
              </div>
            </div>
          </div>

          {/* Date below title */}
          {item.date && (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-3 sm:mb-4 ml-10 sm:ml-12">
              <Calendar className="size-3" />
              <span>{formatDate(item.date)}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-3 leading-relaxed flex-1">
            {item.description}
          </p>

          {/* Footer with status and action */}
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              <motion.div
                className="size-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Available
              </span>
            </div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold opacity-70 group-hover:opacity-100 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              <span>Explore</span>
              <ArrowRight className="size-3 sm:size-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const HomeMarketplace = () => {
  const router = useRouter();
  const [showCount, setShowCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState<HomeMarketplaceItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShowMore = () => {
    const nextCount = showCount + 8;
    setShowCount(Math.min(nextCount, marketplaceItems.length));
  };

  const handleGoToMarketplace = () => {
    router.push("/marketplace");
  };

  const handleCardClick = (item: HomeMarketplaceItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const visibleItems = homeMarketplaceItems.slice(0, showCount);
  const hasMoreItems = showCount < homeMarketplaceItems.length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Explore Our Marketplace
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Discover courses, mentors, resources, AI models, software tools, and
          templates to accelerate your tech journey
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {visibleItems.map((item, index) => (
            <MarketplaceItemCard
              key={item.id}
              item={item}
              index={index}
              onCardClick={handleCardClick}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {hasMoreItems && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleShowMore}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              Show More ({homeMarketplaceItems.length - showCount} remaining)
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={"/marketplace"}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-500 to-purple-800 text-transparent bg-clip-text font-semibold"
          >
            Take Me to Marketplace
          </Link>
        </motion.div>
      </div>

      {/* Dialog */}
      <MarketplaceItemDialog
        item={selectedItem}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};
