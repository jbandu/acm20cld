/**
 * Fallback Knowledge Graph Generator
 *
 * Generates a basic knowledge graph from Prisma data when Neo4j is unavailable.
 * Creates nodes from user research profile and queries, with relationships based on shared topics.
 */

import { prisma } from "@/lib/db/prisma";

interface GraphNode {
  id: string;
  name: string;
  category: string;
  confidence: number;
  type: string;
  size?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength?: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Generates a knowledge graph from user's research profile and query history
 */
export async function generateFallbackKnowledgeGraph(
  userId: string,
  queryId?: string
): Promise<GraphData> {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();

  // Helper to add a node
  const addNode = (id: string, name: string, category: string, confidence: number = 0.8, size: number = 1) => {
    if (!nodeIds.has(id)) {
      nodeIds.add(id);
      nodes.push({
        id,
        name,
        category,
        confidence,
        type: "concept",
        size,
      });
    }
  };

  // Helper to add a link
  const addLink = (source: string, target: string, type: string = "RELATED_TO", strength: number = 0.5) => {
    if (nodeIds.has(source) && nodeIds.has(target) && source !== target) {
      links.push({ source, target, type, strength });
    }
  };

  try {
    // Fetch user's research profile
    const profile = await prisma.userResearchProfile.findUnique({
      where: { userId },
    });

    // Fetch user's queries (or specific query)
    const queries = queryId
      ? await prisma.query.findMany({
          where: { id: queryId, userId },
          include: { responses: { select: { source: true } } },
          take: 1,
        })
      : await prisma.query.findMany({
          where: { userId },
          include: { responses: { select: { source: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        });

    // 1. Create central "Research Focus" node if user has profile
    if (profile && (profile.primaryInterests.length > 0 || profile.phdFocus)) {
      const focusName = profile.phdFocus
        ? profile.phdFocus.split(" ").slice(0, 5).join(" ")
        : profile.primaryInterests[0] || "Research Focus";

      addNode("user-focus", focusName, "focus", 1.0, 3);
    }

    // 2. Add primary research interests as major nodes
    if (profile) {
      profile.primaryInterests.forEach((interest, idx) => {
        const nodeId = `interest-primary-${idx}`;
        addNode(nodeId, interest, "primary_interest", 0.9, 2.5);

        // Connect to central focus
        if (nodeIds.has("user-focus")) {
          addLink("user-focus", nodeId, "FOCUSES_ON", 0.9);
        }
      });

      // 3. Add secondary interests
      profile.secondaryInterests.forEach((interest, idx) => {
        const nodeId = `interest-secondary-${idx}`;
        addNode(nodeId, interest, "secondary_interest", 0.7, 1.5);

        // Connect to related primary interests (by shared keywords)
        profile.primaryInterests.forEach((primary, pIdx) => {
          const sharedWords = interest
            .toLowerCase()
            .split(" ")
            .some((word) => word.length > 4 && primary.toLowerCase().includes(word));

          if (sharedWords) {
            addLink(`interest-primary-${pIdx}`, nodeId, "RELATED_TO", 0.6);
          }
        });
      });

      // 4. Add techniques as skill nodes
      profile.techniques.forEach((technique, idx) => {
        const nodeId = `technique-${idx}`;
        addNode(nodeId, technique, "technique", 0.8, 1.8);

        // Connect techniques to relevant interests
        profile.primaryInterests.forEach((interest, iIdx) => {
          if (
            interest.toLowerCase().includes("biology") ||
            interest.toLowerCase().includes("cell") ||
            interest.toLowerCase().includes("molecular")
          ) {
            addLink(`interest-primary-${iIdx}`, nodeId, "USES", 0.7);
          }
        });
      });

      // 5. Add computational skills
      profile.computationalSkills.forEach((skill, idx) => {
        const nodeId = `skill-${idx}`;
        addNode(nodeId, skill, "computational_skill", 0.75, 1.6);

        // Connect skills to techniques
        profile.techniques.slice(0, 3).forEach((_, tIdx) => {
          if (Math.random() > 0.5) {
            // Probabilistic connection
            addLink(nodeId, `technique-${tIdx}`, "SUPPORTS", 0.5);
          }
        });
      });
    }

    // 6. Add query-based concepts
    queries.forEach((query, qIdx) => {
      const queryText = query.originalQuery || query.refinedQuery || "";

      // Extract key concepts from query (simple keyword extraction)
      const keywords = extractKeywords(queryText);

      keywords.forEach((keyword, kIdx) => {
        const nodeId = `query-${qIdx}-keyword-${kIdx}`;
        addNode(nodeId, keyword, "query_concept", 0.65, 1.3);

        // Connect to primary interests if relevant
        if (profile) {
          profile.primaryInterests.forEach((interest, iIdx) => {
            if (
              keyword.toLowerCase().includes(interest.toLowerCase().split(" ")[0]) ||
              interest.toLowerCase().includes(keyword.toLowerCase())
            ) {
              addLink(`interest-primary-${iIdx}`, nodeId, "EXPLORES", 0.7);
            }
          });
        }

        // Connect keywords from same query
        if (kIdx > 0) {
          addLink(
            `query-${qIdx}-keyword-${kIdx - 1}`,
            nodeId,
            "CO_OCCURS",
            0.6
          );
        }
      });

      // Add source nodes if available
      const uniqueSources = new Set(query.responses.map((r) => r.source));
      uniqueSources.forEach((source) => {
        const nodeId = `source-${source}`;
        addNode(nodeId, source, "data_source", 0.5, 1.0);

        // Connect to query keywords
        keywords.forEach((_, kIdx) => {
          addLink(nodeId, `query-${qIdx}-keyword-${kIdx}`, "PROVIDES_DATA", 0.4);
        });
      });
    });

    // 7. If no data at all, create a minimal example graph
    if (nodes.length === 0) {
      addNode("example-1", "Cancer Research", "example", 0.8, 2);
      addNode("example-2", "Immunotherapy", "example", 0.8, 2);
      addNode("example-3", "CAR-T Therapy", "example", 0.75, 1.8);
      addNode("example-4", "Clinical Trials", "example", 0.7, 1.5);
      addNode("example-5", "Biomarkers", "example", 0.7, 1.5);

      addLink("example-1", "example-2", "RELATED_TO", 0.8);
      addLink("example-2", "example-3", "INCLUDES", 0.9);
      addLink("example-3", "example-4", "TESTED_IN", 0.7);
      addLink("example-1", "example-5", "USES", 0.6);
      addLink("example-4", "example-5", "MEASURES", 0.7);
    }

    return { nodes, links };
  } catch (error) {
    console.error("Error generating fallback knowledge graph:", error);

    // Return minimal example graph on error
    return {
      nodes: [
        { id: "1", name: "Research Topic", category: "example", confidence: 0.8, type: "concept", size: 2 },
        { id: "2", name: "Methodology", category: "example", confidence: 0.7, type: "concept", size: 1.5 },
        { id: "3", name: "Results", category: "example", confidence: 0.6, type: "concept", size: 1.2 },
      ],
      links: [
        { source: "1", target: "2", type: "USES", strength: 0.8 },
        { source: "2", target: "3", type: "PRODUCES", strength: 0.7 },
      ],
    };
  }
}

/**
 * Simple keyword extraction from text
 */
function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "can", "what", "how", "when", "where", "why",
  ]);

  // Split into words, filter, and get unique significant terms
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Get unique words with preference for longer terms
  const uniqueWords = Array.from(new Set(words))
    .sort((a, b) => b.length - a.length)
    .slice(0, 5);

  // Capitalize first letter
  return uniqueWords.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
}
