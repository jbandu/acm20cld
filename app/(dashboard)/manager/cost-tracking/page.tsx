import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CostTrackingDashboard } from "@/components/admin/CostTrackingDashboard";

export default async function CostTrackingPage() {
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
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/manager"
                className="text-sm text-blue-600 hover:text-blue-800 mb-2 block transition-colors inline-flex items-center gap-1 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Manager Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Cost Tracking & Budget Analysis
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{session.user?.name}</div>
              <div className="text-xs text-purple-600 font-medium">{session.user?.role}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <CostTrackingDashboard />
        </div>
      </main>
    </div>
  );
}
