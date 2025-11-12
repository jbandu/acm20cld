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
    return "User context unavailable";
  }

  const interests = userProfile.researchProfile?.primaryInterests || [];
  const secondaryInterests = userProfile.researchProfile?.secondaryInterests || [];
  const researchAreas = userProfile.researchProfile?.researchAreas || [];

  return `=== USER CONTEXT ===
User: ${userProfile.name}
Email: ${userProfile.email}
Role: ${userProfile.role}
${userProfile.title ? `Title: ${userProfile.title}` : ''}
${userProfile.department ? `Department: ${userProfile.department}` : ''}
${userProfile.institution ? `Institution: ${userProfile.institution}` : ''}

Research Profile:
${userProfile.researchProfile?.expertiseLevel ? `- Expertise Level: ${userProfile.researchProfile.expertiseLevel}` : ''}
${userProfile.researchProfile?.yearsInField ? `- Years in Field: ${userProfile.researchProfile.yearsInField}` : ''}
${interests.length > 0 ? `- Primary Research Interests: ${interests.join(', ')}` : ''}
${secondaryInterests.length > 0 ? `- Secondary Interests: ${secondaryInterests.join(', ')}` : ''}
${researchAreas.length > 0 ? `- Research Areas: ${researchAreas.join(', ')}` : ''}`;
}

export function buildOrganizationContext(): string {
  return `=== ORGANIZATION CONTEXT ===
Organization: ACM Biolabs
Institution Type: Advanced Cancer Research Laboratory
Mission: Accelerating cancer research through AI-powered literature analysis and data integration

Research Focus Areas:
- Cancer Biology & Therapeutics
- Immunotherapy & CAR-T Cell Therapy
- Tumor Microenvironment Research
- Biomarker Discovery
- Drug Development & Clinical Trials

Available Resources:
- Premium access to OpenAlex, PubMed, and Patents databases
- AI Analysis via Claude (Anthropic) and GPT-4 (OpenAI)
- Local LLM processing via Ollama
- Integrated knowledge graph (future)
- Proprietary ontology system (future)

Data Governance:
- HIPAA-compliant data handling
- Institutional review board protocols
- Research ethics guidelines
- IP protection policies`;
}

export function buildResearchPrompt(
  query: string,
  userContext: string,
  orgContext: string
): string {
  return `${userContext}

${orgContext}

=== RESEARCH QUERY ===
Query: "${query}"

=== YOUR TASK ===
You are an AI research assistant helping researchers at ACM Biolabs analyze scientific literature and data. Your task is to:

1. Analyze the research query in the context of the user's research focus and organization's priorities
2. Review the data retrieved from external sources
3. Synthesize findings across all sources
4. Identify key patterns, trends, and insights
5. Highlight any contradictions or gaps in the literature
6. Suggest potential research directions or follow-up queries

Please provide a comprehensive analysis that helps the researcher understand the landscape of their query.`;
}
