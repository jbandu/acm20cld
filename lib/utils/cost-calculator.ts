// Cost estimation utilities for query tracking
// These estimates are based on 2024/2025 API pricing

interface QueryCostBreakdown {
  service: string;
  type: "llm" | "datasource";
  estimatedCost: number;
  unit: string;
  details: string;
}

export interface QueryCostEstimate {
  queryId: string;
  userId: string;
  costs: QueryCostBreakdown[];
  totalCost: number;
  timestamp: Date;
}

// Current API pricing (as of 2024/2025)
const PRICING = {
  claude: {
    inputPerMToken: 3.0,    // $3 per million input tokens
    outputPerMToken: 15.0,  // $15 per million output tokens
  },
  gpt4: {
    inputPerMToken: 10.0,   // $10 per million input tokens
    outputPerMToken: 30.0,  // $30 per million output tokens
  },
  // Data sources are free
  openalex: 0,
  pubmed: 0,
  patents: 0,
  ollama: 0, // Local, no API costs
};

// Estimate token usage based on query complexity
function estimateTokenUsage(query: string, maxResults: number): {
  input: number;
  output: number;
} {
  // Base tokens for query
  const baseQueryTokens = Math.ceil(query.length / 4); // Rough estimate: 1 token per 4 chars

  // Context tokens (user + organization context)
  const contextTokens = 500; // Approximate

  // Results processing tokens
  const resultsTokens = maxResults * 100; // Estimate per result

  const inputTokens = baseQueryTokens + contextTokens + resultsTokens;

  // Output tokens (summary, analysis, recommendations)
  const outputTokens = 4000; // Typical comprehensive analysis

  return {
    input: inputTokens,
    output: outputTokens,
  };
}

/**
 * Calculate estimated cost for a query based on selected sources and LLMs
 */
export function calculateQueryCost(queryData: {
  query: string;
  sources: string[];
  llms: string[];
  maxResults: number;
}): { costs: QueryCostBreakdown[]; total: number } {
  const costs: QueryCostBreakdown[] = [];

  // Estimate token usage
  const tokens = estimateTokenUsage(queryData.query, queryData.maxResults);

  // Calculate data source costs (mostly free)
  queryData.sources.forEach((source) => {
    costs.push({
      service: getSourceName(source),
      type: "datasource",
      estimatedCost: 0,
      unit: "USD",
      details: `${queryData.maxResults} results - Free API`,
    });
  });

  // Calculate LLM costs
  queryData.llms.forEach((llm) => {
    if (llm === "claude") {
      const inputCost = (tokens.input / 1000000) * PRICING.claude.inputPerMToken;
      const outputCost = (tokens.output / 1000000) * PRICING.claude.outputPerMToken;
      const totalCost = inputCost + outputCost;

      costs.push({
        service: "Claude (Anthropic)",
        type: "llm",
        estimatedCost: totalCost,
        unit: "USD",
        details: `~${tokens.input} input + ~${tokens.output} output tokens`,
      });
    } else if (llm === "gpt4") {
      const inputCost = (tokens.input / 1000000) * PRICING.gpt4.inputPerMToken;
      const outputCost = (tokens.output / 1000000) * PRICING.gpt4.outputPerMToken;
      const totalCost = inputCost + outputCost;

      costs.push({
        service: "GPT-4 (OpenAI)",
        type: "llm",
        estimatedCost: totalCost,
        unit: "USD",
        details: `~${tokens.input} input + ~${tokens.output} output tokens`,
      });
    } else if (llm === "ollama") {
      costs.push({
        service: "Ollama (Local)",
        type: "llm",
        estimatedCost: 0,
        unit: "USD",
        details: "Local processing - no API costs",
      });
    }
  });

  const total = costs.reduce((sum, cost) => sum + cost.estimatedCost, 0);

  return { costs, total };
}

/**
 * Calculate total spending for a user over a time period
 */
export function calculateUserSpending(queries: any[]): {
  totalCost: number;
  queryCount: number;
  averageCostPerQuery: number;
  costByService: Record<string, number>;
} {
  let totalCost = 0;
  const costByService: Record<string, number> = {};

  queries.forEach((query) => {
    const { total, costs } = calculateQueryCost({
      query: query.originalQuery || query.refinedQuery || "",
      sources: query.sources || [],
      llms: query.llms || [],
      maxResults: 25, // Default
    });

    totalCost += total;

    costs.forEach((cost) => {
      if (!costByService[cost.service]) {
        costByService[cost.service] = 0;
      }
      costByService[cost.service] += cost.estimatedCost;
    });
  });

  return {
    totalCost,
    queryCount: queries.length,
    averageCostPerQuery: queries.length > 0 ? totalCost / queries.length : 0,
    costByService,
  };
}

// Helper function
function getSourceName(sourceId: string): string {
  const names: Record<string, string> = {
    openalex: "OpenAlex",
    pubmed: "PubMed",
    patents: "Patents API",
  };
  return names[sourceId] || sourceId;
}
