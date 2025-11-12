"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string | null;
  department?: string | null;
  institution?: string | null;
  researchProfile?: {
    primaryInterests: string[];
    secondaryInterests: string[];
    expertiseLevel: string;
    yearsInField?: number | null;
    researchAreas: string[];
  } | null;
}

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

interface ServicePayload {
  serviceName: string;
  type: "llm" | "datasource";
  payload: string;
  description: string;
}

interface ReviewQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  queryData: QueryData;
  onSubmit: (selectedData: QueryData) => void;
  loading: boolean;
}

export function ReviewQueryModal({
  isOpen,
  onClose,
  userProfile,
  queryData,
  onSubmit,
  loading,
}: ReviewQueryModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "payloads" | "cost">("summary");
  const [expandedPayloads, setExpandedPayloads] = useState<Set<string>>(new Set());

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

  const togglePayloadExpansion = (serviceName: string) => {
    setExpandedPayloads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceName)) {
        newSet.delete(serviceName);
      } else {
        newSet.add(serviceName);
      }
      return newSet;
    });
  };

  // Cost estimation
  interface CostEstimate {
    service: string;
    estimatedCost: number;
    unit: string;
    details: string;
  }

  function estimateQueryCost(queryData: QueryData): {costs: CostEstimate[], total: number} {
    const costs: CostEstimate[] = [];

    // Data source costs (mostly free APIs, but showing for completeness)
    queryData.sources.forEach(source => {
      if (source === "openalex") {
        costs.push({
          service: "OpenAlex API",
          estimatedCost: 0,
          unit: "Free",
          details: `${queryData.maxResults} results - Open access scholarly database`
        });
      } else if (source === "pubmed") {
        costs.push({
          service: "PubMed API",
          estimatedCost: 0,
          unit: "Free",
          details: `${queryData.maxResults} results - NCBI public database`
        });
      } else if (source === "patents") {
        costs.push({
          service: "Patents API",
          estimatedCost: 0,
          unit: "Free",
          details: `${queryData.maxResults} results - Google Patents public data`
        });
      }
    });

    // LLM costs (actual pricing as of 2024/2025)
    queryData.llms.forEach(llm => {
      if (llm === "claude") {
        // Estimate: ~2000 tokens input (context + query) + ~4000 tokens output
        // Claude Sonnet 4: $3/MTok input, $15/MTok output
        const inputCost = (2000 / 1000000) * 3;
        const outputCost = (4000 / 1000000) * 15;
        costs.push({
          service: "Claude (Anthropic)",
          estimatedCost: inputCost + outputCost,
          unit: "USD",
          details: "~2K input tokens + ~4K output tokens (Sonnet 4)"
        });
      } else if (llm === "gpt4") {
        // GPT-4: $10/MTok input, $30/MTok output (approximate)
        const inputCost = (2000 / 1000000) * 10;
        const outputCost = (4000 / 1000000) * 30;
        costs.push({
          service: "GPT-4 (OpenAI)",
          estimatedCost: inputCost + outputCost,
          unit: "USD",
          details: "~2K input tokens + ~4K output tokens (GPT-4)"
        });
      } else if (llm === "ollama") {
        costs.push({
          service: "Ollama (Local)",
          estimatedCost: 0,
          unit: "Free",
          details: "Runs locally - no API costs, only compute resources"
        });
      }
    });

    const total = costs.reduce((sum, c) => sum + c.estimatedCost, 0);

    return { costs, total };
  }

  const buildServicePayloads = (): ServicePayload[] => {
    const payloads: ServicePayload[] = [];
    const userContext = buildUserContext(userProfile);
    const orgContext = buildOrganizationContext();

    // Build LLM prompts
    queryData.llms.forEach((llm) => {
      let payload = "";
      let description = "";

      if (llm === "claude") {
        payload = buildClaudePrompt(queryData, userContext, orgContext);
        description = "Full prompt sent to Claude API (Anthropic)";
      } else if (llm === "gpt4") {
        payload = buildGPT4Prompt(queryData, userContext, orgContext);
        description = "Full prompt sent to GPT-4 API (OpenAI)";
      } else if (llm === "ollama") {
        payload = buildOllamaPrompt(queryData, userContext, orgContext);
        description = "Full prompt sent to Ollama (Local)";
      }

      payloads.push({
        serviceName: getLLMName(llm),
        type: "llm",
        payload,
        description,
      });
    });

    // Build data source queries
    queryData.sources.forEach((source) => {
      let payload = "";
      let description = "";

      if (source === "openalex") {
        payload = buildOpenAlexQuery(queryData);
        description = "API query string sent to OpenAlex";
      } else if (source === "pubmed") {
        payload = buildPubMedQuery(queryData);
        description = "API query string sent to PubMed";
      } else if (source === "patents") {
        payload = buildPatentsQuery(queryData);
        description = "API query string sent to Patents API";
      }

      payloads.push({
        serviceName: getSourceName(source),
        type: "datasource",
        payload,
        description,
      });
    });

    return payloads;
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

  const servicePayloads = buildServicePayloads();

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

            {/* View Toggle */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActiveTab("summary")}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === "summary"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Data Summary
              </button>
              <button
                onClick={() => setActiveTab("payloads")}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === "payloads"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Full Payloads
              </button>
              <button
                onClick={() => setActiveTab("cost")}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === "cost"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cost Estimate
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "summary" ? (
            // Data Summary View
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
          ) : activeTab === "payloads" ? (
            // Full Payloads View
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <div className="text-sm text-yellow-900">
                    <strong>Full Transparency:</strong> Below are the exact prompts and queries being sent to each external service. Click to expand and review.
                  </div>
                </div>
              </div>

              {servicePayloads.map((payload) => (
                <div key={payload.serviceName} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => togglePayloadExpansion(payload.serviceName)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payload.type === "llm"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {payload.type === "llm" ? "LLM" : "Data Source"}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{payload.serviceName}</h4>
                        <p className="text-sm text-gray-600">{payload.description}</p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedPayloads.has(payload.serviceName) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedPayloads.has(payload.serviceName) && (
                    <div className="px-5 pb-5">
                      <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre className="text-green-400 whitespace-pre-wrap break-words">
                          {payload.payload}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Cost Estimate View
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-green-900">
                    <strong>Cost Transparency:</strong> Estimated costs for this query based on current API pricing.
                  </div>
                </div>
              </div>

              {(() => {
                const { costs, total } = estimateQueryCost(queryData);
                return (
                  <>
                    <div className="space-y-3">
                      {costs.map((cost, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{cost.service}</h4>
                            <div className="text-right">
                              {cost.estimatedCost === 0 ? (
                                <span className="text-lg font-bold text-green-600">{cost.unit}</span>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  ${cost.estimatedCost.toFixed(4)} {cost.unit}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{cost.details}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6 mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Estimated Cost</h3>
                          <p className="text-sm text-gray-600">Per query execution</p>
                        </div>
                        <div className="text-right">
                          {total === 0 ? (
                            <div className="text-3xl font-bold text-green-600">FREE</div>
                          ) : (
                            <div className="text-3xl font-bold text-gray-900">${total.toFixed(4)}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                      <p className="text-sm text-yellow-900">
                        <strong>Note:</strong> Actual costs may vary based on response length and token usage. These are estimates based on typical query patterns. Manager and CEO dashboards track actual spending per researcher.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

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

// Context building functions
function buildUserContext(userProfile: UserProfile | null): string {
  if (!userProfile) {
    return "User context unavailable";
  }

  const interests = userProfile.researchProfile?.primaryInterests || [];
  const secondaryInterests = userProfile.researchProfile?.secondaryInterests || [];
  const researchAreas = userProfile.researchProfile?.researchAreas || [];

  return `=== USER CONTEXT ===
User: ${userProfile.name}
Email: ${userProfile.email}
Role: ${userProfile.role}
${userProfile.title ? `Title: ${userProfile.title}` : ''}
${userProfile.department ? `Department: ${userProfile.department}` : ''}
${userProfile.institution ? `Institution: ${userProfile.institution}` : ''}

Research Profile:
${userProfile.researchProfile?.expertiseLevel ? `- Expertise Level: ${userProfile.researchProfile.expertiseLevel}` : ''}
${userProfile.researchProfile?.yearsInField ? `- Years in Field: ${userProfile.researchProfile.yearsInField}` : ''}
${interests.length > 0 ? `- Primary Research Interests: ${interests.join(', ')}` : ''}
${secondaryInterests.length > 0 ? `- Secondary Interests: ${secondaryInterests.join(', ')}` : ''}
${researchAreas.length > 0 ? `- Research Areas: ${researchAreas.join(', ')}` : ''}

NOTE: Future enhancements will include:
- Historical query patterns and preferences
- Collaboration network and team context
- Personal research notes and annotations
- Custom ontology mappings
- Learned search preferences`;
}

function buildOrganizationContext(): string {
  return `=== ORGANIZATION CONTEXT ===
Organization: ACM Biolabs
Institution Type: Advanced Cancer Research Laboratory
Mission: Accelerating cancer research through AI-powered literature analysis and data integration

Research Focus Areas:
- Cancer Biology & Therapeutics
- Immunotherapy & CAR-T Cell Therapy
- Tumor Microenvironment Research
- Biomarker Discovery
- Drug Development & Clinical Trials

Available Resources:
- Premium access to OpenAlex, PubMed, and Patents databases
- AI Analysis via Claude (Anthropic) and GPT-4 (OpenAI)
- Local LLM processing via Ollama
- Integrated knowledge graph (future)
- Proprietary ontology system (future)

Data Governance:
- HIPAA-compliant data handling
- Institutional review board protocols
- Research ethics guidelines
- IP protection policies

NOTE: Future organizational context will include:
- Organization-wide knowledge graph connections
- Shared research ontologies and taxonomies
- Institutional research priorities and strategic themes
- Collaborative research networks
- Internal publication database
- Custom field and terminology mappings`;
}

// LLM prompt builders
function buildClaudePrompt(queryData: QueryData, userContext: string, orgContext: string): string {
  const filterText = buildFilterDescription(queryData.filters);

  return `${userContext}

${orgContext}

=== RESEARCH QUERY ===
Query: "${queryData.query}"
Maximum Results: ${queryData.maxResults}
${filterText ? `Filters: ${filterText}` : ''}

=== YOUR TASK ===
You are an AI research assistant helping researchers at ACM Biolabs analyze scientific literature and data. Your task is to:

1. Analyze the research query in the context of the user's research focus and organization's priorities
2. Review the data retrieved from the following sources: ${queryData.sources.map(s => getSourceName(s)).join(", ")}
3. Synthesize findings across all sources
4. Identify key patterns, trends, and insights
5. Highlight any contradictions or gaps in the literature
6. Suggest potential research directions or follow-up queries

NOTE: Additional context will be included in future versions:
- Knowledge graph connections (related concepts, entities, and relationships)
- Organization's ontology mappings
- User's personal research notes and annotations
- Historical query results and feedback
- Collaborative filtering from similar researchers

Please provide a comprehensive analysis that helps the researcher understand the landscape of their query.`;
}

function buildGPT4Prompt(queryData: QueryData, userContext: string, orgContext: string): string {
  const filterText = buildFilterDescription(queryData.filters);

  return `${userContext}

${orgContext}

=== RESEARCH QUERY ===
Query: "${queryData.query}"
Maximum Results: ${queryData.maxResults}
${filterText ? `Filters: ${filterText}` : ''}

=== YOUR ROLE ===
You are a scientific research assistant for ACM Biolabs. Analyze the provided research data and deliver insights that help advance the researcher's work.

Your analysis should include:
- Summary of key findings across all data sources (${queryData.sources.map(s => getSourceName(s)).join(", ")})
- Identification of most relevant papers, patents, or datasets
- Analysis of methodologies and approaches used in the literature
- Potential applications and implications for the researcher's work
- Recommendations for further investigation

NOTE: Future versions will incorporate:
- Dynamic knowledge graph context
- Organization-specific ontologies and terminologies
- User preference learning
- Cross-reference with internal research database
- Real-time collaboration signals

Provide actionable insights that support evidence-based research decisions.`;
}

function buildOllamaPrompt(queryData: QueryData, userContext: string, orgContext: string): string {
  const filterText = buildFilterDescription(queryData.filters);

  return `${userContext}

${orgContext}

=== RESEARCH QUERY ===
Query: "${queryData.query}"
Maximum Results: ${queryData.maxResults}
${filterText ? `Filters: ${filterText}` : ''}

=== ANALYSIS REQUEST ===
Analyze the research data from: ${queryData.sources.map(s => getSourceName(s)).join(", ")}

Provide:
1. Overview of findings
2. Key themes and patterns
3. Notable publications or datasets
4. Research gaps or opportunities
5. Next steps recommendations

NOTE: Enhanced context coming soon:
- Knowledge graph integration
- Custom organization ontologies
- User research profile
- Historical search patterns
- Team collaboration context

Generate a concise, actionable research summary.`;
}

// Data source query builders
function buildOpenAlexQuery(queryData: QueryData): string {
  const filters = queryData.filters;
  let query = `GET https://api.openalex.org/works?search=${encodeURIComponent(queryData.query)}`;

  const params: string[] = [];
  params.push(`per-page=${queryData.maxResults}`);

  if (filters.dateFrom || filters.dateTo) {
    const fromYear = filters.dateFrom ? new Date(filters.dateFrom).getFullYear() : '*';
    const toYear = filters.dateTo ? new Date(filters.dateTo).getFullYear() : '*';
    params.push(`filter=publication_year:${fromYear}-${toYear}`);
  }

  if (filters.minCitations) {
    params.push(`filter=cited_by_count:>${filters.minCitations}`);
  }

  if (filters.openAccessOnly) {
    params.push(`filter=is_oa:true`);
  }

  if (filters.publicationType && filters.publicationType !== 'all') {
    params.push(`filter=type:${filters.publicationType}`);
  }

  if (params.length > 0) {
    query += '&' + params.join('&');
  }

  return `${query}

NOTE: Future enhancements will include:
- Semantic search using knowledge graph embeddings
- Organization-specific field mappings
- Custom relevance scoring based on user preferences
- Automatic concept expansion from ontology
- Integration with internal citation database`;
}

function buildPubMedQuery(queryData: QueryData): string {
  const filters = queryData.filters;
  let searchTerms = queryData.query;

  const constraints: string[] = [];

  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom || '1900/01/01';
    const to = filters.dateTo || new Date().toISOString().split('T')[0];
    constraints.push(`("${from.replace(/-/g, '/')}"[Date - Publication] : "${to.replace(/-/g, '/')}"[Date - Publication])`);
  }

  if (filters.publicationType && filters.publicationType !== 'all') {
    constraints.push(`${filters.publicationType}[Publication Type]`);
  }

  if (filters.openAccessOnly) {
    constraints.push(`free full text[filter]`);
  }

  let query = searchTerms;
  if (constraints.length > 0) {
    query += ' AND ' + constraints.join(' AND ');
  }

  return `GET https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi
?db=pubmed
&term=${encodeURIComponent(query)}
&retmax=${queryData.maxResults}
&retmode=json

NOTE: Future context additions:
- MeSH term expansion from custom medical ontology
- Author disambiguation using knowledge graph
- Journal impact factor filtering based on org preferences
- Automatic clinical trial phase detection
- Cross-reference with internal lab publications
- Citation network analysis integration`;
}

function buildPatentsQuery(queryData: QueryData): string {
  const filters = queryData.filters;
  let query = `GET https://api.patents.example.com/search?q=${encodeURIComponent(queryData.query)}`;

  const params: string[] = [];
  params.push(`limit=${queryData.maxResults}`);

  if (filters.dateFrom) {
    params.push(`filing_date_from=${filters.dateFrom}`);
  }

  if (filters.dateTo) {
    params.push(`filing_date_to=${filters.dateTo}`);
  }

  if (params.length > 0) {
    query += '&' + params.join('&');
  }

  return `${query}

NOTE: Future intelligence features:
- Patent classification mapping to organization taxonomy
- Inventor network analysis from knowledge graph
- Technology trend detection
- Competitive landscape analysis
- Prior art suggestions from internal R&D database
- Automated claim analysis and comparison
- Integration with IP management system`;
}

function buildFilterDescription(filters: QueryData['filters']): string {
  const parts: string[] = [];

  if (filters.dateFrom) parts.push(`from ${filters.dateFrom}`);
  if (filters.dateTo) parts.push(`to ${filters.dateTo}`);
  if (filters.minCitations) parts.push(`min citations: ${filters.minCitations}`);
  if (filters.publicationType && filters.publicationType !== 'all') parts.push(`type: ${filters.publicationType}`);
  if (filters.openAccessOnly) parts.push(`open access only`);

  return parts.join(', ');
}
