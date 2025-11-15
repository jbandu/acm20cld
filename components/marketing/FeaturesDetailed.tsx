"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Feature {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  gradient: string;
  specs: { label: string; value: string }[];
  description: string;
  examples: string[];
  cta: { text: string; href: string };
}

const features: Feature[] = [
  {
    id: "multi-source",
    title: "Multi-Source Intelligence",
    tagline: "Search the entire research universe in seconds",
    icon: "🌐",
    gradient: "from-purple-500 to-blue-500",
    specs: [
      { label: "Research Papers", value: "40M+" },
      { label: "Patents", value: "12M+" },
      { label: "Clinical Trials", value: "450K+" },
      { label: "Data Sources", value: "5+" },
    ],
    description:
      "Connect to the world's largest research databases simultaneously. Our AI searches PubMed (35M+ biomedical papers), OpenAlex (250M+ works), arXiv (2M+ preprints), USPTO/EPO patents (12M+), and ClinicalTrials.gov (450K+ trials) - all in a single query.",
    examples: [
      "PubMed: Latest peer-reviewed oncology research",
      "OpenAlex: Cross-disciplinary connections",
      "arXiv: Pre-publication breakthroughs",
      "Patents: Commercial applications & IP",
      "ClinicalTrials.gov: Ongoing & completed trials",
    ],
    cta: { text: "Try Multi-Search", href: "/researcher/query/new" },
  },
  {
    id: "intelligent-questions",
    title: "Intelligent Question Engine",
    tagline: "Never run out of breakthrough ideas",
    icon: "💡",
    gradient: "from-cyan-500 to-teal-500",
    specs: [
      { label: "Questions/Day", value: "5 Fresh" },
      { label: "Accuracy", value: "92%" },
      { label: "Personalization", value: "100%" },
      { label: "Data Sources", value: "4+" },
    ],
    description:
      "Our AI analyzes your research history, maps knowledge graph gaps, tracks trending topics, and identifies upcoming conference deadlines to generate 5 personalized research questions every day. Each question is designed to push your work forward.",
    examples: [
      "Based on your profile: Latest CAR-T modifications for solid tumors",
      "Knowledge gap identified: Unexplored PD-1/CTLA-4 combinations",
      "Trending now: AI-designed cancer vaccines in Phase I trials",
      "Conference deadline (ASCO): Novel biomarkers for early detection",
      "Team insight: Your colleague discovered liquid biopsy breakthrough",
    ],
    cta: { text: "See Your Questions", href: "/researcher/query/new" },
  },
  {
    id: "multi-llm",
    title: "Multi-LLM Analysis",
    tagline: "Three AI perspectives on every discovery",
    icon: "🤖",
    gradient: "from-blue-500 to-purple-500",
    specs: [
      { label: "AI Models", value: "3 Leading" },
      { label: "Analysis Time", value: "<30s" },
      { label: "Accuracy", value: "95%+" },
      { label: "Consistency Check", value: "Auto" },
    ],
    description:
      "Don't rely on a single AI. We analyze every result with Claude (thorough mechanism analysis), GPT-4 (quick synthesis), and Gemini (detail catching). Get multiple perspectives to catch insights others miss.",
    examples: [
      "Claude: Deep dive into molecular mechanisms and pathways",
      "GPT-4: Quick synthesis connecting disparate findings",
      "Gemini: Catches edge cases and contradictions in data",
      "Cross-validation: Highlights where AI models agree/disagree",
      "Confidence scores: Know which insights are most reliable",
    ],
    cta: { text: "Compare AI Models", href: "/researcher/query/new" },
  },
  {
    id: "knowledge-graph",
    title: "Knowledge Graph Explorer",
    tagline: "See connections invisible to traditional search",
    icon: "🔗",
    gradient: "from-teal-500 to-green-500",
    specs: [
      { label: "Concepts Mapped", value: "2.4M+" },
      { label: "Relationships", value: "18M+" },
      { label: "Update Frequency", value: "Daily" },
      { label: "Citation Depth", value: "6 Levels" },
    ],
    description:
      "Explore an interactive graph connecting concepts, papers, proteins, pathways, and clinical trials. Discover unexpected connections that lead to breakthroughs. Our AI maps the entire cancer research landscape.",
    examples: [
      "Concept → Papers: CAR-T connects to 12,447 papers",
      "Paper → Proteins: Study mentions EGFR, KRAS, BRAF pathways",
      "Protein → Trials: 234 active trials targeting these proteins",
      "Hidden connection: Diabetes drug shows promise in tumor metabolism",
      "Citation network: Track how ideas evolved over 20 years",
    ],
    cta: { text: "Explore Graph", href: "/researcher/query/new" },
  },
  {
    id: "research-agent",
    title: "Nightly Research Agent",
    tagline: "Your AI researcher works while you sleep",
    icon: "🌙",
    gradient: "from-indigo-500 to-purple-500",
    specs: [
      { label: "Searches/Night", value: "10 Auto" },
      { label: "Papers Reviewed", value: "500+" },
      { label: "Digest Delivery", value: "7 AM" },
      { label: "Relevance", value: "98%" },
    ],
    description:
      "Set your research interests once. Our AI agent runs searches overnight, reviews hundreds of new papers, filters for relevance, and delivers a personalized digest every morning. Never miss a breakthrough again.",
    examples: [
      "7 AM digest: 12 relevant papers published yesterday",
      "Priority alerts: Breakthrough in CAR-T exhaustion mechanisms",
      "Trend analysis: 23% increase in liquid biopsy publications",
      "Conference watch: Abstract deadline in 14 days for ASCO",
      "Collaboration opportunity: 3 researchers working on similar topics",
    ],
    cta: { text: "Set Up Agent", href: "/researcher/profile" },
  },
];

export function FeaturesDetailed() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-6">
            Killer Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Research Tools Built for
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PhD-Level Scientists
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature is designed with scientific rigor and research velocity in mind
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                {/* Feature header (always visible) */}
                <button
                  onClick={() =>
                    setExpandedFeature(
                      expandedFeature === feature.id ? null : feature.id
                    )
                  }
                  className="w-full text-left p-6 lg:p-8 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-6 flex-1">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>

                      {/* Title & specs */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{feature.tagline}</p>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {feature.specs.map((spec) => (
                            <div key={spec.label} className="text-center lg:text-left">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                {spec.value}
                              </div>
                              <div className="text-xs text-gray-600 font-medium">
                                {spec.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <motion.div
                      animate={{ rotate: expandedFeature === feature.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </button>

                {/* Expandable content */}
                <AnimatePresence>
                  {expandedFeature === feature.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 lg:px-8 pb-8 border-t border-gray-200 pt-6 bg-gradient-to-br from-gray-50 to-white">
                        {/* Description */}
                        <div className="mb-6">
                          <p className="text-gray-700 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        {/* Examples */}
                        <div className="mb-6">
                          <div className="text-sm font-semibold text-gray-900 mb-3">
                            What You Get:
                          </div>
                          <div className="space-y-2">
                            {feature.examples.map((example, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <span className={`flex-shrink-0 w-6 h-6 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                  {i + 1}
                                </span>
                                <span className="font-mono text-xs leading-relaxed">
                                  {example}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div>
                          <a
                            href={feature.cta.href}
                            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95`}
                          >
                            {feature.cta.text}
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
