"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QueryRefinement {
  originalQuery: string;
  refinedQuery: string;
  reasoning: string;
  suggestions: {
    term: string;
    explanation: string;
  }[];
  filters: {
    dateRange?: string;
    keywords?: string[];
    excludeTerms?: string[];
  };
}

interface QueryRefinementModalProps {
  isOpen: boolean;
  originalQuery: string;
  userContext: {
    interests?: string[];
    expertiseLevel?: string;
  };
  onAccept: (refinedQuery: string) => void;
  onReject: () => void;
  onClose: () => void;
}

export function QueryRefinementModal({
  isOpen,
  originalQuery,
  userContext,
  onAccept,
  onReject,
  onClose,
}: QueryRefinementModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refinement, setRefinement] = useState<QueryRefinement | null>(null);
  const [editedQuery, setEditedQuery] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (isOpen && originalQuery) {
      fetchRefinement();
    }
  }, [isOpen, originalQuery]);

  const fetchRefinement = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/query/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: originalQuery,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine query");
      }

      const data = await response.json();
      setRefinement(data);
      setEditedQuery(data.refinedQuery);
    } catch (err: any) {
      setError(err.message || "Failed to refine query");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    fetchRefinement();
  };

  const handleAccept = () => {
    onAccept(editedQuery);
  };

  const handleUseOriginal = () => {
    onReject();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">AI Query Refinement</h2>
                <p className="text-purple-100 text-sm">
                  Optimize your query for better results
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-gray-600">Analyzing and refining your query...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                <p className="font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            ) : refinement ? (
              <div className="space-y-6">
                {/* Comparison Toggle */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {showComparison ? "Hide" : "Show"} Comparison
                  </button>
                </div>

                {/* Comparison View */}
                {showComparison && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="text-sm font-semibold text-gray-500 mb-2">ORIGINAL</div>
                      <div className="text-gray-900">{refinement.originalQuery}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                      <div className="text-sm font-semibold text-purple-700 mb-2">REFINED</div>
                      <div className="text-gray-900 font-medium">{refinement.refinedQuery}</div>
                    </div>
                  </div>
                )}

                {/* Refined Query (Editable) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Refined Query
                  </label>
                  <textarea
                    value={editedQuery}
                    onChange={(e) => setEditedQuery(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border-2 border-purple-300 bg-purple-50/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-4 text-base font-medium text-gray-900"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    You can edit the refined query before accepting
                  </p>
                </div>

                {/* AI Reasoning */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-900 mb-2">Why this refinement?</div>
                      <div className="text-sm text-blue-800">{refinement.reasoning}</div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {refinement.suggestions.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-3">Key Improvements</div>
                    <div className="space-y-2">
                      {refinement.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{suggestion.term}</div>
                            <div className="text-sm text-gray-600">{suggestion.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Filters */}
                {(refinement.filters.dateRange || refinement.filters.keywords?.length || refinement.filters.excludeTerms?.length) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="text-sm font-semibold text-yellow-900 mb-3">Recommended Filters</div>
                    <div className="space-y-2 text-sm">
                      {refinement.filters.dateRange && (
                        <div>
                          <span className="font-medium text-yellow-900">Date Range:</span>{" "}
                          <span className="text-yellow-800">{refinement.filters.dateRange}</span>
                        </div>
                      )}
                      {refinement.filters.keywords && refinement.filters.keywords.length > 0 && (
                        <div>
                          <span className="font-medium text-yellow-900">Key Terms:</span>{" "}
                          <span className="text-yellow-800">{refinement.filters.keywords.join(", ")}</span>
                        </div>
                      )}
                      {refinement.filters.excludeTerms && refinement.filters.excludeTerms.length > 0 && (
                        <div>
                          <span className="font-medium text-yellow-900">Exclude:</span>{" "}
                          <span className="text-yellow-800">{refinement.filters.excludeTerms.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleRegenerate}
              disabled={loading || regenerating}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {regenerating ? "Regenerating..." : "Try Another"}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUseOriginal}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Use Original
              </button>
              <button
                onClick={handleAccept}
                disabled={!editedQuery.trim()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Accept & Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
