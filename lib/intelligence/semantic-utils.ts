/**
 * Semantic Similarity Utilities
 *
 * Provides embedding generation and similarity calculations
 * for intelligent question matching and relevance scoring.
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache for embeddings to avoid redundant API calls
const embeddingCache = new Map<string, number[]>();

/**
 * Generate embedding vector for text using OpenAI's text-embedding-3-small model
 */
export async function getEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = text.toLowerCase().trim();
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    const embedding = response.data[0].embedding;

    // Cache the result (limit cache size to prevent memory issues)
    if (embeddingCache.size < 1000) {
      embeddingCache.set(cacheKey, embedding);
    }

    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Return zero vector as fallback
    return new Array(1536).fill(0);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  try {
    // Check cache first
    const uncached: string[] = [];
    const cached: number[][] = [];
    const cacheMap = new Map<number, number[]>();

    texts.forEach((text, index) => {
      const cacheKey = text.toLowerCase().trim();
      if (embeddingCache.has(cacheKey)) {
        cacheMap.set(index, embeddingCache.get(cacheKey)!);
      } else {
        uncached.push(text);
      }
    });

    // Get embeddings for uncached texts
    if (uncached.length > 0) {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: uncached,
        encoding_format: "float",
      });

      let uncachedIndex = 0;
      texts.forEach((text, index) => {
        if (!cacheMap.has(index)) {
          const embedding = response.data[uncachedIndex].embedding;
          cacheMap.set(index, embedding);

          // Cache it
          const cacheKey = text.toLowerCase().trim();
          if (embeddingCache.size < 1000) {
            embeddingCache.set(cacheKey, embedding);
          }

          uncachedIndex++;
        }
      });
    }

    // Return embeddings in original order
    return texts.map((_, index) => cacheMap.get(index)!);
  } catch (error) {
    console.error("Error generating batch embeddings:", error);
    // Return zero vectors as fallback
    return texts.map(() => new Array(1536).fill(0));
  }
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (typically 0 to 1 for text embeddings)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate similarity between a text and a list of texts
 * Returns array of similarity scores
 */
export async function calculateSimilarities(
  targetText: string,
  comparisonTexts: string[]
): Promise<number[]> {
  if (comparisonTexts.length === 0) return [];

  const [targetEmbedding, comparisonEmbeddings] = await Promise.all([
    getEmbedding(targetText),
    getBatchEmbeddings(comparisonTexts),
  ]);

  return comparisonEmbeddings.map((embedding) =>
    cosineSimilarity(targetEmbedding, embedding)
  );
}

/**
 * Find the most similar text from a list
 * Returns { text, similarity, index }
 */
export async function findMostSimilar(
  targetText: string,
  candidates: string[]
): Promise<{ text: string; similarity: number; index: number }> {
  if (candidates.length === 0) {
    throw new Error("Candidates array cannot be empty");
  }

  const similarities = await calculateSimilarities(targetText, candidates);
  const maxIndex = similarities.indexOf(Math.max(...similarities));

  return {
    text: candidates[maxIndex],
    similarity: similarities[maxIndex],
    index: maxIndex,
  };
}

/**
 * Calculate average similarity between a text and multiple texts
 */
export async function averageSimilarity(
  targetText: string,
  texts: string[]
): Promise<number> {
  if (texts.length === 0) return 0;

  const similarities = await calculateSimilarities(targetText, texts);
  return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
}

/**
 * Calculate maximum similarity between a text and multiple texts
 */
export async function maxSimilarity(
  targetText: string,
  texts: string[]
): Promise<number> {
  if (texts.length === 0) return 0;

  const similarities = await calculateSimilarities(targetText, texts);
  return Math.max(...similarities);
}

/**
 * Check if two texts are semantically similar (above threshold)
 */
export async function areSimilar(
  text1: string,
  text2: string,
  threshold: number = 0.7
): Promise<boolean> {
  const [embedding1, embedding2] = await Promise.all([
    getEmbedding(text1),
    getEmbedding(text2),
  ]);

  const similarity = cosineSimilarity(embedding1, embedding2);
  return similarity >= threshold;
}

/**
 * Cluster texts by semantic similarity
 * Returns array of clusters (each cluster is an array of indices)
 */
export async function clusterBySimilarity(
  texts: string[],
  threshold: number = 0.7
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const embeddings = await getBatchEmbeddings(texts);
  const clusters: number[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < texts.length; i++) {
    if (assigned.has(i)) continue;

    const cluster: number[] = [i];
    assigned.add(i);

    for (let j = i + 1; j < texts.length; j++) {
      if (assigned.has(j)) continue;

      const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
      if (similarity >= threshold) {
        cluster.push(j);
        assigned.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

/**
 * Deduplicate texts based on semantic similarity
 * Returns indices of unique texts
 */
export async function deduplicateBySimilarity(
  texts: string[],
  threshold: number = 0.85
): Promise<number[]> {
  if (texts.length === 0) return [];

  const embeddings = await getBatchEmbeddings(texts);
  const unique: number[] = [0]; // Always include first text

  for (let i = 1; i < texts.length; i++) {
    let isDuplicate = false;

    for (const uniqueIndex of unique) {
      const similarity = cosineSimilarity(embeddings[i], embeddings[uniqueIndex]);
      if (similarity >= threshold) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      unique.push(i);
    }
  }

  return unique;
}

/**
 * Clear the embedding cache
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}
