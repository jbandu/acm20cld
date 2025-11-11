import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import KnowledgeGraphClient from "./KnowledgeGraphClient";

export default async function KnowledgeGraphPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const profile = await prisma.userResearchProfile.findUnique({
    where: { userId: session.user.id },
    select: { onboardingComplete: true },
  });

  if (!profile?.onboardingComplete) {
    redirect("/onboarding");
  }

  // Fetch fresh user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  });

  return <KnowledgeGraphClient user={user} />;
}
