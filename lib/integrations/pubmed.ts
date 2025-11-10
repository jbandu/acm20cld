import { cacheGet, cacheSet } from "@/lib/db/redis";

export interface PubMedSearchParams {
  query: string;
  max_results?: number;
  date_from?: string;
  date_to?: string;
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: Array<{
    name: string;
    affiliation?: string;
  }>;
  journal: string;
  publicationDate: string;
  doi?: string;
  pmcid?: string;
  keywords: string[];
  meshTerms: string[];
}

export async function searchPubMed(
  params: PubMedSearchParams
): Promise<PubMedArticle[]> {
  const cacheKey = `pubmed:${JSON.stringify(params)}`;

  const cached = await cacheGet<PubMedArticle[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const maxResults = params.max_results || 25;

  try {
    // Step 1: Search for PMIDs
    const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
    searchUrl.searchParams.set("db", "pubmed");
    searchUrl.searchParams.set("term", params.query);
    searchUrl.searchParams.set("retmax", maxResults.toString());
    searchUrl.searchParams.set("retmode", "json");

    if (params.date_from || params.date_to) {
      const dateFilter = `${params.date_from || "1900"}:${params.date_to || "3000"}[pdat]`;
      searchUrl.searchParams.set("datetype", "pdat");
      searchUrl.searchParams.set("mindate", params.date_from || "1900");
      searchUrl.searchParams.set("maxdate", params.date_to || "3000");
    }

    if (process.env.PUBMED_API_KEY) {
      searchUrl.searchParams.set("api_key", process.env.PUBMED_API_KEY);
    }

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    const pmids: string[] = searchData.esearchresult?.idlist || [];

    if (pmids.length === 0) {
      return [];
    }

    // Step 2: Fetch article details
    const fetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
    fetchUrl.searchParams.set("db", "pubmed");
    fetchUrl.searchParams.set("id", pmids.join(","));
    fetchUrl.searchParams.set("retmode", "xml");

    if (process.env.PUBMED_API_KEY) {
      fetchUrl.searchParams.set("api_key", process.env.PUBMED_API_KEY);
    }

    const fetchResponse = await fetch(fetchUrl.toString());
    const xmlText = await fetchResponse.text();

    // Parse XML (simplified - in production, use a proper XML parser)
    const articles = parsePubMedXML(xmlText);

    // Cache for 1 hour
    await cacheSet(cacheKey, articles, 3600);

    return articles;
  } catch (error) {
    console.error("PubMed search error:", error);
    throw error;
  }
}

function parsePubMedXML(xml: string): PubMedArticle[] {
  // This is a simplified parser
  // In production, use a proper XML parser like 'fast-xml-parser'
  const articles: PubMedArticle[] = [];

  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const articleXml of articleMatches) {
    const pmid = extractXMLTag(articleXml, "PMID");
    const title = extractXMLTag(articleXml, "ArticleTitle");
    const abstract = extractXMLTag(articleXml, "AbstractText");
    const journal = extractXMLTag(articleXml, "Title"); // Journal title
    const doi = extractXMLTag(articleXml, "ELocationID", 'EIdType="doi"');

    // Extract authors
    const authorMatches = articleXml.match(/<Author[\s\S]*?<\/Author>/g) || [];
    const authors = authorMatches.map((authorXml) => {
      const lastName = extractXMLTag(authorXml, "LastName");
      const foreName = extractXMLTag(authorXml, "ForeName");
      return {
        name: `${foreName} ${lastName}`.trim(),
        affiliation: extractXMLTag(authorXml, "Affiliation"),
      };
    });

    // Extract publication date
    const pubDate = extractXMLTag(articleXml, "PubDate");

    // Extract keywords
    const keywordMatches = articleXml.match(/<Keyword[\s\S]*?>([\s\S]*?)<\/Keyword>/g) || [];
    const keywords = keywordMatches.map((k) => extractXMLTag(k, "Keyword"));

    // Extract MeSH terms
    const meshMatches = articleXml.match(/<DescriptorName[\s\S]*?>([\s\S]*?)<\/DescriptorName>/g) || [];
    const meshTerms = meshMatches.map((m) =>
      m.replace(/<[^>]*>/g, "").trim()
    );

    if (pmid && title) {
      articles.push({
        pmid,
        title,
        abstract,
        authors,
        journal,
        publicationDate: pubDate,
        doi,
        keywords,
        meshTerms,
      });
    }
  }

  return articles;
}

function extractXMLTag(xml: string, tag: string, attribute?: string): string {
  const regex = attribute
    ? new RegExp(`<${tag}[^>]*${attribute}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
    : new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");

  const match = xml.match(regex);
  return match ? match[1].replace(/<[^>]*>/g, "").trim() : "";
}

export async function getPubMedArticle(pmid: string): Promise<PubMedArticle | null> {
  const results = await searchPubMed({ query: pmid, max_results: 1 });
  return results[0] || null;
}
