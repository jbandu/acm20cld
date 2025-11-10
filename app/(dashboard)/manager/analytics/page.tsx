import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Get analytics data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalQueries,
    completedQueries,
    failedQueries,
    totalFeedback,
    avgResponsesPerQuery,
    topSources,
    topLLMs,
    recentDigests,
  ] = await Promise.all([
    prisma.query.count(),
    prisma.query.count({ where: { status: "COMPLETED" } }),
    prisma.query.count({ where: { status: "FAILED" } }),
    prisma.feedback.count(),
    // Calculate average responses per query
    prisma.query
      .findMany({
        select: {
          _count: {
            select: { responses: true },
          },
        },
      })
      .then((queries) => {
        if (queries.length === 0) return 0;
        const total = queries.reduce((sum, q) => sum + q._count.responses, 0);
        return Math.round(total / queries.length);
      }),
    prisma.response
      .groupBy({
        by: ["source"],
        _count: true,
      })
      .then((groups) =>
        groups.sort((a, b) => b._count - a._count).slice(0, 5)
      ),
    prisma.query
      .findMany({
        select: { llms: true },
      })
      .then((queries) => {
        const llmCounts = new Map<string, number>();
        queries.forEach((q) => {
          q.llms.forEach((llm) => {
            llmCounts.set(llm, (llmCounts.get(llm) || 0) + 1);
          });
        });
        return Array.from(llmCounts.entries())
          .map(([llm, count]) => ({ llm, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }),
    prisma.researchDigest.findMany({
      take: 5,
      orderBy: { date: "desc" },
    }),
  ]);

  const successRate =
    totalQueries > 0
      ? Math.round((completedQueries / totalQueries) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/manager"
            className="text-sm text-gray-500 hover:text-gray-700 mb-1 block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Key Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Total Queries</div>
              <div className="text-3xl font-bold text-gray-900">{totalQueries}</div>
              <div className="text-xs text-gray-400 mt-1">All time</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-green-600">{successRate}%</div>
              <div className="text-xs text-gray-400 mt-1">
                {completedQueries} completed / {failedQueries} failed
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Avg Responses</div>
              <div className="text-3xl font-bold text-blue-600">
                {avgResponsesPerQuery}
              </div>
              <div className="text-xs text-gray-400 mt-1">Per query</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Total Feedback</div>
              <div className="text-3xl font-bold text-purple-600">{totalFeedback}</div>
              <div className="text-xs text-gray-400 mt-1">All time</div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Data Sources
            </h3>
            <div className="space-y-3">
              {topSources.map((item, index) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {item.source}
                    </span>
                    <span className="text-sm text-gray-500">{item._count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item._count / topSources[0]._count) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top LLMs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Most Used LLMs
            </h3>
            <div className="space-y-3">
              {topLLMs.map((item, index) => (
                <div key={item.llm}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {item.llm}
                    </span>
                    <span className="text-sm text-gray-500">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / topLLMs[0].count) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Research Digests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Research Digests
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDigests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No research digests yet
              </div>
            ) : (
              recentDigests.map((digest) => (
                <div key={digest.id} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(digest.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {digest.totalArticles} articles collected
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {digest.status}
                    </span>
                  </div>
                  {digest.topTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {digest.topTopics.slice(0, 5).map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
