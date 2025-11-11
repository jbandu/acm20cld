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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)' }}>
      <header className="bg-white border-b-2 border-purple-200 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Researcher Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">Powered by AI-driven research intelligence</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Welcome,{" "}
                <Link
                  href="/researcher/profile"
                  className="text-purple-600 hover:text-purple-800 hover:underline font-semibold transition-colors"
                >
                  {session.user?.name}
                </Link>
              </p>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-400 transition-all"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href="/researcher/query/new"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}></div>
              <div className="relative p-8">
                <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  New Research Query
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Search across multiple databases and get AI-powered insights
                </p>
                <div className="mt-6 flex items-center text-purple-600 font-semibold">
                  Start Searching
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link
              href="/researcher/history"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'}}></div>
              <div className="relative p-8">
                <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'}}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Query History
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  View your past searches and results
                </p>
                <div className="mt-6 flex items-center text-cyan-600 font-semibold">
                  View History
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link
              href="/researcher/knowledge-graph"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" style={{background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)'}}></div>
              <div className="relative p-8">
                <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)'}}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                  Knowledge Graph
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore connections between research concepts
                </p>
                <div className="mt-6 flex items-center text-pink-600 font-semibold">
                  Explore Graph
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {isCEO && (
              <Link
                href="/ceo"
                className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-orange-200"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'}}></div>
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'}}>
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      CEO Dashboard
                    </h3>
                    <span className="px-2 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    View team research efficacy and platform analytics
                  </p>
                  <div className="mt-6 flex items-center text-orange-600 font-semibold">
                    View Analytics
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
