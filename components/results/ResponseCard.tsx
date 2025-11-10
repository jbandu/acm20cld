"use client";

import { useState } from "react";
import { FeedbackButtons } from "./FeedbackButtons";

interface Response {
  id: string;
  source: string;
  summary: string;
  fullContent: string;
  relevanceScore: number | null;
  citationCount: number | null;
  metadata: any;
  createdAt: Date;
}

export function ResponseCard({
  response,
  queryId,
}: {
  response: Response;
  queryId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const sourceIcons: Record<string, string> = {
    openalex: "📚",
    pubmed: "🔬",
    patents: "📄",
    claude: "🤖",
    gpt4: "🧠",
  };

  const sourceNames: Record<string, string> = {
    openalex: "OpenAlex",
    pubmed: "PubMed",
    patents: "Patents",
    claude: "Claude Analysis",
    gpt4: "GPT-4 Analysis",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{sourceIcons[response.source] || "📊"}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {sourceNames[response.source] || response.source}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(response.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            {response.relevanceScore && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                Relevance: {(response.relevanceScore * 100).toFixed(0)}%
              </span>
            )}
            {response.citationCount !== null && response.citationCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {response.citationCount} citations
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{response.summary}</p>
        </div>

        {/* Expand/Collapse */}
        {response.fullContent && response.fullContent !== response.summary && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {expanded ? "Hide Details" : "Show Full Content"}
            </button>

            {expanded && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {response.fullContent}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        {response.metadata && Object.keys(response.metadata).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer font-medium">Metadata</summary>
              <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
                {JSON.stringify(response.metadata, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <FeedbackButtons responseId={response.id} queryId={queryId} />
      </div>
    </div>
  );
}
