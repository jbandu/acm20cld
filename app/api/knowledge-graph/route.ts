import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-config";
import { getNeo4jSession } from "@/lib/db/neo4j";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryId = searchParams.get("queryId");
    const limit = parseInt(searchParams.get("limit") || "100");

    const neo4jSession = await getNeo4jSession();

    try {
      let result;

      if (queryId) {
        // Get knowledge graph for a specific query
        result = await neo4jSession.run(
          `
          MATCH (q:Query {id: $queryId})-[:EXTRACTED]->(c:Concept)
          OPTIONAL MATCH (c)-[r:RELATED_TO]-(related:Concept)
          OPTIONAL MATCH (c)<-[:MENTIONS]-(p:Paper)
          WITH c, collect(DISTINCT {concept: related, type: type(r)}) as relatedConcepts,
               collect(DISTINCT p) as papers
          RETURN {
            id: c.id,
            name: c.name,
            category: c.category,
            confidence: c.confidence
          } as node,
          relatedConcepts,
          papers
          LIMIT $limit
          `,
          { queryId, limit }
        );
      } else {
        // Get user's overall knowledge graph
        result = await neo4jSession.run(
          `
          MATCH (u:User {id: $userId})-[:QUERIED]->(c:Concept)
          OPTIONAL MATCH (c)-[r:RELATED_TO]-(related:Concept)
          OPTIONAL MATCH (c)<-[:MENTIONS]-(p:Paper)
          WITH c, collect(DISTINCT {concept: related, type: type(r)}) as relatedConcepts,
               collect(DISTINCT p) as papers
          RETURN {
            id: c.id,
            name: c.name,
            category: c.category,
            confidence: c.confidence
          } as node,
          relatedConcepts,
          papers
          LIMIT $limit
          `,
          { userId: session.user.id, limit }
        );
      }

      // Transform the data into a format suitable for D3.js
      const nodes = new Map();
      const links: any[] = [];

      result.records.forEach((record) => {
        const node = record.get("node");
        const relatedConcepts = record.get("relatedConcepts");

        // Add main node
        if (!nodes.has(node.id)) {
          nodes.set(node.id, {
            id: node.id,
            name: node.name,
            category: node.category,
            confidence: node.confidence,
            type: "concept",
          });
        }

        // Add related concepts and links
        relatedConcepts.forEach((rel: any) => {
          if (rel.concept && rel.concept.properties) {
            const relatedNode = rel.concept.properties;

            if (!nodes.has(relatedNode.id)) {
              nodes.set(relatedNode.id, {
                id: relatedNode.id,
                name: relatedNode.name,
                category: relatedNode.category,
                confidence: relatedNode.confidence,
                type: "concept",
              });
            }

            links.push({
              source: node.id,
              target: relatedNode.id,
              type: rel.type || "RELATED_TO",
            });
          }
        });
      });

      return NextResponse.json({
        nodes: Array.from(nodes.values()),
        links,
      });
    } finally {
      await neo4jSession.close();
    }
  } catch (error) {
    console.error("Error fetching knowledge graph:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge graph" },
      { status: 500 }
    );
  }
}
