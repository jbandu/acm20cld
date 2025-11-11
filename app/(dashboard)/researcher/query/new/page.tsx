import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { QueryBuilder } from "@/components/query/QueryBuilder";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function NewQueryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const profile = await prisma.userResearchProfile.findUnique({
    where: { userId: session.user.id },
    select: { onboardingComplete: true },
  });

  if (!profile?.onboardingComplete) {
    redirect("/onboarding");
  }

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
              <h1 className="text-2xl font-bold text-gray-900">New Research Query</h1>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{session.user?.name}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {session.user?.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Multi-Source AI-Powered Research
          </h2>
          <p className="text-gray-600">
            Search across multiple databases and get AI-generated summaries and insights.
            Your query will be automatically refined for optimal results.
          </p>
        </div>

        <QueryBuilder />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Better Results</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about the research area or condition</li>
            <li>• Include relevant keywords and terminology</li>
            <li>• Specify timeframes if looking for recent developments</li>
            <li>• Select multiple sources for comprehensive coverage</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
