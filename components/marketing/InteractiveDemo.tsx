"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DemoStep = "input" | "searching" | "analyzing" | "results";

interface SearchProgress {
  database: string;
  status: "pending" | "searching" | "complete";
  count?: number;
  icon: string;
}

export function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<DemoStep>("input");
  const [searchProgress, setSearchProgress] = useState<SearchProgress[]>([
    { database: "PubMed", status: "pending", icon: "🏥", count: 0 },
    { database: "OpenAlex", status: "pending", icon: "📚", count: 0 },
    { database: "arXiv", status: "pending", icon: "📄", count: 0 },
    { database: "Patents", status: "pending", icon: "⚖️", count: 0 },
    { database: "Clinical Trials", status: "pending", icon: "🔬", count: 0 },
  ]);
  const [llmProgress, setLLMProgress] = useState([
    { name: "Claude", status: "pending", icon: "🤖" },
    { name: "GPT-4", status: "pending", icon: "✨" },
    { name: "Gemini", status: "pending", icon: "💎" },
  ]);

  const demoQuery = "CAR-T cell exhaustion mechanisms in solid tumors";

  const playDemo = async () => {
    setIsPlaying(true);
    setCurrentStep("input");

    // Step 1: Show input (2s)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Search databases (5s total, staggered)
    setCurrentStep("searching");
    const databases = ["PubMed", "OpenAlex", "arXiv", "Patents", "Clinical Trials"];
    const counts = [2341, 4892, 1523, 847, 234];

    for (let i = 0; i < databases.length; i++) {
      setSearchProgress((prev) =>
        prev.map((db) =>
          db.database === databases[i] ? { ...db, status: "searching" } : db
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSearchProgress((prev) =>
        prev.map((db) =>
          db.database === databases[i]
            ? { ...db, status: "complete", count: counts[i] }
            : db
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Step 3: LLM analysis (3s)
    setCurrentStep("analyzing");
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 0; i < llmProgress.length; i++) {
      setLLMProgress((prev) =>
        prev.map((llm, idx) =>
          idx === i ? { ...llm, status: "analyzing" } : llm
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLLMProgress((prev) =>
        prev.map((llm, idx) =>
          idx === i ? { ...llm, status: "complete" } : llm
        )
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 4: Show results
    setCurrentStep("results");

    // Auto-reset after 10s
    setTimeout(() => {
      resetDemo();
    }, 10000);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep("input");
    setSearchProgress((prev) =>
      prev.map((db) => ({ ...db, status: "pending", count: 0 }))
    );
    setLLMProgress((prev) =>
      prev.map((llm) => ({ ...llm, status: "pending" }))
    );
  };

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
            See It In Action
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Watch a Research Query{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Come to Life
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the full power of multi-source AI research in real-time
          </p>
        </motion.div>

        {/* Demo window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
        >
          {/* Demo content */}
          <div className="p-8 lg:p-12">
            <AnimatePresence mode="wait">
              {/* Step 1: Input */}
              {currentStep === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Enter Your Question</h3>
                  </div>

                  <div className="bg-gray-50 border-2 border-purple-300 rounded-xl p-6">
                    <div className="text-xl text-gray-900 font-medium">
                      "{demoQuery}"
                    </div>
                  </div>

                  <div className="text-gray-600">
                    Our AI will search across 5 databases and analyze with 3 AI models...
                  </div>
                </motion.div>
              )}

              {/* Step 2: Searching */}
              {currentStep === "searching" && (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Searching Databases</h3>
                  </div>

                  <div className="space-y-4">
                    {searchProgress.map((db, index) => (
                      <motion.div
                        key={db.database}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          db.status === "complete"
                            ? "bg-green-50 border-green-300"
                            : db.status === "searching"
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{db.icon}</span>
                          <span className="font-semibold text-gray-900">{db.database}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {db.status === "complete" && (
                            <>
                              <span className="text-green-700 font-bold">
                                ✓ {db.count?.toLocaleString()} found
                              </span>
                            </>
                          )}
                          {db.status === "searching" && (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-blue-700 font-medium">Searching...</span>
                            </div>
                          )}
                          {db.status === "pending" && (
                            <span className="text-gray-400">Waiting...</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Analyzing */}
              {currentStep === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Analysis</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {llmProgress.map((llm, index) => (
                      <motion.div
                        key={llm.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          llm.status === "complete"
                            ? "bg-green-50 border-green-300"
                            : llm.status === "analyzing"
                            ? "bg-purple-50 border-purple-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{llm.icon}</div>
                          <div className="font-bold text-gray-900 mb-2">{llm.name}</div>
                          {llm.status === "complete" && (
                            <div className="text-green-700 font-semibold">✓ Complete</div>
                          )}
                          {llm.status === "analyzing" && (
                            <div className="text-purple-700 font-semibold flex items-center justify-center gap-2">
                              <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                              Analyzing
                            </div>
                          )}
                          {llm.status === "pending" && (
                            <div className="text-gray-400">Waiting</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep === "results" && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      4
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Results Ready!</h3>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">Total Results</div>
                        <div className="text-4xl font-bold text-gray-900">9,837 papers</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">AI Insights</div>
                        <div className="text-4xl font-bold text-gray-900">3 analyses</div>
                      </div>
                    </div>

                    <div className="border-t border-green-200 pt-6">
                      <div className="text-sm font-semibold text-gray-600 mb-3">Suggested Follow-up Questions</div>
                      <div className="space-y-2">
                        {[
                          "What are the latest combination therapies for CAR-T exhaustion?",
                          "How do different tumor types affect CAR-T persistence?",
                          "What biomarkers predict CAR-T exhaustion onset?",
                        ].map((question, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600">•</span>
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-center text-white">
                    <div className="text-lg font-semibold mb-2">Total Time</div>
                    <div className="text-5xl font-bold mb-2">23 seconds</div>
                    <div className="text-cyan-300 text-lg">
                      You saved: <span className="font-bold">2 hours 47 minutes</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isPlaying ? (
                <button
                  onClick={playDemo}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play Demo
                </button>
              ) : (
                <button
                  onClick={resetDemo}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                  </svg>
                  Reset
                </button>
              )}
            </div>

            <a
              href="/researcher/query/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
            >
              Try with Your Question
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
