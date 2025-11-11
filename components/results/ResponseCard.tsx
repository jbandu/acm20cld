"use client";

import { useState, useMemo } from "react";
import { FeedbackButtons } from "./FeedbackButtons";
import { CopyButton } from "@/components/ui/CopyButton";

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

interface Paper {
  type: string;
  source: string;
  id: string;
  doi?: string;
  title: string;
  authors?: string[];
  abstract?: string;
  publication_date?: string;
  journal?: string;
  keywords?: string[];
  mesh_terms?: string[];
  url?: string;
  citation_count?: number;
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

  // Parse fullContent to check if it's JSON array of papers
  const parsedPapers = useMemo(() => {
    if (!response.fullContent) return null;
    try {
      const parsed = JSON.parse(response.fullContent);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type === "paper") {
        return parsed as Paper[];
      }
    } catch (e) {
      // Not valid JSON or not a papers array
    }
    return null;
  }, [response.fullContent]);

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
          <div className="flex items-start justify-between gap-2">
            <p className="text-gray-700 whitespace-pre-wrap flex-1">{response.summary}</p>
            <CopyButton text={response.summary} size="sm" className="flex-shrink-0 mt-1" />
          </div>
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
              <div className="mt-4 space-y-4">
                {parsedPapers ? (
                  // Display formatted papers
                  parsedPapers.map((paper, index) => (
                    <div
                      key={paper.id || index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      {/* Paper Title */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-semibold text-gray-900 flex-1">
                          {paper.title}
                        </h4>
                        <CopyButton
                          text={`${paper.title}\n\nAuthors: ${paper.authors?.join(", ") || "N/A"}\n\n${paper.abstract || ""}`}
                          size="sm"
                          className="flex-shrink-0"
                        />
                      </div>

                      {/* Authors */}
                      {paper.authors && paper.authors.length > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Authors:</span>{" "}
                          {paper.authors.slice(0, 5).join(", ")}
                          {paper.authors.length > 5 && ` +${paper.authors.length - 5} more`}
                        </p>
                      )}

                      {/* Journal and Date */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                        {paper.journal && (
                          <span className="px-2 py-1 bg-white rounded border border-gray-200">
                            📖 {paper.journal}
                          </span>
                        )}
                        {paper.publication_date && (
                          <span className="px-2 py-1 bg-white rounded border border-gray-200">
                            📅 {new Date(paper.publication_date).toLocaleDateString()}
                          </span>
                        )}
                        {paper.citation_count !== undefined && paper.citation_count > 0 && (
                          <span className="px-2 py-1 bg-blue-50 rounded border border-blue-200 text-blue-700">
                            📊 {paper.citation_count} citations
                          </span>
                        )}
                      </div>

                      {/* Abstract */}
                      {paper.abstract && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                          {paper.abstract}
                        </p>
                      )}

                      {/* Keywords/MeSH Terms */}
                      {(paper.keywords || paper.mesh_terms) && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(paper.keywords || paper.mesh_terms)?.slice(0, 5).map((keyword, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-2 mt-3">
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            DOI: {paper.doi}
                          </a>
                        )}
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Full Text →
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to raw text display
                  <div className="p-4 bg-gray-50 rounded-lg relative">
                    <div className="absolute top-2 right-2">
                      <CopyButton text={response.fullContent} size="sm" />
                    </div>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans pr-10">
                      {response.fullContent}
                    </pre>
                  </div>
                )}
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
