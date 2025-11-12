import { auth, requireRole } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function TeamActivityPage() {
  const session = await auth();

  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  // Get all users and their recent queries
  const users = await prisma.user.findMany({
    where: {
      role: "RESEARCHER",
    },
    include: {
      queries: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          responses: {
            select: { id: true },
          },
        },
      },
      _count: {
        select: {
          queries: true,
          feedback: true,
          contributions: true,
        },
      },
    },
    orderBy: { lastLoginAt: "desc" },
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Team Activity</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Researchers</div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Queries</div>
            <div className="text-3xl font-bold text-blue-600">
              {users.reduce((sum: number, u: any) => sum + u._count.queries, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Feedback Given</div>
            <div className="text-3xl font-bold text-green-600">
              {users.reduce((sum: number, u: any) => sum + u._count.feedback, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Contributions</div>
            <div className="text-3xl font-bold text-purple-600">
              {users.reduce((sum: number, u: any) => sum + u._count.contributions, 0)}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Team Members ({users.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {users.map((user: any) => (
              <div key={user.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-gray-400 mt-1">{user.department}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Last Active</div>
                    <div className="text-sm text-gray-900">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Queries</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {user._count.queries}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Feedback</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {user._count.feedback}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Contributions</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {user._count.contributions}
                    </div>
                  </div>
                </div>

                {/* Recent Queries */}
                {user.queries.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Recent Queries:
                    </div>
                    <div className="space-y-2">
                      {user.queries.map((query: any) => (
                        <div
                          key={query.id}
                          className="text-sm bg-gray-50 p-2 rounded"
                        >
                          <p className="text-gray-700 truncate">
                            {query.originalQuery}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>
                              {new Date(query.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{query.responses.length} results</span>
                            <span>•</span>
                            <span
                              className={
                                query.status === "COMPLETED"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }
                            >
                              {query.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
