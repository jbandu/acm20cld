"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface WelcomeWidgetProps {
  hasQueries: boolean;
  createdDaysAgo: number;
}

export function WelcomeWidget({ hasQueries, createdDaysAgo }: WelcomeWidgetProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Don't show if user is older than 7 days or dismissed
  if (createdDaysAgo > 7 || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("welcome-widget-dismissed", "true");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-8 border border-violet-200"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-2">
            Welcome to Your Research Hub 🚀
          </h2>
          <p className="text-gray-600">Your Quick Start Guide</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-6">
        <ChecklistItem completed={hasQueries} text="Run your first query" />
        <ChecklistItem completed={false} text="Set up research profile" link="/researcher/profile/edit" />
        <ChecklistItem completed={false} text="Try intelligent question suggestions" />
        <ChecklistItem completed={false} text="Explore knowledge graph" link="/researcher/knowledge-graph" />
        <ChecklistItem completed={false} text="Upload internal document" />
      </div>

      {/* Pro Tips */}
      <div className="bg-white rounded-xl p-4 border border-violet-200">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center gap-2 text-violet-600 font-semibold mb-2"
        >
          <span>🎁 Pro Tips</span>
          <svg
            className={"w-4 h-4 transition-transform " + (showTips ? "rotate-180" : "")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showTips && (
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• The more you use it, the smarter it gets</li>
            <li>• Mark papers as Important to train your AI</li>
            <li>• Check Questions to Explore before each query</li>
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <Link
          href="/researcher/profile/edit"
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Complete Setup
        </Link>
        <button
          onClick={handleDismiss}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

function ChecklistItem({ completed, text, link }: { completed: boolean; text: string; link?: string }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className={"w-6 h-6 rounded-full flex items-center justify-center " + (completed ? "bg-green-500" : "bg-gray-300")}>
        {completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={completed ? "text-gray-900 line-through" : "text-gray-700"}>{text}</span>
    </div>
  );

  if (link && !completed) {
    return (
      <Link href={link} className="block hover:bg-white/50 rounded-lg p-2 -m-2 transition-colors">
        {content}
      </Link>
    );
  }

  return <div className="p-2">{content}</div>;
}
