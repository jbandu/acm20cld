import neo4j, { Driver, Session } from "neo4j-driver";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
    const username = process.env.NEO4J_USERNAME || "neo4j";
    const password = process.env.NEO4J_PASSWORD || "";

    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }

  return driver;
}

export async function getNeo4jSession(): Promise<Session> {
  const driver = getNeo4jDriver();
  return driver.session();
}

export async function closeNeo4jDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

// Initialize knowledge graph schema
export async function initializeKnowledgeGraphSchema() {
  const session = await getNeo4jSession();

  try {
    // Create constraints for uniqueness
    await session.run(`
      CREATE CONSTRAINT user_id IF NOT EXISTS
      FOR (u:User) REQUIRE u.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT concept_id IF NOT EXISTS
      FOR (c:Concept) REQUIRE c.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT paper_doi IF NOT EXISTS
      FOR (p:Paper) REQUIRE p.doi IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT author_id IF NOT EXISTS
      FOR (a:Author) REQUIRE a.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT patent_id IF NOT EXISTS
      FOR (p:Patent) REQUIRE p.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT institution_id IF NOT EXISTS
      FOR (i:Institution) REQUIRE i.id IS UNIQUE
    `);

    // Create indexes for better query performance
    await session.run(`
      CREATE INDEX concept_name IF NOT EXISTS
      FOR (c:Concept) ON (c.name)
    `);

    await session.run(`
      CREATE INDEX paper_title IF NOT EXISTS
      FOR (p:Paper) ON (p.title)
    `);

    await session.run(`
      CREATE INDEX author_name IF NOT EXISTS
      FOR (a:Author) ON (a.name)
    `);

    console.log("✅ Neo4j knowledge graph schema initialized");
  } catch (error) {
    console.error("❌ Error initializing Neo4j schema:", error);
    throw error;
  } finally {
    await session.close();
  }
}

// Helper functions for knowledge graph operations

export async function createConcept(data: {
  id: string;
  name: string;
  category: string;
  confidence: number;
}) {
  const session = await getNeo4jSession();

  try {
    await session.run(
      `
      MERGE (c:Concept {id: $id})
      SET c.name = $name,
          c.category = $category,
          c.confidence = $confidence,
          c.updatedAt = datetime()
      RETURN c
      `,
      data
    );
  } finally {
    await session.close();
  }
}

export async function linkConceptsToPaper(
  paperDoi: string,
  conceptIds: string[]
) {
  const session = await getNeo4jSession();

  try {
    for (const conceptId of conceptIds) {
      await session.run(
        `
        MATCH (p:Paper {doi: $paperDoi})
        MATCH (c:Concept {id: $conceptId})
        MERGE (p)-[:ABOUT]->(c)
        `,
        { paperDoi, conceptId }
      );
    }
  } finally {
    await session.close();
  }
}

export async function getUserKnowledgeGraph(userId: string) {
  const session = await getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:QUERIED]->(c:Concept)
      OPTIONAL MATCH (c)<-[:ABOUT]-(p:Paper)
      OPTIONAL MATCH (c)-[r:RELATED_TO]->(related:Concept)
      RETURN c, collect(DISTINCT p) as papers, collect(DISTINCT related) as relatedConcepts
      LIMIT 100
      `,
      { userId }
    );

    return result.records.map((record) => ({
      concept: record.get("c").properties,
      papers: record.get("papers").map((p: any) => p.properties),
      relatedConcepts: record
        .get("relatedConcepts")
        .map((c: any) => c.properties),
    }));
  } finally {
    await session.close();
  }
}
