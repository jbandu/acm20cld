import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function KnowledgeContributionsPage() {
  const session = await auth();

  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const contributions = await prisma.knowledgeContribution.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const pendingCount = contributions.filter((c: any) => !c.approvedAt).length;
  const approvedCount = contributions.filter((c: any) => c.approvedAt).length;

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
          <h1 className="text-2xl font-bold text-gray-900">
            Knowledge Contributions
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Contributions</div>
            <div className="text-3xl font-bold text-gray-900">
              {contributions.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Contributions ({contributions.length})
            </h2>
          </div>

          {contributions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contributions yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contributions.map((contribution: any) => (
                <div key={contribution.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {contribution.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contribution.user.email}
                      </div>
                    </div>
                    <div className="text-right">
                      {contribution.approvedAt ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Category: {contribution.category}
                    </div>
                    {contribution.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {contribution.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Submitted: {new Date(contribution.createdAt).toLocaleDateString()}
                    </span>
                    {contribution.addedToGraph && (
                      <span className="text-blue-600 font-medium">
                        ✓ Added to knowledge graph
                      </span>
                    )}
                    {contribution.approvedAt && (
                      <span>
                        Approved: {new Date(contribution.approvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
