import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function ResearcherDashboard() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Researcher Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome,{" "}
              <Link
                href="/researcher/profile"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {session.user?.name}
              </Link>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/researcher/query/new"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                New Research Query
              </h3>
              <p className="text-gray-500">
                Search across multiple databases and get AI-powered insights
              </p>
            </Link>

            <Link
              href="/researcher/history"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Query History
              </h3>
              <p className="text-gray-500">
                View your past searches and results
              </p>
            </Link>

            <Link
              href="/researcher/knowledge-graph"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Knowledge Graph
              </h3>
              <p className="text-gray-500">
                Explore connections between research concepts
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
