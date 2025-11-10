import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function SourcesAdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const sources = await prisma.dataSource.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Data Sources</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Sources</div>
            <div className="text-3xl font-bold text-gray-900">{sources.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Active</div>
            <div className="text-3xl font-bold text-green-600">
              {sources.filter((s: { enabled: boolean }) => s.enabled).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Inactive</div>
            <div className="text-3xl font-bold text-red-600">
              {sources.filter((s: { enabled: boolean }) => !s.enabled).length}
            </div>
          </div>
        </div>

        {/* Sources List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Configured Sources
            </h2>
            <Link
              href="/admin/sources/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add Source
            </Link>
          </div>

          {sources.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No data sources configured yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sources.map((source: any) => (
                <div key={source.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {source.name}
                      </h3>
                      <p className="text-sm text-gray-500">{source.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {source.enabled ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {source.endpoint && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Endpoint:</span>
                      <p className="text-sm text-gray-700 font-mono">{source.endpoint}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Sync: {source.syncFrequency}</span>
                    {source.lastSync && (
                      <span>
                        Last synced: {new Date(source.lastSync).toLocaleDateString()}
                      </span>
                    )}
                    <span>
                      Added: {new Date(source.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Built-in Sources Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📚 Built-in Data Sources
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              • <strong>OpenAlex:</strong> Free and open scholarly database (no API key
              needed)
            </p>
            <p>
              • <strong>PubMed:</strong> NIH biomedical literature database (optional API
              key for higher limits)
            </p>
            <p>
              • <strong>PatentsView:</strong> USPTO patent database (free, no API key)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
