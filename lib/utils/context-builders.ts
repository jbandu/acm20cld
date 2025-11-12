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

export function buildOrganizationContext(): string {
  return "Organization: ACM Biolabs (Cancer Research)";
}

export function buildResearchPrompt(
  query: string,
  userContext: string,
  orgContext: string
): string {
  return `${userContext}
${orgContext}

Query: "${query}"

Provide:
1. Key findings (3-5 themes)
2. Notable insights
3. Gaps or contradictions
4. Follow-up questions

Be concise and actionable.`;
}
