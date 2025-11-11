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

  // Fetch user role to show CEO dashboard card if applicable
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isCEO = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Product name and route */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Researcher Dashboard
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 mt-0.5">
                Powered by AI-driven research intelligence
              </p>
            </div>

            {/* Right: Greeting and logout */}
            <div className="flex items-center gap-3 lg:gap-4">
              <p className="text-sm text-gray-700 hidden sm:block">
                Welcome,{" "}
                <span className="font-semibold text-gray-900">
                  {session.user?.name}
                </span>
              </p>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered with generous padding and white space */}
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: New Research Query */}
          <Link
            href="/researcher/query/new"
            className="group relative bg-gradient-to-br from-purple-50/80 to-blue-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-purple-100/50"
          >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              {/* Circular icon container */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Title - bold */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                New Research Query
              </h3>

              {/* Description - smaller, muted */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Search across multiple databases and get AI-powered insights tailored to your research.
              </p>

              {/* CTA link with arrow - accent color */}
              <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                <span>Start Searching</span>
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 2: Query History */}
          <Link
            href="/researcher/history"
            className="group relative bg-gradient-to-br from-cyan-50/80 to-blue-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-cyan-100/50"
          >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              {/* Circular icon container */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Title - bold */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors">
                Query History
              </h3>

              {/* Description - smaller, muted */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Review your past searches, revisit results, and track your research journey over time.
              </p>

              {/* CTA link with arrow - accent color */}
              <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors">
                <span>View History</span>
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 3: Knowledge Graph */}
          <Link
            href="/researcher/knowledge-graph"
            className="group relative bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-pink-100/50"
          >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              {/* Circular icon container */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>

              {/* Title - bold */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                Knowledge Graph
              </h3>

              {/* Description - smaller, muted */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Explore connections between research concepts and discover new insights visually.
              </p>

              {/* CTA link with arrow - accent color */}
              <div className="flex items-center text-pink-600 font-semibold text-sm group-hover:text-pink-700 transition-colors">
                <span>Explore Graph</span>
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 4: CEO Dashboard (only for admins) */}
          {isCEO && (
            <Link
              href="/ceo"
              className="group relative bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border-2 border-orange-200/60"
            >
              {/* Decorative blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

              <div className="relative">
                {/* Circular icon container */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>

                {/* Title with badge */}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                    CEO Dashboard
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                    ADMIN
                  </span>
                </div>

                {/* Description - smaller, muted */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  View team research efficacy and platform analytics for organizational insights.
                </p>

                {/* CTA link with arrow - accent color */}
                <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                  <span>View Analytics</span>
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
