/**
 * API Endpoint: Save Onboarding Step
 *
 * Saves user's progress through onboarding wizard
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { step, data } = body;

    if (typeof step !== "number" || !data) {
      return NextResponse.json(
        { error: "Invalid step or data" },
        { status: 400 }
      );
    }

    // Get or create research profile
    let profile = await prisma.userResearchProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      profile = await prisma.userResearchProfile.create({
        data: {
          userId: session.user.id,
          primaryInterests: [],
          secondaryInterests: [],
          researchAreas: [],
          techniques: [],
          computationalSkills: [],
          collaborators: [],
          institutions: [],
          preferredSources: [],
          preferredLLMs: [],
          currentProjects: [],
          currentGoals: [],
          researchGoals: [],
          similarResearchers: [],
          teamInterests: [],
          queryFrequency: {},
          activeHours: {},
          weeklyPattern: {},
          paperPreferences: {},
          topicVelocity: {},
          onboardingStep: step,
        },
      });
    }

    // Process step data based on step number
    switch (step) {
      case 1: // Welcome & Basic Info
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            title: data.title,
            institution: data.institution,
            department: data.department,
            location: data.location,
            bio: data.bio,
          },
        });
        break;

      case 2: // Educational Background
        if (data.education && Array.isArray(data.education)) {
          // Delete existing education entries
          await prisma.educationEntry.deleteMany({
            where: { profileId: profile.id },
          });

          // Create new entries
          for (const edu of data.education) {
            if (edu.degree && edu.field) {
              await prisma.educationEntry.create({
                data: {
                  profileId: profile.id,
                  degree: edu.degree,
                  field: edu.field,
                  institution: edu.institution || "",
                  location: edu.location,
                  startYear: edu.startYear ? parseInt(edu.startYear) : null,
                  endYear: edu.endYear ? parseInt(edu.endYear) : null,
                  current: edu.current || false,
                  thesisTopic: edu.thesisTopic,
                  advisor: edu.advisor,
                  keyFindings: edu.keyFindings || [],
                },
              });
            }
          }
        }

        await prisma.userResearchProfile.update({
          where: { id: profile.id },
          data: {
            highestDegree: data.highestDegree,
            phdFocus: data.phdFocus,
          },
        });
        break;

      case 3: // Research Areas & Expertise
        await prisma.userResearchProfile.update({
          where: { id: profile.id },
          data: {
            researchAreas: data.researchAreas || [],
            primaryInterests: data.researchAreas?.slice(0, 3) || [],
            secondaryInterests: data.researchAreas?.slice(3) || [],
            techniques: data.techniques || [],
            computationalSkills: data.computationalSkills || [],
            expertiseLevel: data.expertiseLevel,
            yearsInField: data.yearsInField ? parseInt(data.yearsInField) : null,
          },
        });
        break;

      case 4: // LinkedIn Import
        if (data.linkedinImported && data.linkedinData) {
          // Handle LinkedIn data (placeholder for now)
          console.log("LinkedIn data received:", data.linkedinData);
        }
        break;

      case 5: // Projects & Goals
        // Create projects
        if (data.projects && Array.isArray(data.projects)) {
          await prisma.projectFocus.deleteMany({
            where: { profileId: profile.id },
          });

          for (const project of data.projects) {
            if (project.title) {
              await prisma.projectFocus.create({
                data: {
                  profileId: profile.id,
                  title: project.title,
                  description: project.description || "",
                  status: project.status || "IN_PROGRESS",
                  methodology: [],
                  keyPapers: [],
                  relatedQueries: [],
                  collaborators: [],
                },
              });
            }
          }
        }

        // Create goals
        if (data.goals && Array.isArray(data.goals)) {
          for (const goal of data.goals) {
            if (goal.type && goal.title) {
              await prisma.userGoal.create({
                data: {
                  userId: session.user.id,
                  type: goal.type,
                  title: goal.title,
                  targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
                  relatedQueries: [],
                  relatedDocuments: [],
                  relatedPapers: [],
                },
              });
            }
          }
        }
        break;

      case 6: // Preferences
        // Get or create preferences
        const existingPrefs = await prisma.userPreferences.findUnique({
          where: { userId: session.user.id },
        });

        const prefsData = {
          userId: session.user.id,
          preferredSources: data.preferredSources || ["openalex", "pubmed"],
          preferredLLMs: data.preferredLLMs || ["claude"],
          defaultSearchDepth: data.defaultSearchDepth || "standard",
          openAccessOnly: data.openAccessOnly || false,
          preferredJournals: data.preferredJournals || [],
          excludeJournals: data.excludeJournals || [],
          minCitations: data.minCitations,
          maxYearsOld: data.maxYearsOld,
          preferReviews: data.preferReviews || false,
          preferOriginalResearch: data.preferOriginalResearch ?? true,
          preferClinical: data.preferClinical || false,
          emailDigest: data.emailDigest ?? true,
          digestFrequency: data.digestFrequency || "weekly",
          notifyNewPapers: data.notifyNewPapers ?? true,
          notifyTeamActivity: data.notifyTeamActivity ?? true,
          resultsPerPage: data.resultsPerPage || 20,
          showAbstracts: data.showAbstracts ?? true,
          showKeyFindings: data.showKeyFindings ?? true,
          compactView: data.compactView || false,
          questionSuggestions: data.questionSuggestions ?? true,
          proactiveSuggestions: data.proactiveSuggestions ?? true,
          suggestionFrequency: data.suggestionFrequency || "moderate",
          profileVisibility: data.profileVisibility || "team",
          shareActivityFeed: data.shareActivityFeed ?? true,
          shareKnowledge: data.shareKnowledge ?? true,
        };

        if (existingPrefs) {
          await prisma.userPreferences.update({
            where: { userId: session.user.id },
            data: prefsData,
          });
        } else {
          await prisma.userPreferences.create({
            data: prefsData,
          });
        }

        // Mark onboarding as complete
        await prisma.userResearchProfile.update({
          where: { id: profile.id },
          data: {
            onboardingComplete: true,
            onboardingStep: 6,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Onboarding complete!",
          complete: true,
        });
    }

    // Update onboarding progress
    await prisma.userResearchProfile.update({
      where: { id: profile.id },
      data: {
        onboardingStep: step,
      },
    });

    return NextResponse.json({
      success: true,
      step,
      message: `Step ${step} saved successfully`,
    });

  } catch (error) {
    console.error("Error saving onboarding step:", error);
    return NextResponse.json(
      {
        error: "Failed to save onboarding data",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
