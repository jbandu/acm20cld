import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    // Fetch recent queries with anonymized user data
    const recentQueries = await prisma.query.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        originalQuery: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            researchProfile: {
              select: {
                primaryInterests: true,
              },
            },
          },
        },
      },
    });

    // Transform to activity feed format
    const activities = recentQueries.map((query) => {
      const firstName = query.user.name.split(" ")[0];
      const field = query.user.researchProfile?.primaryInterests?.[0] || "Cancer Research";

      // Determine activity type based on query content
      let type: "discovery" | "query" | "insight" = "query";
      if (query.originalQuery.toLowerCase().includes("breakthrough") ||
          query.originalQuery.toLowerCase().includes("novel")) {
        type = "discovery";
      } else if (query.originalQuery.toLowerCase().includes("mechanism") ||
                 query.originalQuery.toLowerCase().includes("pathway")) {
        type = "insight";
      }

      // Create descriptive text
      const queryPreview = query.originalQuery.length > 80
        ? query.originalQuery.slice(0, 80) + "..."
        : query.originalQuery;

      let text = "";
      if (type === "discovery") {
        text = `Found breakthrough insights on: "${queryPreview}"`;
      } else if (type === "insight") {
        text = `Analyzed mechanisms in: "${queryPreview}"`;
      } else {
        text = `Researching: "${queryPreview}"`;
      }

      return {
        id: query.id,
        type,
        text,
        researcher: `${firstName} R.`, // Anonymize last name
        timestamp: query.createdAt,
        field,
      };
    });

    return NextResponse.json({
      activities,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);

    // Return mock data if database query fails
    const mockActivities = [
      {
        id: "1",
        type: "discovery" as const,
        text: "Found breakthrough insights on: \"CAR-T cell exhaustion mechanisms in solid tumors\"",
        researcher: "Sarah M.",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        field: "Immunotherapy",
      },
      {
        id: "2",
        type: "query" as const,
        text: "Researching: \"PD-1 checkpoint inhibitor resistance patterns in melanoma\"",
        researcher: "James K.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        field: "Oncology",
      },
      {
        id: "3",
        type: "insight" as const,
        text: "Analyzed mechanisms in: \"Tumor microenvironment immune evasion strategies\"",
        researcher: "Maria L.",
        timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
        field: "Cancer Biology",
      },
      {
        id: "4",
        type: "discovery" as const,
        text: "Found breakthrough insights on: \"Liquid biopsy biomarkers for early pancreatic cancer detection\"",
        researcher: "David C.",
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 min ago
        field: "Diagnostics",
      },
      {
        id: "5",
        type: "query" as const,
        text: "Researching: \"CRISPR base editing applications in cancer gene therapy 2024\"",
        researcher: "Emily R.",
        timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 min ago
        field: "Gene Therapy",
      },
    ];

    return NextResponse.json({
      activities: mockActivities,
      lastUpdated: new Date().toISOString(),
    });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 30; // Revalidate every 30 seconds
