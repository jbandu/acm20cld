import { cacheGet, cacheSet } from "@/lib/db/redis";

export interface GooglePatentsSearchParams {
  query: string;
  max_results?: number;
  filing_date_from?: string;
  filing_date_to?: string;
  country?: string;
}

export interface Patent {
  id: string;
  title: string;
  abstract: string;
  publicationNumber: string;
  applicationNumber: string;
  filingDate: string;
  publicationDate: string;
  assignee: string;
  inventors: string[];
  classifications: string[];
  citationCount?: number;
  url: string;
}

// Note: Google Patents doesn't have an official public API
// This is a demonstration using the public search interface
// For production, consider using:
// 1. USPTO API for US patents
// 2. EPO OPS API for European patents
// 3. Commercial APIs like PatentsView or Lens.org

export async function searchGooglePatents(
  params: GooglePatentsSearchParams
): Promise<Patent[]> {
  const cacheKey = `patents:${JSON.stringify(params)}`;

  const cached = await cacheGet<Patent[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Since Google Patents doesn't have an official API,
  // we'll implement a basic wrapper that returns structured data
  // In production, use USPTO API or other patent databases

  try {
    const results = await searchUSPTO(params);

    // Cache for 1 hour
    await cacheSet(cacheKey, results, 3600);

    return results;
  } catch (error) {
    console.error("Patent search error:", error);
    throw error;
  }
}

async function searchUSPTO(params: GooglePatentsSearchParams): Promise<Patent[]> {
  // USPTO API endpoint (free, no API key required)
  const query = encodeURIComponent(params.query);
  const maxResults = params.max_results || 25;

  // Using PatentsView API (free and open)
  const url = `https://api.patentsview.org/patents/query?q={"_text_any":{"patent_abstract":"${params.query}"}}&f=["patent_number","patent_title","patent_abstract","patent_date","assignee_organization","inventor_last_name","inventor_first_name"]&o={"per_page":${maxResults}}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`PatentsView API error: ${response.statusText}`);
    }

    const data = await response.json();

    const patents: Patent[] = (data.patents || []).map((patent: any) => ({
      id: patent.patent_number,
      title: patent.patent_title || "",
      abstract: patent.patent_abstract || "",
      publicationNumber: patent.patent_number,
      applicationNumber: patent.patent_number,
      filingDate: patent.patent_date || "",
      publicationDate: patent.patent_date || "",
      assignee: patent.assignees?.[0]?.assignee_organization || "Unknown",
      inventors:
        patent.inventors?.map(
          (inv: any) => `${inv.inventor_first_name} ${inv.inventor_last_name}`
        ) || [],
      classifications: [],
      url: `https://patents.google.com/patent/${patent.patent_number}`,
    }));

    return patents;
  } catch (error) {
    console.error("USPTO search error:", error);
    return [];
  }
}

export async function getPatent(patentNumber: string): Promise<Patent | null> {
  const cacheKey = `patent:${patentNumber}`;

  const cached = await cacheGet<Patent>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const results = await searchUSPTO({ query: patentNumber, max_results: 1 });

    const patent = results[0] || null;

    if (patent) {
      // Cache for 24 hours
      await cacheSet(cacheKey, patent, 86400);
    }

    return patent;
  } catch (error) {
    console.error("Get patent error:", error);
    return null;
  }
}

// Alternative: Lens.org API (requires API key)
export async function searchLensOrg(params: GooglePatentsSearchParams): Promise<Patent[]> {
  if (!process.env.LENS_API_KEY) {
    throw new Error("Lens.org API key not configured");
  }

  const url = "https://api.lens.org/patent/search";

  const requestBody: any = {
    query: {
      match: {
        abstract: params.query,
      },
    },
    size: params.max_results || 25,
  };

  if (params.filing_date_from || params.filing_date_to) {
    requestBody.query = {
      ...requestBody.query,
      range: {
        filing_date: {
          gte: params.filing_date_from,
          lte: params.filing_date_to,
        },
      },
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LENS_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Lens.org API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map((result: any) => ({
      id: result.lens_id,
      title: result.title || "",
      abstract: result.abstract || "",
      publicationNumber: result.publication_number,
      applicationNumber: result.application_number,
      filingDate: result.filing_date,
      publicationDate: result.publication_date,
      assignee: result.applicants?.[0]?.name || "Unknown",
      inventors: result.inventors?.map((inv: any) => inv.name) || [],
      classifications: result.classifications || [],
      citationCount: result.cited_by_patent_count,
      url: `https://www.lens.org/lens/patent/${result.lens_id}`,
    }));
  } catch (error) {
    console.error("Lens.org search error:", error);
    throw error;
  }
}
