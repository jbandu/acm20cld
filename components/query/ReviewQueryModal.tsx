"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QueryData {
  query: string;
  sources: string[];
  llms: string[];
  maxResults: number;
  filters: {
    dateFrom?: string;
    dateTo?: string;
    minCitations?: number;
    publicationType?: string;
    openAccessOnly: boolean;
  };
}

interface DataElement {
  id: string;
  label: string;
  value: string;
  destination: string[];
  category: string;
  included: boolean;
  required?: boolean;
}

interface ReviewQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  queryData: QueryData;
  onSubmit: (selectedData: QueryData) => void;
  loading: boolean;
}

export function ReviewQueryModal({
  isOpen,
  onClose,
  queryData,
  onSubmit,
  loading,
}: ReviewQueryModalProps) {
  // Build data elements from query data
  const buildDataElements = (): DataElement[] => {
    const elements: DataElement[] = [];

    // Query text
    elements.push({
      id: "query",
      label: "Research Query",
      value: queryData.query,
      destination: [...queryData.sources.map(s => getSourceName(s)), ...queryData.llms.map(l => getLLMName(l))],
      category: "Core",
      included: true,
      required: true,
    });

    // Sources
    queryData.sources.forEach((source) => {
      elements.push({
        id: `source-${source}`,
        label: `Search ${getSourceName(source)}`,
        value: `Enabled`,
        destination: [getSourceName(source)],
        category: "Data Sources",
        included: true,
      });
    });

    // LLMs
    queryData.llms.forEach((llm) => {
      elements.push({
        id: `llm-${llm}`,
        label: `${getLLMName(llm)} Analysis`,
        value: `Enabled`,
        destination: [getLLMName(llm)],
        category: "AI Models",
        included: true,
      });
    });

    // Filters
    if (queryData.filters.dateFrom) {
      elements.push({
        id: "filter-dateFrom",
        label: "Date From Filter",
        value: queryData.filters.dateFrom,
        destination: queryData.sources.map(s => getSourceName(s)),
        category: "Filters",
        included: true,
      });
    }

    if (queryData.filters.dateTo) {
      elements.push({
        id: "filter-dateTo",
        label: "Date To Filter",
        value: queryData.filters.dateTo,
        destination: queryData.sources.map(s => getSourceName(s)),
        category: "Filters",
        included: true,
      });
    }

    if (queryData.filters.minCitations) {
      elements.push({
        id: "filter-minCitations",
        label: "Minimum Citations",
        value: queryData.filters.minCitations.toString(),
        destination: queryData.sources.map(s => getSourceName(s)),
        category: "Filters",
        included: true,
      });
    }

    if (queryData.filters.publicationType && queryData.filters.publicationType !== "all") {
      elements.push({
        id: "filter-publicationType",
        label: "Publication Type",
        value: queryData.filters.publicationType,
        destination: queryData.sources.map(s => getSourceName(s)),
        category: "Filters",
        included: true,
      });
    }

    if (queryData.filters.openAccessOnly) {
      elements.push({
        id: "filter-openAccess",
        label: "Open Access Only",
        value: "Yes",
        destination: queryData.sources.map(s => getSourceName(s)),
        category: "Filters",
        included: true,
      });
    }

    elements.push({
      id: "maxResults",
      label: "Maximum Results",
      value: queryData.maxResults.toString(),
      destination: queryData.sources.map(s => getSourceName(s)),
      category: "Settings",
      included: true,
    });

    return elements;
  };

  const [dataElements, setDataElements] = useState<DataElement[]>(buildDataElements());

  const toggleElement = (id: string) => {
    setDataElements((prev) =>
      prev.map((elem) =>
        elem.id === id && !elem.required ? { ...elem, included: !elem.included } : elem
      )
    );
  };

  const handleSubmit = () => {
    // Build modified query data based on selected elements
    const modifiedData: QueryData = {
      query: queryData.query, // Always required
      sources: dataElements
        .filter((e) => e.id.startsWith("source-") && e.included)
        .map((e) => e.id.replace("source-", "")),
      llms: dataElements
        .filter((e) => e.id.startsWith("llm-") && e.included)
        .map((e) => e.id.replace("llm-", "")),
      maxResults: queryData.maxResults,
      filters: {
        dateFrom: dataElements.find((e) => e.id === "filter-dateFrom")?.included
          ? queryData.filters.dateFrom
          : undefined,
        dateTo: dataElements.find((e) => e.id === "filter-dateTo")?.included
          ? queryData.filters.dateTo
          : undefined,
        minCitations: dataElements.find((e) => e.id === "filter-minCitations")?.included
          ? queryData.filters.minCitations
          : undefined,
        publicationType: dataElements.find((e) => e.id === "filter-publicationType")?.included
          ? queryData.filters.publicationType
          : undefined,
        openAccessOnly: dataElements.find((e) => e.id === "filter-openAccess")?.included
          ? queryData.filters.openAccessOnly
          : false,
      },
    };

    onSubmit(modifiedData);
  };

  const groupedElements = dataElements.reduce((acc, elem) => {
    if (!acc[elem.category]) {
      acc[elem.category] = [];
    }
    acc[elem.category].push(elem);
    return acc;
  }, {} as Record<string, DataElement[]>);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review Your Query
                </h2>
                <p className="text-gray-600">
                  Review and control what data is sent to external services
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <strong>Privacy Control:</strong> Uncheck any data you don't want to share. Required items cannot be unchecked.
                </div>
              </div>
            </div>
          </div>

          {/* Data Elements by Category */}
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {Object.entries(groupedElements).map(([category, elements]) => (
              <div key={category} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                <div className="space-y-3">
                  {elements.map((elem) => (
                    <div
                      key={elem.id}
                      className={`bg-white rounded-lg p-4 border-2 transition-all ${
                        elem.included
                          ? "border-green-300 bg-green-50/30"
                          : "border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={elem.included}
                          onChange={() => toggleElement(elem.id)}
                          disabled={elem.required || loading}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{elem.label}</span>
                            {elem.required && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2 break-words">{elem.value}</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500 mr-1">Sent to:</span>
                            {elem.destination.map((dest, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                              >
                                {dest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !dataElements.some((e) => e.included)}
              className="flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Submitting...
                </span>
              ) : (
                "Submit Query"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper functions
function getSourceName(sourceId: string): string {
  const names: Record<string, string> = {
    openalex: "OpenAlex",
    pubmed: "PubMed",
    patents: "Patents API",
  };
  return names[sourceId] || sourceId;
}

function getLLMName(llmId: string): string {
  const names: Record<string, string> = {
    claude: "Claude (Anthropic)",
    gpt4: "GPT-4 (OpenAI)",
    ollama: "Ollama (Local)",
  };
  return names[llmId] || llmId;
}
