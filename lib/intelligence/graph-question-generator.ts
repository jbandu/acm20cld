/**
 * Graph-Based Question Generator
 *
 * Analyzes the Neo4j knowledge graph to generate intelligent questions
 * based on unexplored connections, research gaps, trending paths, and related clusters.
 */

import { getNeo4jSession } from "@/lib/db/neo4j";
import { prisma } from "@/lib/db/prisma";
import type { QuestionCategory } from "@prisma/client";

export interface GraphInsight {
  type: "unexplored_connection" | "research_gap" | "trending_path" | "related_cluster";
  concepts: string[];
  question: string;
  reasoning: string;
  score: number;
  category: QuestionCategory;
  sourceType: string;
  sourceIds: string[];
}

interface UserFootprint {
  userId: string;
  concepts: string[];
  papers: string[];
  queryCount: number;
}

export class GraphQuestionGenerator {
  /**
   * Generate questions by analyzing knowledge graph structure
   */
  async generateFromGraph(userId: string): Promise<GraphInsight[]> {
    const insights: GraphInsight[] = [];

    try {
      // 1. Find user's research footprint in graph
      const userFootprint = await this.getUserGraphFootprint(userId);

      if (userFootprint.concepts.length === 0) {
        // New user or no graph data yet
        return [];
      }

      // 2. Identify unexplored connections (parallel execution)
      const [unexplored, gaps, trending, clusters] = await Promise.all([
        this.findUnexploredConnections(userFootprint),
        this.detectResearchGaps(userFootprint),
        this.findTrendingPaths(userFootprint),
        this.findRelatedClusters(userFootprint),
      ]);

      insights.push(...unexplored);
      insights.push(...gaps);
      insights.push(...trending);
      insights.push(...clusters);

      return insights;
    } catch (error) {
      console.error("Error generating graph-based questions:", error);
      return [];
    }
  }

