"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiveMetrics } from "./LiveMetrics";
import { ActivityFeed } from "./ActivityFeed";

const EXAMPLE_QUERIES = [
  "CAR-T cell exhaustion mechanisms in solid tumors",
  "CRISPR applications in cancer gene therapy 2024",
  "PD-1 checkpoint inhibitor resistance patterns",
  "Liquid biopsy biomarkers for early detection",
  "Tumor microenvironment immune evasion strategies",
];

export function HeroInteractive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  // Auto-typing demonstration
  useEffect(() => {
    if (!searchQuery && !isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
        typeExample(EXAMPLE_QUERIES[currentExample]);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, isTyping, currentExample]);

  const typeExample = async (text: string) => {
    setSearchQuery("");
    for (let i = 0; i <= text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setSearchQuery(text.slice(0, i));
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Clear and move to next example
    for (let i = text.length; i >= 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setSearchQuery(text.slice(0, i));
    }
    setIsTyping(false);
    setCurrentExample((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Redirect to query page with pre-filled query
    window.location.href = `/researcher/query/new?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Hero content */}
          <div className="space-y-8">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-white text-sm font-medium mb-6">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Trusted by 2,847 cancer researchers worldwide
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Breakthroughs
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
                  3 Hours Faster
                </span>
              </h1>

              <p className="text-xl text-white/90 leading-relaxed mb-8">
                AI-powered research intelligence that searches{" "}
                <span className="font-semibold text-cyan-300">40M+ papers</span>,
                analyzes with{" "}
                <span className="font-semibold text-cyan-300">3 AI models</span>, and
                suggests your next breakthrough question.
              </p>
            </motion.div>

            {/* Interactive search box */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative group"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsTyping(false);
                  }}
                  placeholder="Try: CAR-T cell exhaustion mechanisms..."
                  className="w-full px-6 py-5 pr-32 text-lg bg-white/95 backdrop-blur-lg border-2 border-white/50 rounded-2xl shadow-2xl focus:outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/30 transition-all duration-300 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Search
                </button>
              </div>

              {/* Example query pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {EXAMPLE_QUERIES.slice(0, 3).map((query, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchQuery(query)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-white text-sm hover:bg-white/30 transition-all duration-200 hover:scale-105"
                  >
                    {query.length > 35 ? query.slice(0, 35) + "..." : query}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Live metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <LiveMetrics />
            </motion.div>
          </div>

          {/* Right column - Activity feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:mt-20"
          >
            <ActivityFeed />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/70 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
