"use client";

import { motion } from "framer-motion";

export function ComparisonSection() {
  const traditionalSteps = [
    {
      step: "Search PubMed manually",
      time: "30 min",
      result: "15 results",
      icon: "🔍",
      color: "from-gray-400 to-gray-500",
    },
    {
      step: "Read papers one by one",
      time: "2-3 hours",
      result: "5-10 papers",
      icon: "📄",
      color: "from-gray-400 to-gray-500",
    },
    {
      step: "Think of next question",
      time: "15-30 min",
      result: "Based on gut feeling",
      icon: "🤔",
      color: "from-gray-400 to-gray-500",
    },
  ];

  const platformSteps = [
    {
      step: "AI multi-source search",
      time: "20 sec",
      result: "127 results",
      icon: "⚡",
      color: "from-purple-500 to-blue-500",
    },
    {
      step: "3-AI model analysis",
      time: "30 sec",
      result: "Comprehensive insights",
      icon: "🤖",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "Get 5 suggested questions",
      time: "Instant",
      result: "Knowledge graph-based",
      icon: "💡",
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-6">
            The ACM 2.0 Advantage
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Research Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how ACM 2.0 compresses hours of manual work into minutes of AI-powered intelligence
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center mb-12">
          {/* Traditional approach */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
              Traditional Research
            </h3>
            {traditionalSteps.map((item, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-gray-400 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">{item.step}</div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono">
                        {item.time}
                      </span>
                      <span className="text-gray-600">{item.result}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Arrow/transformation indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              →
            </motion.div>
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-700 mb-2">
                Powered by AI
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-full">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  60x Faster
                </div>
              </div>
            </div>
          </motion.div>

          {/* ACM 2.0 approach */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center lg:text-left">
              With ACM 2.0
            </h3>
            {platformSteps.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-gradient-to-br from-white to-purple-50 border-l-4 border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">{item.step}</div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded font-mono font-semibold">
                        {item.time}
                      </span>
                      <span className="text-gray-700 font-medium">{item.result}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 lg:p-12 shadow-2xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/grid.svg')]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-white/80 text-lg font-semibold mb-4">
                Average Time Savings Per Query
              </div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="text-white/70 line-through text-3xl lg:text-4xl font-bold">
                  3+ hours
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  →
                </motion.div>
                <div className="text-white text-5xl lg:text-6xl font-bold">
                  3 minutes
                </div>
              </div>
              <div className="mt-6 text-cyan-300 text-lg font-medium">
                That's <span className="text-2xl font-bold">60x faster</span> research velocity
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
