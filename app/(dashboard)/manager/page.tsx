import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ManagerDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "MANAGER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container-dashboard py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Manager Dashboard
              </h1>
              <p className="text-sm text-neutral-600 mt-1">Welcome back, {session.user?.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-dashboard py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/manager/team-activity"
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal group"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              Team Activity
            </h3>
            <p className="text-neutral-600">
              Monitor team research activities and queries
            </p>
          </Link>

          <Link
            href="/manager/analytics"
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal group"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              Analytics
            </h3>
            <p className="text-neutral-600">
              View usage statistics and trends
            </p>
          </Link>

          <Link
            href="/manager/knowledge-contributions"
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal group"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              Knowledge Contributions
            </h3>
            <p className="text-neutral-600">
              Review and approve research contributions
            </p>
          </Link>

          <Link
            href="/manager/rate-limits"
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal group"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              API Rate Limits
            </h3>
            <p className="text-neutral-600">
              Monitor user API usage and rate limits
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
