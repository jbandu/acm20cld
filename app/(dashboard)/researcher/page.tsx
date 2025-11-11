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
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-neutral-900">
              Researcher Dashboard
            </h1>
            <p className="text-neutral-600">
              Welcome,{" "}
              <Link
                href="/researcher/profile"
                className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-150"
              >
                {session.user?.name}
              </Link>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/researcher/query/new"
              className="group bg-white overflow-hidden shadow-card hover:shadow-card-hover rounded-lg transition-all duration-200 p-6 border border-neutral-200 hover:border-primary-300 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                New Research Query
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Search across multiple databases and get AI-powered insights
              </p>
            </Link>

            <Link
              href="/researcher/history"
              className="group bg-white overflow-hidden shadow-card hover:shadow-card-hover rounded-lg transition-all duration-200 p-6 border border-neutral-200 hover:border-secondary-300 animate-fade-in"
              style={{ animationDelay: '75ms' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-secondary-600 transition-colors">
                Query History
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                View your past searches and results
              </p>
            </Link>

            <Link
              href="/researcher/knowledge-graph"
              className="group bg-white overflow-hidden shadow-card hover:shadow-card-hover rounded-lg transition-all duration-200 p-6 border border-neutral-200 hover:border-accent-cyan-300 animate-fade-in"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-accent-pink-600 transition-colors">
                Knowledge Graph
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Explore connections between research concepts
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
