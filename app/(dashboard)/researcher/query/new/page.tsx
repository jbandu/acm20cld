import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { QueryBuilder } from "@/components/query/QueryBuilder";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function NewQueryPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)' }}>
      <header className="bg-white border-b-2 border-purple-200 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/researcher"
                className="text-sm text-purple-600 hover:text-purple-800 mb-2 block transition-colors inline-flex items-center gap-1 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>New Research Query</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{session.user?.name}</div>
                <div className="text-xs text-purple-600 font-medium">{session.user?.role}</div>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            AI-Powered Research Search
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
            Search across multiple databases and get AI-generated summaries. Your query will be automatically refined for optimal results.
          </p>
        </div>

        <QueryBuilder />
      </main>
    </div>
  );
}
