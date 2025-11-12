import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { QueryHistoryClient } from "./QueryHistoryClient";

export default async function QueryHistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  }

  const queries = await prisma.query.findMany({
    where: { userId: session.user.id },
    include: {
      responses: {
        select: {
          id: true,
          source: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Calculate stats
  const totalQueries = queries.length;
  const completedQueries = queries.filter((q: any) => q.status === "COMPLETED").length;
  const totalResults = queries.reduce((acc: number, q: any) => acc + q.responses.length, 0);
  const avgResultsPerQuery = totalQueries > 0 ? Math.round(totalResults / totalQueries) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Hero Header */}
      <header className="bg-white border-b-2 border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/researcher"
                className="text-sm text-purple-600 hover:text-purple-800 mb-2 block transition-colors inline-flex items-center gap-1 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Query History
              </h1>
              <p className="text-neutral-600 text-lg">
                Track and explore your research queries
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{session.user?.name}</div>
                <div className="text-xs text-purple-600 font-medium">{session.user?.role}</div>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Total Queries</span>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold gradient-text">{totalQueries}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Completed</span>
                <div className="w-10 h-10 rounded-xl" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}>
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">{completedQueries}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Avg. Results</span>
                <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{avgResultsPerQuery}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        <QueryHistoryClient queries={queries} session={session} />
      </main>
    </div>
  );
}
