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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-3 rounded-xl gradient-primary"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Generating Intelligent Suggestions
            </h3>
            <p className="text-sm text-neutral-600">
              Analyzing your research patterns...
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-xl border-2 border-purple-200 p-6"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                  className="w-12 h-12 rounded-xl bg-gradient-card flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full gradient-primary" />
                </motion.div>
                <div className="flex-1 space-y-3">
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                    className="h-5 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-4/5"
                  />
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2 + 0.1,
                    }}
                    className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
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
      className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">
              Intelligent Question Suggestions
            </h3>
            <p className="text-sm text-neutral-600">
              AI-powered questions tailored to your research
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50 hover-lift"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Questions */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {visibleQuestions.map((question, index) => {
            const categoryKey = question.category as keyof typeof CATEGORY_CONFIG;
            const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.EXPLORATION;
            const Icon = config.icon;

            return (
              <motion.div
                key={`${question.question}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                layout
              >
                <div
                  onClick={() => handleQuestionClick(question, index)}
                  className={`relative group cursor-pointer p-6 bg-gradient-to-br from-white to-gray-50 border-2 ${config.borderColor} rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Dismiss button */}
                  <button
                    onClick={(e) => handleDismiss(index, e)}
                    className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-full transition-all shadow-md z-10"
                    aria-label="Dismiss question"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Header with icon and category */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Gradient icon badge */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Category and score */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
                        >
                          {question.category.toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold gradient-text">
                          {Math.round(question.overallScore * 100)}% Match
                        </div>
                      </div>

                      {/* Enhanced progress bar */}
                      <div className="progress-bar h-2">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${question.overallScore * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <p className="text-base font-semibold text-gray-900 mb-3 pr-8 leading-relaxed">
                    {question.question}
                  </p>

                  {/* Reasoning with icon */}
                  {question.reasoning && (
                    <div className={`flex items-start gap-3 p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
                      <Lightbulb className="w-5 h-5 flex-shrink-0 text-amber-500" />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {question.reasoning}
                      </p>
                    </div>
                  )}

                  {/* Footer with source and detailed scores */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        Source: {question.sourceType.replace(/_/g, " ")}
                      </span>
                      <div className="flex gap-2">
                        {Object.entries(question.scores).slice(0, 3).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                          >
                            <span className="text-[10px] text-gray-600 capitalize">{key}</span>
                            <span className="text-[10px] font-bold text-purple-600">
                              {Math.round((value as number) * 100)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-center text-gray-600 mt-6 font-medium"
      >
        💡 Click any question to automatically fill the search box
      </motion.p>
    </motion.div>
  );
}
