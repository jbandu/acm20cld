// Shared context builders for LLM prompts
// Used by both the review modal (for display) and query orchestrator (for actual API calls)

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string | null;
  department?: string | null;
  institution?: string | null;
  researchProfile?: {
    primaryInterests: string[];
    secondaryInterests: string[];
    expertiseLevel: string;
    yearsInField?: number | null;
    researchAreas: string[];
  } | null;
}

/**
 * Analyzes if a query is relevant to the organization's focus (cancer research)
 * Returns true if the query contains cancer-related terms
 */
export function isQueryRelevantToOrg(query: string): boolean {
  const queryLower = query.toLowerCase();

  const cancerTerms = [
    'cancer', 'oncology', 'oncological', 'tumor', 'tumour', 'neoplasm',
    'carcinoma', 'sarcoma', 'leukemia', 'lymphoma', 'melanoma',
    'metastasis', 'metastatic', 'chemotherapy', 'radiotherapy',
    'immunotherapy', 'car-t', 'checkpoint inhibitor', 'pd-1', 'pd-l1',
    'ctla-4', 'braf', 'egfr', 'her2', 'kras',
    'malignancy', 'malignant', 'benign tumor',
  ];

  return cancerTerms.some(term => queryLower.includes(term));
}

export function buildUserContext(userProfile: UserProfile | null): string {
  if (!userProfile) {
    return "Researcher context unavailable";
  }

  const interests = userProfile.researchProfile?.primaryInterests || [];
  const name = userProfile.name.split(' ')[0]; // First name only for privacy

  let context = `Researcher: ${name}`;

  if (userProfile.researchProfile?.expertiseLevel) {
    context += ` (${userProfile.researchProfile.expertiseLevel})`;
  }

  if (interests.length > 0) {
    context += `\nFocus: ${interests.slice(0, 3).join(', ')}`;
  }

  return context;
}

export function buildOrganizationContext(query?: string): string {
  // If no query provided, include context (for backwards compatibility)
  if (!query) {
    return "Organization: ACM Biolabs (Cancer Research)";
  }

  // Only include org context if query is relevant to cancer research
  if (isQueryRelevantToOrg(query)) {
    return "Organization: ACM Biolabs (Cancer Research)";
  }

  // For unrelated queries, return empty string
  return "";
}

export function buildResearchPrompt(
  query: string,
  userContext: string,
  orgContext: string
): string {
  // Build context lines (only include non-empty contexts)
  const contextLines = [userContext, orgContext].filter(c => c && c.trim().length > 0);
  const contextSection = contextLines.length > 0 ? contextLines.join('\n') + '\n\n' : '';

  return `${contextSection}Query: "${query}"

Provide:
1. Key findings (3-5 themes)
2. Notable insights
3. Gaps or contradictions
4. Follow-up questions

Be concise and actionable.`;
}
