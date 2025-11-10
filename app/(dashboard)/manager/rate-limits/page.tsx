import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { RateLimitDashboard } from "@/components/admin/RateLimitDashboard";
import Link from "next/link";

export default async function RateLimitsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has manager or admin role
  if (!["MANAGER", "ADMIN"].includes(session.user.role)) {
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
                className="text-sm text-gray-500 hover:text-gray-700 mb-1 block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                API Rate Limits
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor user API usage and rate limits
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <RateLimitDashboard />
        </div>
      </main>
    </div>
  );
}
