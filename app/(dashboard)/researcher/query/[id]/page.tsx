import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ResponseCard } from "@/components/results/ResponseCard";
import { ExportButton } from "@/components/results/ExportButton";
import { QueryInfo } from "@/components/results/QueryInfo";
import { QueryResultsClient } from "@/components/query/QueryResultsClient";
import Link from "next/link";

export default async function QueryResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const query = await prisma.query.findUnique({
    where: { id },
    include: {
      responses: {
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!query || query.userId !== session.user.id) {
    redirect("/researcher");
  }

  // Get total query count for celebration logic
  const queryCount = await prisma.query.count({
    where: { userId: session.user.id },
  });

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* First Query Celebration */}
      <QueryResultsClient
        isCompleted={query.status === "COMPLETED"}
        resultsCount={query.responses.length}
        startedAt={query.startedAt}
        completedAt={query.completedAt}
        queryCount={queryCount}
      />

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
              <h1 className="text-2xl font-bold text-gray-900">Query Results</h1>
            </div>
            <div className="flex items-center gap-3">
              <ExportButton query={query} />
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[query.status]
                }`}
              >
                {query.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Query Information */}
        <QueryInfo
          originalQuery={query.originalQuery}
          refinedQuery={query.refinedQuery}
          sources={query.sources}
          llms={query.llms}
          startedAt={query.startedAt}
          completedAt={query.completedAt}
        />

        {/* Status Messages */}
        {query.status === "PROCESSING" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-blue-600 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-blue-800 font-medium">
                Processing your query... This may take a minute.
              </span>
            </div>
          </div>
        )}

        {query.status === "FAILED" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">
              Query processing failed. Please try again or contact support.
            </p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Results ({query.responses.length})
          </h2>

          {query.responses.length === 0 && query.status === "COMPLETED" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">
                No results found for this query. Try broadening your search terms.
              </p>
            </div>
          )}

          {query.responses.map((response) => (
            <ResponseCard key={response.id} response={response} queryId={query.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
