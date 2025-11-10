"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function QueryBuilder() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<string[]>(["openalex", "pubmed"]);
  const [llms, setLlms] = useState<string[]>(["claude"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSources = [
    { id: "openalex", name: "OpenAlex", description: "Scholarly works & papers" },
    { id: "pubmed", name: "PubMed", description: "Biomedical literature" },
    { id: "patents", name: "Patents", description: "Patent database" },
  ];

  const availableLLMs = [
    { id: "claude", name: "Claude (Anthropic)", description: "Best for detailed analysis" },
    { id: "gpt4", name: "GPT-4 (OpenAI)", description: "Alternative perspective" },
  ];

  const toggleSource = (sourceId: string) => {
    setSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleLLM = (llmId: string) => {
    setLlms((prev) =>
      prev.includes(llmId) ? prev.filter((l) => l !== llmId) : [...prev, llmId]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!query.trim()) {
      setError("Please enter a research query");
      return;
    }

    if (sources.length === 0) {
      setError("Please select at least one data source");
      return;
    }

    if (llms.length === 0) {
      setError("Please select at least one LLM for analysis");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          sources,
          llms,
          maxResults: 25,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit query");
      }

      const data = await response.json();
      router.push(`/researcher/query/${data.queryId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Query Input */}
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Research Query
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Latest developments in CAR-T cell therapy for solid tumors"
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Describe what you're looking for. The AI will refine your query for optimal results.
          </p>
        </div>

        {/* Data Sources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Data Sources
          </label>
          <div className="space-y-2">
            {availableSources.map((source) => (
              <label
                key={source.id}
                className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={sources.includes(source.id)}
                  onChange={() => toggleSource(source.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{source.name}</div>
                  <div className="text-xs text-gray-500">{source.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* LLM Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            AI Analysis (Select LLMs)
          </label>
          <div className="space-y-2">
            {availableLLMs.map((llm) => (
              <label
                key={llm.id}
                className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={llms.includes(llm.id)}
                  onChange={() => toggleLLM(llm.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{llm.name}</div>
                  <div className="text-xs text-gray-500">{llm.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Query...
            </span>
          ) : (
            "Submit Research Query"
          )}
        </button>
      </form>
    </div>
  );
}
