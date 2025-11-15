import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RefineRequest {
  query: string;
  userContext?: {
    interests?: string[];
    expertiseLevel?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const body: RefineRequest = await req.json();
    const { query, userContext } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Build context for refinement
    let contextPrompt = "";
    if (userContext?.interests && userContext.interests.length > 0) {
      contextPrompt += `\nUser's research interests: ${userContext.interests.slice(0, 3).join(", ")}`;
    }
    if (userContext?.expertiseLevel) {
      contextPrompt += `\nExpertise level: ${userContext.expertiseLevel}`;
    }

    // Use Claude Haiku for fast, cost-effective refinement
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `You are a research query optimization assistant for cancer research at ACM Biolabs.

Task: Refine the following research query to get better search results from academic databases.
${contextPrompt}

Original Query: "${query}"

Analyze the query and provide:
1. A refined version that is:
   - More specific and focused
   - Uses appropriate technical terminology
   - Includes relevant timeframes if applicable
   - Scoped to avoid overly broad results

2. Brief reasoning (2-3 sentences) explaining why the refinement improves results

3. 2-4 specific improvements made (as key changes)

4. Recommended filters:
   - Date range (if relevant)
   - Key terms to emphasize
   - Terms to exclude (if any)

Return your response as a JSON object with this structure:
{
  "refinedQuery": "the improved query string",
  "reasoning": "explanation of improvements",
  "suggestions": [
    {"term": "specific change", "explanation": "why this helps"}
  ],
  "filters": {
    "dateRange": "e.g., 2020-2024 or null",
    "keywords": ["key", "terms"] or null,
    "excludeTerms": ["excluded", "terms"] or null
  }
}

Important:
- Keep refinements focused and actionable
- Don't over-complicate simple queries
- Maintain the user's original intent
- Be concise but precise
- Return ONLY the JSON object, no other text`,
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    let refinementData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        refinementData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse refinement response:", parseError);

      // Fallback: return a basic refinement
      refinementData = {
        refinedQuery: query,
        reasoning: "Unable to generate refinement. Using original query.",
        suggestions: [],
        filters: {},
      };
    }

    // Add original query to response
    return NextResponse.json({
      originalQuery: query,
      ...refinementData,
    });
  } catch (error: any) {
    console.error("Query refinement API error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Failed to refine query",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
