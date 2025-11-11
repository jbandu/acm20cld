"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface QueryHistoryClientProps {
  queries: any[];
  session: any;
}

export function QueryHistoryClient({ queries, session }: QueryHistoryClientProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredQueries = queries.filter((query) => {
    if (filter === "ALL") return true;
    return query.status === filter;
  });

  const statusConfig: Record<string, {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: any;
    label: string;
  }> = {
    PENDING: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: Clock,
      label: "Pending"
    },
    PROCESSING: {
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Loader,
      label: "Processing"
    },
    COMPLETED: {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle,
      label: "Completed"
    },
    FAILED: {
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: AlertCircle,
      label: "Failed"
    },
  };

  const filterOptions = [
    { value: "ALL", label: "All Queries", count: queries.length },
    { value: "COMPLETED", label: "Completed", count: queries.filter(q => q.status === "COMPLETED").length },
    { value: "PROCESSING", label: "Processing", count: queries.filter(q => q.status === "PROCESSING").length },
    { value: "PENDING", label: "Pending", count: queries.filter(q => q.status === "PENDING").length },
    { value: "FAILED", label: "Failed", count: queries.filter(q => q.status === "FAILED").length },
  ];

  if (queries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Queries Yet</h3>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          Start your research journey by creating your first query. We'll help you find the most relevant papers and insights.
        </p>
        <Link
          href="/researcher/query/new"
          className="inline-block px-8 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
        >
          Create Your First Query
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
      >
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-5 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                filter === option.value
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={filter === option.value ? {
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
              } : {}}
            >
              {option.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                filter === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Query Cards Grid */}
      <AnimatePresence mode="popLayout">
        {filteredQueries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200"
          >
            <p className="text-neutral-600">No queries found with the selected filter.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredQueries.map((query: any, index: number) => {
              const config = statusConfig[query.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={query.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/researcher/query/${query.id}`}
                    className="block bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-purple-300 hover-lift transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
                          {query.originalQuery}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">
                          {new Date(query.startedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${config.bgColor} ${config.borderColor} ${config.color}`}>
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{config.label}</span>
                      </div>
                    </div>

                    {/* Sources */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {query.sources.map((source: string) => (
                        <span
                          key={source}
                          className="badge-primary"
                        >
                          {source}
                        </span>
                      ))}
                    </div>

                    {/* Results Count with Progress Bar */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Results Found</span>
                        <span className="text-2xl font-bold gradient-text">
                          {query.responses.length}
                        </span>
                      </div>
                      {query.status === "COMPLETED" && query.responses.length > 0 && (
                        <div className="progress-bar mt-2">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min((query.responses.length / 25) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* LLMs Used */}
                    {query.llms && query.llms.length > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-500">AI Models:</span>
                        {query.llms.map((llm: string) => (
                          <span
                            key={llm}
                            className="badge-secondary text-xs"
                          >
                            {llm}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-4"
      >
        <Link
          href="/researcher/query/new"
          className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Query
        </Link>
      </motion.div>
    </div>
  );
}
