"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Network, RefreshCw, Sparkles, Info } from "lucide-react";
import KnowledgeGraphVisualization from "@/components/knowledge/KnowledgeGraphVisualization";
import { LoadingSpinner } from "@/components/ui/loading-states";

interface GraphData {
  nodes: any[];
  links: any[];
  useFallback?: boolean;
  message?: string;
}

function KnowledgeGraphContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("queryId");

  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        setLoading(true);
        const url = queryId
          ? `/api/knowledge-graph?queryId=${queryId}`
          : "/api/knowledge-graph";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch knowledge graph");
        }

        const graphData = await response.json();
        setData(graphData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchGraph();
  }, [queryId]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Hero Header */}
      <header className="bg-white border-b-2 border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/researcher"
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Network className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Knowledge Graph
              </h1>
              <p className="text-neutral-600 text-lg">
                {queryId
                  ? "Visualize concepts and relationships from this query"
                  : "Explore your research knowledge network"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 border border-purple-200 text-center"
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center"
              >
                <Network className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Building Knowledge Graph
                </h3>
                <p className="text-neutral-600">
                  Analyzing your research data and creating connections...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Graph</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {data.nodes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-purple-200 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl gradient-accent flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Start Building Your Knowledge Graph
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Your knowledge graph will automatically grow as you submit queries and explore research topics.
                </p>
                <Link
                  href="/researcher/query/new"
                  className="inline-block px-8 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
                >
                  Submit Your First Query
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
                {/* Stats Header */}
                <div className="bg-gradient-card border-b border-purple-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">{data.nodes.length}</div>
                        <div className="text-sm text-neutral-600 font-medium">Concepts</div>
                      </div>
                      <div className="w-px h-12 bg-purple-200" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{data.links.length}</div>
                        <div className="text-sm text-neutral-600 font-medium">Connections</div>
                      </div>
                      {data.useFallback && (
                        <>
                          <div className="w-px h-12 bg-purple-200" />
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-medium">
                              {data.message || "Generated from profile"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 font-medium transition-all hover-lift"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </button>
                      {queryId && (
                        <Link
                          href="/researcher/knowledge-graph"
                          className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                          style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
                        >
                          <Network className="w-4 h-4" />
                          View Full Graph
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div className="p-6">
                  <KnowledgeGraphVisualization data={data} />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function KnowledgeGraphClient() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <KnowledgeGraphContent />
    </Suspense>
  );
}
