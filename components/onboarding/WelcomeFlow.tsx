"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WelcomeFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const exampleQuestions = [
  "CAR-T exhaustion mechanisms",
  "Novel checkpoint inhibitor targets",
  "TME hypoxia therapeutic strategies",
];

export function WelcomeFlow({ isOpen, onClose, userName }: WelcomeFlowProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    // Encode and navigate to query page with pre-filled question
    const encoded = encodeURIComponent(question);
    router.push(`/researcher/query/new?q=${encoded}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-violet-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-6xl">👋</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome, {userName}!
            </h1>
            <p className="text-gray-700 text-lg mb-2">
              Let's get you started with your first query
            </p>
            <p className="text-gray-600 text-sm">
              (You can set up your profile anytime - no rush)
            </p>
          </div>

          {/* Search Box Preview */}
          <div className="mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <input
                type="text"
                placeholder="Ask any research question..."
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && selectedQuestion.trim()) {
                    handleQuestionClick(selectedQuestion);
                  }
                }}
                className="w-full text-lg border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Example Questions */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Try one of these examples:
            </p>
            <div className="space-y-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 rounded-lg border border-violet-200 hover:border-violet-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium">{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skip Link */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Skip to Dashboard →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
