"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SuggestedQuestions } from "./SuggestedQuestions";

export function QueryBuilder() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<string[]>(["openalex", "pubmed"]);
  const [llms, setLlms] = useState<string[]>(["claude"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minCitations, setMinCitations] = useState<number | "">("");
  const [publicationType, setPublicationType] = useState<string>("all");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [maxResults, setMaxResults] = useState(25);

  const availableSources = [
    { id: "openalex", name: "OpenAlex", description: "Scholarly works & papers" },
    { id: "pubmed", name: "PubMed", description: "Biomedical literature" },
    { id: "patents", name: "Patents", description: "Patent database" },
  ];

  const availableLLMs = [
    { id: "claude", name: "Claude (Anthropic)", description: "Best for detailed analysis" },
    { id: "gpt4", name: "GPT-4 (OpenAI)", description: "Alternative perspective" },
    { id: "ollama", name: "Ollama (Local)", description: "Run models locally (Llama 2, Mistral, etc.)" },
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
          maxResults,
          filters: {
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            minCitations: minCitations || undefined,
            publicationType: publicationType !== "all" ? publicationType : undefined,
            openAccessOnly,
          },
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Query Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <label htmlFor="query" className="block text-base font-semibold text-gray-900 mb-3">
            Research Query
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Latest developments in CAR-T cell therapy for solid tumors"
            rows={5}
            className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-base p-4"
            disabled={loading}
          />
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Describe what you're looking for. The AI will refine your query for optimal results.
          </p>
        </div>

        {/* Suggested Questions - shown when query is empty */}
        {!query.trim() && !loading && (
          <SuggestedQuestions
            onQuestionSelect={(selectedQuestion) => {
              setQuery(selectedQuestion);
              // Scroll to query input
              document.getElementById('query')?.focus();
            }}
            limit={5}
          />
        )}

        {/* Data Sources */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <label className="block text-base font-semibold text-gray-900 mb-5">
            Data Sources
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableSources.map((source) => (
              <label
                key={source.id}
                className={`flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  sources.includes(source.id)
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold text-gray-900">{source.name}</div>
                  <input
                    type="checkbox"
                    checked={sources.includes(source.id)}
                    onChange={() => toggleSource(source.id)}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                </div>
                <div className="text-sm text-gray-600">{source.description}</div>
              </label>
            ))}
          </div>
        </div>

        {/* LLM Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <label className="block text-base font-semibold text-gray-900 mb-5">
            AI Analysis Models
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableLLMs.map((llm) => (
              <label
                key={llm.id}
                className={`flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  llms.includes(llm.id)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold text-gray-900">{llm.name}</div>
                  <input
                    type="checkbox"
                    checked={llms.includes(llm.id)}
                    onChange={() => toggleLLM(llm.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                </div>
                <div className="text-sm text-gray-600">{llm.description}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors"
          >
            <span>Advanced Filters</span>
            <svg
              className={`w-6 h-6 transform transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="mt-6 space-y-5 pt-6 border-t border-gray-200">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Published From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-3"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Published To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-3"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Minimum Citations */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Minimum Citation Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={minCitations}
                  onChange={(e) => setMinCitations(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="e.g., 10"
                  className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-3"
                  disabled={loading}
                />
              </div>

              {/* Publication Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Publication Type
                </label>
                <select
                  value={publicationType}
                  onChange={(e) => setPublicationType(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-3"
                  disabled={loading}
                >
                  <option value="all">All Types</option>
                  <option value="article">Journal Article</option>
                  <option value="review">Review</option>
                  <option value="clinical-trial">Clinical Trial</option>
                  <option value="meta-analysis">Meta-Analysis</option>
                  <option value="case-report">Case Report</option>
                </select>
              </div>

              {/* Max Results */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Maximum Results
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value) || 25)}
                  className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all p-3"
                  disabled={loading}
                />
              </div>

              {/* Open Access Only */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={openAccessOnly}
                  onChange={(e) => setOpenAccessOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Open Access Only
                </span>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl font-medium shadow-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
