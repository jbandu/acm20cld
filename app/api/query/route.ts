import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { queryOrchestrator, QueryConfig } from "@/lib/agents/query-orchestrator";
import { checkRateLimit } from "@/lib/db/redis";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    // Rate limiting: 20 queries per hour (skip if Redis not available)
    let rateLimit = { allowed: true, remaining: 20 };
    try {
      rateLimit = await checkRateLimit(`query:${session.user.id}`, 20, 3600);
    } catch (redisError) {
      console.warn("Redis rate limiting unavailable, skipping:", redisError);
    }

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const config: QueryConfig = await req.json();

    // Validation
    if (!config.query || !config.sources || !config.llms) {
      return NextResponse.json(
        { error: "Missing required fields: query, sources, llms" },
        { status: 400 }
      );
    }

    if (config.query.length < 3) {
      return NextResponse.json(
        { error: "Query must be at least 3 characters long" },
        { status: 400 }
      );
    }

    const validSources = ["openalex", "pubmed", "patents"];
    const validLLMs = ["claude", "gpt4"];

    if (!config.sources.every((s) => validSources.includes(s))) {
      return NextResponse.json(
        { error: "Invalid source specified" },
        { status: 400 }
      );
    }

    if (!config.llms.every((l) => validLLMs.includes(l))) {
      return NextResponse.json(
        { error: "Invalid LLM specified" },
        { status: 400 }
      );
    }

    console.log("Processing query:", {
      userId: session.user.id,
      queryLength: config.query.length,
      sources: config.sources,
      llms: config.llms,
    });

    // Execute query
    const queryId = await queryOrchestrator.executeQuery(
      config,
      session.user.id
    );

    console.log("Query executed successfully:", queryId);

    return NextResponse.json({
      queryId,
      message: "Query submitted successfully",
      remainingQueries: rateLimit.remaining,
    });
  } catch (error: any) {
    console.error("Query API error:", error);
    console.error("Error stack:", error.stack);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "An error occurred while processing your query",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("queryId");

    if (queryId) {
      const results = await queryOrchestrator.getQueryResults(queryId);

      if (!results || results.userId !== session.user.id) {
        return NextResponse.json({ error: "Query not found" }, { status: 404 });
      }

      return NextResponse.json(results);
    } else {
      const history = await queryOrchestrator.getQueryHistory(session.user.id);
      return NextResponse.json(history);
    }
  } catch (error: any) {
    console.error("Query GET API error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
