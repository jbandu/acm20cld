import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface ClaudeRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function queryClaude(
  request: ClaudeRequest
): Promise<ClaudeResponse> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      messages: [
        {
          role: "user",
          content: request.context
            ? `Context: ${request.context}\n\nQuery: ${request.prompt}`
            : request.prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");

    return {
      content: textContent?.type === "text" ? textContent.text : "",
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}

export async function summarizeResearchResults(
  results: any[],
  query: string
): Promise<string> {
  const combinedText = results
    .map((r) => {
      if (r.abstract) return `Title: ${r.title}\nAbstract: ${r.abstract}`;
      return JSON.stringify(r);
    })
    .join("\n\n---\n\n");

  const response = await queryClaude({
    prompt: `You are a research assistant for cancer biology researchers. Analyze these research results and provide:

1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Relevance Assessment
4. Recommended Next Steps

Original Query: "${query}"

Research Results:
${combinedText}`,
    maxTokens: 4000,
  });

  return response.content;
}

export async function extractConcepts(text: string): Promise<string[]> {
  const response = await queryClaude({
    prompt: `Extract key scientific concepts and terms from this text. Return only a JSON array of strings.

Text: ${text}`,
    maxTokens: 1000,
  });

  try {
    return JSON.parse(response.content);
  } catch {
    return [];
  }
}

export async function refineQuery(originalQuery: string): Promise<{
  refinedQuery: string;
  intent: {
    primary: string;
    secondary: string[];
  };
  concepts: string[];
  suggestedTerms: string[];
}> {
  const response = await queryClaude({
    prompt: `You are a research assistant for cancer biology researchers.

Analyze this research query and:
1. Rephrase it for optimal academic database searching
2. Extract the core intent and key concepts
3. Suggest related search terms

Query: "${originalQuery}"

Return JSON with:
{
  "refinedQuery": "refined search query",
  "intent": {
    "primary": "main research goal",
    "secondary": ["related goals"]
  },
  "concepts": ["key concept 1", "key concept 2"],
  "suggestedTerms": ["related term 1", "related term 2"]
}`,
    maxTokens: 2000,
  });

  try {
    return JSON.parse(response.content);
  } catch (error) {
    // Fallback
    return {
      refinedQuery: originalQuery,
      intent: {
        primary: originalQuery,
        secondary: [],
      },
      concepts: [],
      suggestedTerms: [],
    };
  }
}

export { anthropic };
