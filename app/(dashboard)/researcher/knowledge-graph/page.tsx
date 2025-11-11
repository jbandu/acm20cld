"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KnowledgeGraphVisualization from "@/components/knowledge/KnowledgeGraphVisualization";

interface GraphData {
  nodes: any[];
  links: any[];
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Knowledge Graph Visualization
        </h1>
        <p className="text-gray-600 mt-2">
          {queryId
            ? "Visualize concepts and their relationships from this query"
            : "Explore your research knowledge graph"}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading knowledge graph...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.nodes.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 font-medium">
                No knowledge graph data available yet
              </p>
              <p className="text-yellow-600 mt-2 text-sm">
                Submit some queries to start building your knowledge graph!
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{data.nodes.length}</span>{" "}
                  concepts •{" "}
                  <span className="font-semibold">{data.links.length}</span>{" "}
                  relationships
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Refresh
                  </button>
                  {queryId && (
                    <a
                      href="/researcher/knowledge-graph"
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View All Concepts
                    </a>
                  )}
                </div>
              </div>

              <KnowledgeGraphVisualization data={data} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function KnowledgeGraphPage() {
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
