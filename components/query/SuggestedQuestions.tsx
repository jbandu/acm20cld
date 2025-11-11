"use client";

/**
 * Suggested Questions Component
 *
 * Displays intelligent question suggestions below the search box
 * to help researchers discover relevant topics and next steps.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  RefreshCw,
  X,
  GitBranch,
  Microscope,
  FlaskConical,
  TrendingDown,
  Layers,
  AlertCircle,
} from "lucide-react";

interface SuggestedQuestion {
  question: string;
  category: string;
  reasoning: string;
  scores: {
    relevance: number;
    novelty: number;
    actionability: number;
    impact: number;
    diversity: number;
  };
  overallScore: number;
  sourceType: string;
}

interface SuggestedQuestionsProps {
  onQuestionSelect?: (question: string) => void;
  limit?: number;
}

const CATEGORY_CONFIG = {
  CONTINUATION: {
    icon: Target,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  DEEPENING: {
    icon: Microscope,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
  },
  TRENDING: {
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  TREND: {
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  GAP: {
    icon: AlertCircle,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
  },
  PRACTICAL: {
    icon: FlaskConical,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    textColor: "text-cyan-700",
  },
  BRIDGING: {
    icon: GitBranch,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
  },
  EXPLORATION: {
    icon: Layers,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
  },
  COMPARISON: {
    icon: TrendingDown,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
  },
};

export function SuggestedQuestions({
  onQuestionSelect,
  limit = 5,
}: SuggestedQuestionsProps) {
  const [questions, setQuestions] = useState<SuggestedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuestions = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const url = forceRefresh
        ? `/api/questions/suggested?limit=${limit}`
        : `/api/questions/suggested?limit=${limit}`;

      const method = forceRefresh ? "POST" : "GET";

      const response = await fetch(url, { method });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
      }

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Error fetching suggested questions:", err);
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = async (question: SuggestedQuestion, index: number) => {
    // Track click (non-blocking)
    try {
      // Find the actual question ID from the response
      // For now, we'll just track the click analytics
      console.log("Question clicked:", question.question);

      // Call the parent callback
      if (onQuestionSelect) {
        onQuestionSelect(question.question);
      }
    } catch (error) {
      console.error("Error tracking click:", error);
      // Still proceed with selection even if tracking fails
      if (onQuestionSelect) {
        onQuestionSelect(question.question);
      }
    }
  };

  const handleDismiss = async (index: number, event: React.MouseEvent) => {
    event.stopPropagation();

    // Add to dismissed set
    setDismissed((prev) => new Set(prev).add(index));

    // Track dismissal (non-blocking)
    try {
      console.log("Question dismissed:", questions[index].question);
      // await fetch(`/api/questions/${questionId}/dismiss`, { method: "POST" });
    } catch (error) {
      console.error("Error tracking dismissal:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setDismissed(new Set());
    await fetchQuestions(true);
  };

  // Filter out dismissed questions
  const visibleQuestions = questions.filter((_, index) => !dismissed.has(index));

  if (error) {
    return (
      <div className="py-4 px-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">
            Unable to load question suggestions. {error}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Loading intelligent suggestions...
          </h3>
        </div>
        <div className="grid gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (visibleQuestions.length === 0) {
    return null; // Don't show anything if no questions
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Questions you should explore
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Questions */}
      <div className="grid gap-2">
        <AnimatePresence mode="popLayout">
          {visibleQuestions.map((question, index) => {
            const categoryKey = question.category as keyof typeof CATEGORY_CONFIG;
            const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.EXPLORATION;
            const Icon = config.icon;

            return (
              <motion.div
                key={`${question.question}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                layout
              >
                <div
                  onClick={() => handleQuestionClick(question, index)}
                  className={`relative group cursor-pointer p-4 bg-white border-2 ${config.borderColor} rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.01]`}
                >
                  {/* Dismiss button */}
                  <button
                    onClick={(e) => handleDismiss(index, e)}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity"
                    aria-label="Dismiss question"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>

                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{question.category.toLowerCase()}</span>
                    </div>

                    {/* Score indicator */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${config.color}`}
                          style={{ width: `${question.overallScore * 100}%` }}
                        />
                      </div>
                      <span>{Math.round(question.overallScore * 100)}%</span>
                    </div>
                  </div>

                  {/* Question */}
                  <p className="text-sm font-medium text-gray-900 mb-2 pr-6 leading-relaxed">
                    {question.question}
                  </p>

                  {/* Reasoning */}
                  {question.reasoning && (
                    <p className="text-xs text-gray-600 flex items-start gap-1">
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
                      <span>{question.reasoning}</span>
                    </p>
                  )}

                  {/* Source type badge (subtle) */}
                  <div className="mt-2 text-[10px] text-gray-400">
                    Source: {question.sourceType.replace(/-/g, " ")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-gray-500 text-center italic">
        Click any question to start researching
      </p>
    </motion.div>
  );
}
