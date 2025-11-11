"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WelcomePage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center px-6 py-12">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-violet-200/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-base">ACM Biolabs</span>
              <span className="text-sm text-gray-500 font-medium">Research Intelligence</span>
            </div>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
            Welcome to ACM 2.0
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Your AI Research Intelligence Platform
          </p>
        </motion.div>

        {/* Executive Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8 md:p-10 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">MN</span>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-4">
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Dear Research Team,</p>

                <p>
                  I'm excited to introduce ACM 2.0 - a platform we've built specifically for our team to accelerate cancer research breakthroughs.
                </p>

                <p>
                  This isn't another tool to learn. It's an AI research partner that learns from you and helps you work faster and smarter.
                </p>

                <p>Start with a single question. ACM 2.0 will show you what it can do.</p>
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-900">Madhavan Nallani</p>
                <p className="text-sm text-gray-500">CEO, ACM Biolabs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Link
            href="/researcher/query/new"
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
          <button
            onClick={() => setShowDemo(true)}
            className="px-10 py-4 bg-white text-violet-700 text-lg font-semibold rounded-full border-2 border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 shadow-md"
          >
            Watch Demo
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Get your first insights in under 60 seconds
            </span>
          </div>
        </motion.div>
      </motion.main>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Demo Video</h2>
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center">
                  <svg className="w-10 h-10 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Demo video placeholder</p>
                <p className="text-sm text-gray-500 mt-1">Video will be embedded here</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
