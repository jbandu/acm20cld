import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ManagerDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Only MANAGER and ADMIN roles can access this page
  if (session.user?.role !== "MANAGER" && session.user?.role !== "ADMIN") {
    redirect("/researcher");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <nav className="flex gap-4 mt-2">
                <Link
                  href="/researcher"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Researcher Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  User Management
                </Link>
              </nav>
            </div>
            <p className="text-gray-600">Welcome, {session.user?.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/manager/team-activity"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Team Activity
              </h3>
              <p className="text-gray-500">
                Monitor team research activities and queries
              </p>
            </Link>

            <Link
              href="/manager/analytics"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-500">
                View usage statistics and trends
              </p>
            </Link>

            <Link
              href="/manager/knowledge-contributions"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Knowledge Contributions
              </h3>
              <p className="text-gray-500">
                Review and approve research contributions
              </p>
            </Link>

            <Link
              href="/manager/rate-limits"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                API Rate Limits
              </h3>
              <p className="text-gray-500">
                Monitor user API usage and rate limits
              </p>
            </Link>

            <Link
              href="/manager/cost-tracking"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition p-6 border-2 border-green-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                💰 Cost Tracking
              </h3>
              <p className="text-gray-500">
                View per-researcher spending and budget forecasts
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
