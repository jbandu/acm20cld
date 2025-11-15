"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionSuggestion {
  id: string;
  text: string;
  category: "trending" | "profile" | "recent" | "team" | "conference";
  reasoning: string;
  relevanceScore: number;
}

interface IntelligentQuestionsProps {
  userProfile: {
    id: string;
    name: string;
    researchProfile?: {
      primaryInterests: string[];
      secondaryInterests: string[];
      expertiseLevel: string;
    } | null;
  } | null;
  onQuestionClick: (question: string) => void;
  maxQuestions?: number;
  autoRefresh?: boolean;
}

const categoryIcons = {
  trending: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  recent: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  team: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  conference: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const categoryGradients = {
  trending: "from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100",
  profile: "from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100",
  recent: "from-green-50 to-teal-50 border-green-200 hover:from-green-100 hover:to-teal-100",
  team: "from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100",
  conference: "from-pink-50 to-purple-50 border-pink-200 hover:from-pink-100 hover:to-purple-100",
};

const categoryColors = {
  trending: "text-orange-700",
  profile: "text-purple-700",
  recent: "text-green-700",
  team: "text-blue-700",
  conference: "text-pink-700",
};

export function IntelligentQuestions({
  userProfile,
  onQuestionClick,
  maxQuestions = 5,
  autoRefresh = true,
}: IntelligentQuestionsProps) {
  const [questions, setQuestions] = useState<QuestionSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/query/intelligent-questions");

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data.questions.slice(0, maxQuestions));
    } catch (err: any) {
      setError(err.message || "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = (question: QuestionSuggestion) => {
    onQuestionClick(question.text);
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Suggested Questions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-5 border border-gray-300 animate-pulse"
            >
              <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Suggested Questions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Personalized based on your research profile and recent activity
          </p>
        </div>
        <button
          onClick={fetchQuestions}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {questions.map((question, index) => (
            <motion.button
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => handleQuestionClick(question)}
              className={`relative bg-gradient-to-br ${categoryGradients[question.category]} rounded-xl p-5 border text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group`}
            >
              {/* Category Icon */}
              <div className={`inline-flex p-2 rounded-lg bg-white/80 ${categoryColors[question.category]} mb-3 group-hover:scale-110 transition-transform`}>
                {categoryIcons[question.category]}
              </div>

              {/* Question Text */}
              <div className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                {question.text}
              </div>

              {/* Reasoning */}
              <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                {question.reasoning}
              </div>

              {/* Relevance Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < Math.round(question.relevanceScore / 20)
                            ? "bg-gray-700"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {question.relevanceScore}% match
                  </span>
                </div>

                {/* Click to use indicator */}
                <div className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                  Click to use →
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
