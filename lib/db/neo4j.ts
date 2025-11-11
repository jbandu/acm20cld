import neo4j, { Driver, Session } from "neo4j-driver";

let driver: Driver | null = null;

// Check if Neo4j is configured
export function isNeo4jConfigured(): boolean {
  return !!(
    process.env.NEO4J_URI &&
    process.env.NEO4J_USERNAME &&
    process.env.NEO4J_PASSWORD
  );
}

export function getNeo4jDriver(): Driver | null {
  // Return null if Neo4j is not configured
  if (!isNeo4jConfigured()) {
    console.warn("Neo4j is not configured. Knowledge graph features will be unavailable.");
    return null;
  }

  if (!driver) {
    const uri = process.env.NEO4J_URI!;
    const username = process.env.NEO4J_USERNAME!;
    const password = process.env.NEO4J_PASSWORD!;

    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 60000,
      });
      console.log("✅ Neo4j driver initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Neo4j driver:", error);
      return null;
    }
  }

  return driver;
}

export async function getNeo4jSession(): Promise<Session | null> {
  const driver = getNeo4jDriver();

  if (!driver) {
    return null;
  }

  try {
    return driver.session();
  } catch (error) {
    console.error("❌ Failed to create Neo4j session:", error);
    return null;
  }
}

export async function closeNeo4jDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

// Initialize knowledge graph schema
export async function initializeKnowledgeGraphSchema() {
  if (!isNeo4jConfigured()) {
    console.warn("Skipping Neo4j schema initialization - Neo4j not configured");
    return;
  }

  const session = await getNeo4jSession();

  if (!session) {
    console.warn("Cannot initialize Neo4j schema - session unavailable");
    return;
  }

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

  if (!session) {
    console.warn("Cannot create concept - Neo4j session unavailable");
    return;
  }

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

  if (!session) {
    console.warn("Cannot link concepts to paper - Neo4j session unavailable");
    return;
  }

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

  if (!session) {
    console.warn("Cannot get user knowledge graph - Neo4j session unavailable");
    return [];
  }

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