  /**
   * Map user's research interests to graph nodes
   */
  private async getUserGraphFootprint(userId: string): Promise<UserFootprint> {
    // Get all concepts user has interacted with
    const queries = await prisma.query.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        responses: {
          include: {
            feedback: true,
          },
        },
      },
    });

    // Extract concepts from queries and responses
    const concepts = new Set<string>();
    const papers = new Set<string>();

    for (const query of queries) {
      // Extract concepts from query intent
      if (query.intent) {
        const intent = query.intent as any;
        intent.concepts?.forEach((c: string) => concepts.add(c));
      }

      // Get papers user marked as important
      for (const response of query.responses) {
        const importantFeedback = response.feedback.find(
          (f) => f.type === "IMPORTANT"
        );
        if (importantFeedback && response.metadata) {
          const metadata = response.metadata as any;
          if (metadata.doi) {
            papers.add(metadata.doi);
          }
        }
      }
    }

    return {
      userId,
      concepts: Array.from(concepts),
      papers: Array.from(papers),
      queryCount: queries.length,
    };
  }

  /**
   * Find concepts connected to user's interests but not yet explored
   */
  private async findUnexploredConnections(
    footprint: UserFootprint
  ): Promise<GraphInsight[]> {
    if (footprint.concepts.length === 0) return [];

    const session = await getNeo4jSession();

    // Return empty if Neo4j is not available
    if (!session) {
      console.warn("Neo4j session unavailable - skipping unexplored connections");
      return [];
    }

    const insights: GraphInsight[] = [];

    try {
      // Cypher query: Find 1-2 hop neighbors not in user's footprint
      const query = `
        MATCH (c1:Concept)
        WHERE c1.name IN $userConcepts
        MATCH (c1)-[:RELATED_TO*1..2]-(c2:Concept)
        WHERE NOT c2.name IN $userConcepts
        WITH c2, count(*) as connections, collect(DISTINCT c1.name)[0..3] as via_concepts
        ORDER BY connections DESC
        LIMIT 10
        RETURN c2.name as concept,
               c2.category as category,
               via_concepts,
               connections
      `;

      const result = await session.run(query, {
        userConcepts: footprint.concepts,
      });

      for (const record of result.records) {
        const concept = record.get("concept");
        const category = record.get("category") || "other";
        const viaConcepts = record.get("via_concepts") as string[];
        const connections = record.get("connections").toNumber();

        if (viaConcepts.length > 0) {
          insights.push({
            type: "unexplored_connection",
            concepts: [concept, ...viaConcepts],
            question: `How does ${concept} relate to ${viaConcepts[0]}?`,
            reasoning: `You've researched ${viaConcepts[0]}, but not ${concept}. They're closely connected (${connections} links in the knowledge graph).`,
            score: Math.min(connections / 10, 1.0),
            category: "BRIDGING",
            sourceType: "KNOWLEDGE_GRAPH",
            sourceIds: [],
          });
        }
      }
    } catch (error) {
      console.error("Error finding unexplored connections:", error);
    } finally {
      await session.close();
    }

    return insights;
  }

  /**
   * Detect gaps in user's knowledge based on graph structure
   */
  private async detectResearchGaps(
    footprint: UserFootprint
  ): Promise<GraphInsight[]> {
    if (footprint.concepts.length < 2) return [];

    const session = await getNeo4jSession();

    if (!session) {
      console.warn("Neo4j session unavailable - skipping research gaps detection");
      return [];
    }

    const insights: GraphInsight[] = [];

    try {
      // Find "bridge concepts" that connect user's research areas
      const query = `
        MATCH (c1:Concept), (c2:Concept)
        WHERE c1.name IN $userConcepts
          AND c2.name IN $userConcepts
          AND c1 <> c2
        MATCH path = shortestPath((c1)-[:RELATED_TO*..3]-(c2))
        WITH nodes(path) as path_nodes
        UNWIND path_nodes as node
        WITH node.name as concept, count(*) as bridge_count
        WHERE NOT concept IN $userConcepts
        ORDER BY bridge_count DESC
        LIMIT 5
        RETURN concept, bridge_count
      `;

      const result = await session.run(query, {
        userConcepts: footprint.concepts,
      });

      for (const record of result.records) {
        const concept = record.get("concept");
        const bridgeCount = record.get("bridge_count").toNumber();

        insights.push({
          type: "research_gap",
          concepts: [concept],
          question: `What role does ${concept} play in your research area?`,
          reasoning: `${concept} connects ${bridgeCount} of your research topics, but you haven't explored it directly. This may be a critical bridge concept.`,
          score: Math.min(bridgeCount / 5, 1.0),
          category: "GAP",
          sourceType: "KNOWLEDGE_GRAPH",
          sourceIds: [],
        });
      }
    } catch (error) {
      console.error("Error detecting research gaps:", error);
    } finally {
      await session.close();
    }

    return insights;
  }

  /**
   * Find paths that are trending (lots of recent activity)
   */
  private async findTrendingPaths(
    footprint: UserFootprint
  ): Promise<GraphInsight[]> {
    if (footprint.concepts.length === 0) return [];

    const session = await getNeo4jSession();

    if (!session) {
      console.warn("Neo4j session unavailable - skipping trending paths");
      return [];
    }

    const insights: GraphInsight[] = [];

    try {
      // Find concepts with recent high activity (papers published in last 90 days)
      const query = `
        MATCH (c:Concept)<-[:ABOUT]-(p:Paper)
        WHERE p.publicationDate > datetime() - duration('P90D')
        WITH c, count(p) as recent_papers
        ORDER BY recent_papers DESC
        LIMIT 20
        MATCH (uc:Concept)
        WHERE uc.name IN $userConcepts
        MATCH (c)-[:RELATED_TO*1..2]-(uc)
        WITH c, recent_papers, collect(DISTINCT uc.name)[0..2] as user_concepts
        WHERE size(user_concepts) > 0
        ORDER BY recent_papers DESC
        LIMIT 8
        RETURN c.name as concept,
               c.category as category,
               recent_papers,
               user_concepts
      `;

      const result = await session.run(query, {
        userConcepts: footprint.concepts,
      });

      for (const record of result.records) {
        const concept = record.get("concept");
        const recentPapers = record.get("recent_papers").toNumber();
        const userConcepts = record.get("user_concepts") as string[];

        if (userConcepts.length > 0) {
          insights.push({
            type: "trending_path",
            concepts: [concept, ...userConcepts],
            question: `What are the latest breakthroughs in ${concept}?`,
            reasoning: `${recentPapers} papers on ${concept} published in last 3 months. Related to your work on ${userConcepts[0]}.`,
            score: Math.min(recentPapers / 20, 1.0),
            category: "TREND",
            sourceType: "KNOWLEDGE_GRAPH",
            sourceIds: [],
          });
        }
      }
    } catch (error) {
      console.error("Error finding trending paths:", error);
    } finally {
      await session.close();
    }

    return insights;
  }

  /**
   * Find research clusters related to user but not fully explored
   */
  private async findRelatedClusters(
    footprint: UserFootprint
  ): Promise<GraphInsight[]> {
    if (footprint.concepts.length === 0) return [];

    const session = await getNeo4jSession();

    if (!session) {
      console.warn("Neo4j session unavailable - skipping related clusters");
      return [];
    }

    const insights: GraphInsight[] = [];

    try {
      // Find dense concept clusters related to user's interests
      const query = `
        MATCH (uc:Concept)
        WHERE uc.name IN $userConcepts
        MATCH (uc)-[:RELATED_TO*1..2]-(c:Concept)
        WHERE NOT c.name IN $userConcepts
        WITH c, count(*) as connection_strength
        WHERE connection_strength >= 2
        MATCH (c)-[:RELATED_TO]-(neighbor:Concept)
        WHERE NOT neighbor.name IN $userConcepts
        WITH c, connection_strength, count(DISTINCT neighbor) as cluster_size
        WHERE cluster_size >= 3
        ORDER BY connection_strength DESC, cluster_size DESC
        LIMIT 5
        RETURN c.name as concept,
               c.category as category,
               connection_strength,
               cluster_size
      `;

      const result = await session.run(query, {
        userConcepts: footprint.concepts,
      });

      for (const record of result.records) {
        const concept = record.get("concept");
        const connectionStrength = record.get("connection_strength").toNumber();
        const clusterSize = record.get("cluster_size").toNumber();

        insights.push({
          type: "related_cluster",
          concepts: [concept],
          question: `How does ${concept} fit into your research area?`,
          reasoning: `${concept} is part of a cluster with ${clusterSize} related concepts you haven't explored yet. It's well-connected to your current interests.`,
          score: Math.min((connectionStrength * clusterSize) / 20, 1.0),
          category: "EXPLORATION",
          sourceType: "KNOWLEDGE_GRAPH",
          sourceIds: [],
        });
      }
    } catch (error) {
      console.error("Error finding related clusters:", error);
    } finally {
      await session.close();
    }

    return insights;
  }

  /**
   * Save detected knowledge gaps to database for tracking
   */
  async saveKnowledgeGaps(insights: GraphInsight[], userId: string): Promise<void> {
    const gaps = insights.filter((i) => i.type === "research_gap");

    for (const gap of gaps) {
      try {
        await prisma.knowledgeGraphGap.create({
          data: {
            missingConcept: gap.concepts[0],
            relatedConcepts: gap.concepts.slice(1),
            gapType: "bridge",
            detectedBy: "graph-analysis",
            detectionMethod: "shortest-path-bridge-detection",
            evidence: {
              score: gap.score,
              reasoning: gap.reasoning,
            },
            potentialImpact: gap.score,
            urgency: gap.score * 0.8,
            confidence: 0.7,
            relevantUsers: [userId],
            relevantDepartments: [],
          },
        });
      } catch (error) {
        // Gap might already exist, that's okay
        console.log("Gap already recorded or error saving:", error);
      }
    }
  }
}
