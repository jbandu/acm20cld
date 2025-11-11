"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, X, Sparkles, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #ecfeff 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* ACM Biolabs Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">ACM Biolabs</h2>
              <p className="text-sm text-gray-600">Research Intelligence</p>
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Welcome to ACM 2.0</span>
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Your AI Research Intelligence Platform
          </p>
        </motion.div>

        {/* Executive Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-10 mb-8 border-2 border-purple-100"
        >
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">MN</span>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  <span className="font-semibold">Dear Research Team,</span>
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  I'm excited to introduce ACM 2.0 - a platform we've built
                  specifically for our team to accelerate cancer research
                  breakthroughs.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  This isn't another tool to learn. It's an AI research partner
                  that learns from you and helps you work faster and smarter.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mb-6">
                  Start with a single question. ACM 2.0 will show you what it
                  can do.
                </p>
              </div>

              {/* Signature */}
              <div className="border-t-2 border-purple-100 pt-4">
                <p className="text-gray-900 font-semibold text-lg">
                  Madhavan Nallani
                </p>
                <p className="text-purple-600 font-medium">
                  CEO, ACM Biolabs
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link
            href="/researcher/query/new"
            className="group inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
            }}
          >
            <Sparkles className="w-5 h-5" />
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setShowDemoModal(true)}
            className="inline-flex items-center gap-3 px-8 py-4 text-purple-700 bg-white border-2 border-purple-300 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:border-purple-400 transition-all transform hover:scale-105 text-lg"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-purple-200 shadow-lg">
            <span className="text-2xl">⏱️</span>
            <span className="text-gray-700 font-medium text-lg">
              Get your first insights in under 60 seconds
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border-2 border-purple-200">
                {/* Modal Header */}
                <div className="bg-gradient-card border-b-2 border-purple-200 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold gradient-text">
                      ACM 2.0 Demo
                    </h3>
                    <p className="text-gray-600 mt-1">
                      See how ACM 2.0 accelerates your research
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDemoModal(false)}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-300 hover:border-purple-400 hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl border-2 border-purple-200 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                        <Play className="w-12 h-12 text-purple-600" />
                      </div>
                      <p className="text-gray-700 font-medium text-lg">
                        Demo video coming soon
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        In the meantime, try getting started with your first
                        query
                      </p>
                    </div>
                  </div>

                  {/* Quick Start Guide */}
                  <div className="bg-gradient-card rounded-2xl border-2 border-purple-100 p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-4">
                      Quick Start Guide
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            Ask your first research question
                          </p>
                          <p className="text-gray-600 text-sm">
                            Start with anything you're curious about in your
                            research
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            Review AI-generated insights
                          </p>
                          <p className="text-gray-600 text-sm">
                            Get comprehensive answers with cited sources
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            Explore your knowledge graph
                          </p>
                          <p className="text-gray-600 text-sm">
                            Watch your research network grow with each query
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA in Modal */}
                  <div className="mt-6 flex justify-end">
                    <Link
                      href="/researcher/query/new"
                      onClick={() => setShowDemoModal(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
