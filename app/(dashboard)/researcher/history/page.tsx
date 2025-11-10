import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function QueryHistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/researcher"
                className="text-sm text-gray-500 hover:text-gray-700 mb-1 block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Query History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Research Queries ({queries.length})
            </h2>
          </div>

          {queries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No queries yet</p>
              <Link
                href="/researcher/query/new"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Your First Query
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {queries.map((query: any) => (
                <Link
                  key={query.id}
                  href={`/researcher/query/${query.id}`}
                  className="block p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {query.originalQuery}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {query.sources.map((source: string) => (
                          <span
                            key={source}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(query.startedAt).toLocaleString()}</span>
                        <span>{query.responses.length} results</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[query.status]
                      }`}
                    >
                      {query.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
