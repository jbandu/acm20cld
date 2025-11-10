import { cacheGet, cacheSet } from "@/lib/db/redis";

export interface OpenAlexSearchParams {
  query: string;
  filters?: {
    from_publication_date?: string;
    to_publication_date?: string;
    is_oa?: boolean;
    type?: string;
  };
  max_results?: number;
  page?: number;
}

export interface OpenAlexWork {
  id: string;
  doi: string;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string;
  cited_by_count: number;
  is_oa: boolean;
  abstract_inverted_index?: Record<string, number[]>;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
    };
    institutions: Array<{
      id: string;
      display_name: string;
      country_code: string;
    }>;
  }>;
  concepts: Array<{
    id: string;
    display_name: string;
    score: number;
  }>;
  primary_location?: {
    source?: {
      display_name: string;
    };
  };
}

export async function searchOpenAlex(
  params: OpenAlexSearchParams
): Promise<OpenAlexWork[]> {
  const cacheKey = `openalex:${JSON.stringify(params)}`;

  // Check cache first
  const cached = await cacheGet<OpenAlexWork[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Build query parameters
  const filters: string[] = [`search=${encodeURIComponent(params.query)}`];

  if (params.filters?.from_publication_date) {
    filters.push(`from_publication_date=${params.filters.from_publication_date}`);
  }

  if (params.filters?.to_publication_date) {
    filters.push(`to_publication_date=${params.filters.to_publication_date}`);
  }

  if (params.filters?.is_oa !== undefined) {
    filters.push(`is_oa=${params.filters.is_oa}`);
  }

  if (params.filters?.type) {
    filters.push(`type=${params.filters.type}`);
  }

  const perPage = params.max_results || 25;
  const page = params.page || 1;

  filters.push(`per-page=${perPage}`);
  filters.push(`page=${page}`);

  const url = `https://api.openalex.org/works?${filters.join("&")}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ACM Research Platform (mailto:research@acm.com)",
        ...(process.env.OPENALEX_API_KEY && {
          Authorization: `Bearer ${process.env.OPENALEX_API_KEY}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results: OpenAlexWork[] = data.results || [];

    // Cache for 1 hour
    await cacheSet(cacheKey, results, 3600);

    return results;
  } catch (error) {
    console.error("OpenAlex search error:", error);
    throw error;
  }
}

export async function getOpenAlexWork(workId: string): Promise<OpenAlexWork | null> {
  const cacheKey = `openalex:work:${workId}`;

  const cached = await cacheGet<OpenAlexWork>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`https://api.openalex.org/works/${workId}`, {
      headers: {
        "User-Agent": "ACM Research Platform (mailto:research@acm.com)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const work: OpenAlexWork = await response.json();

    // Cache for 24 hours
    await cacheSet(cacheKey, work, 86400);

    return work;
  } catch (error) {
    console.error("OpenAlex getWork error:", error);
    return null;
  }
}

export function reconstructAbstract(invertedIndex?: Record<string, number[]>): string {
  if (!invertedIndex) return "";

  const words: string[] = [];
  const positions: [string, number][] = [];

  for (const [word, indices] of Object.entries(invertedIndex)) {
    for (const index of indices) {
      positions.push([word, index]);
    }
  }

  positions.sort((a, b) => a[1] - b[1]);

  return positions.map(([word]) => word).join(" ");
}
