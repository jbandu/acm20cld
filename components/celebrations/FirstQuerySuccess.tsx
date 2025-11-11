"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface FirstQuerySuccessProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
  timeTaken: number;
}

export function FirstQuerySuccess({ isOpen, onClose, resultsCount, timeTaken }: FirstQuerySuccessProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(onClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const timeSaved = Math.max(1, Math.round((resultsCount * 2) / 60)); // Rough estimate

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-violet-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold gradient-text mb-4">First Query Complete!</h2>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-gray-900 font-medium mb-4">
              You just searched <span className="font-bold text-violet-600">40M+ papers</span> in{" "}
              <span className="font-bold text-violet-600">{timeTaken}s</span>
            </p>
            <p className="text-gray-700 mb-2">
              That would have taken you ~<span className="font-bold">{timeSaved} hours</span> manually
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-xl p-3">
                <div className="text-2xl font-bold text-violet-600">{resultsCount}</div>
                <div className="text-xs text-gray-600">Papers Found</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="text-2xl font-bold text-green-600">{timeSaved}h</div>
                <div className="text-xs text-gray-600">Time Saved</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              View Results
            </button>
            <button
              onClick={() => window.location.href = "/researcher/query/new"}
              className="px-6 py-3 text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
