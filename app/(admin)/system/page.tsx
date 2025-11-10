import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SystemAdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Database</div>
                <div className="text-sm text-gray-500">PostgreSQL (Neon)</div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Redis Cache</div>
                <div className="text-sm text-gray-500">Session & Caching</div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Configure Required
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Neo4j</div>
                <div className="text-sm text-gray-500">Knowledge Graph</div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Configure Required
              </span>
            </div>
          </div>
        </div>

        {/* Background Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Background Jobs</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Nightly Research Agent</div>
                <div className="text-sm text-gray-500">
                  Automated research collection at 2 AM daily
                </div>
              </div>
              <Link
                href="/api/admin/nightly-research?action=status"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                View Status
              </Link>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">API Integrations</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Anthropic (Claude)</div>
                <div className="text-sm text-gray-500">AI Analysis & Query Refinement</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  process.env.ANTHROPIC_API_KEY
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {process.env.ANTHROPIC_API_KEY ? "Configured" : "Not Configured"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">OpenAI (GPT-4)</div>
                <div className="text-sm text-gray-500">Alternative AI Analysis</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  process.env.OPENAI_API_KEY
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {process.env.OPENAI_API_KEY ? "Configured" : "Not Configured"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">OpenAlex</div>
                <div className="text-sm text-gray-500">Scholarly database (optional key)</div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Free Access
              </span>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            ⚠️ Configuration Required
          </h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>To enable all features, configure these environment variables:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>
                <code className="bg-yellow-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code>{" "}
                - For Claude AI integration
              </li>
              <li>
                <code className="bg-yellow-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> -
                For GPT-4 integration
              </li>
              <li>
                <code className="bg-yellow-100 px-1 py-0.5 rounded">REDIS_URL</code> - For
                caching and job queue
              </li>
              <li>
                <code className="bg-yellow-100 px-1 py-0.5 rounded">NEO4J_URI</code> - For
                knowledge graph (optional)
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
