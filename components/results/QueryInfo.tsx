"use client";

import { CopyButton } from "@/components/ui/CopyButton";

interface QueryInfoProps {
  originalQuery: string;
  refinedQuery?: string | null;
  sources: string[];
  llms: string[];
  startedAt: Date;
  completedAt?: Date | null;
}

export function QueryInfo({
  originalQuery,
  refinedQuery,
  sources,
  llms,
  startedAt,
  completedAt,
}: QueryInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Query</h2>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500">Original Query:</span>
          <div className="flex items-start justify-between gap-2 mt-1">
            <p className="text-gray-900 flex-1">{originalQuery}</p>
            <CopyButton text={originalQuery} size="sm" className="flex-shrink-0" />
          </div>
        </div>
        {refinedQuery && (
          <div>
            <span className="text-sm font-medium text-gray-500">Refined Query:</span>
            <div className="flex items-start justify-between gap-2 mt-1">
              <p className="text-gray-900 flex-1">{refinedQuery}</p>
              <CopyButton text={refinedQuery} size="sm" className="flex-shrink-0" />
            </div>
          </div>
        )}
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Sources:</span>
            <div className="flex gap-2 mt-1">
              {sources.map((source) => (
                <span
                  key={source}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-500">LLMs:</span>
            <div className="flex gap-2 mt-1">
              {llms.map((llm) => (
                <span
                  key={llm}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {llm}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Submitted: {new Date(startedAt).toLocaleString()}
          {completedAt &&
            ` • Completed: ${new Date(completedAt).toLocaleString()}`}
        </div>
      </div>
    </div>
  );
}
