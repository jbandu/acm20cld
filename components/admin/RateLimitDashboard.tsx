"use client";

import { useEffect, useState } from "react";

interface RateLimitStats {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  };
  hourly: {
    count: number;
    limit: number;
    remaining: number;
    resetIn: number;
  };
  daily: {
    count: number;
    limit: number;
    remaining: number;
    resetIn: number;
  };
  recentActivity: {
    lastHour: number;
    last24Hours: number;
  };
}

export function RateLimitDashboard() {
  const [stats, setStats] = useState<RateLimitStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"hourly" | "daily">("hourly");

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch("/api/rate-limits");

      if (!response.ok) {
        throw new Error("Failed to fetch rate limit stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function getUsageColor(usage: number, limit: number): string {
    const percentage = (usage / limit) * 100;

    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  }

  function getProgressColor(usage: number, limit: number): string {
    const percentage = (usage / limit) * 100;

    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rate limit stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const sortedStats = [...stats].sort((a, b) => {
    if (sortBy === "hourly") {
      return b.hourly.count - a.hourly.count;
    }
    return b.daily.count - a.daily.count;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-900">{stats.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Last Hour
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.filter((s) => s.recentActivity.lastHour > 0).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            At Hourly Limit
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {stats.filter((s) => s.hourly.remaining === 0).length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "hourly" | "daily")}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="hourly">Hourly Usage</option>
            <option value="daily">Daily Usage</option>
          </select>
        </div>

        <button
          onClick={fetchStats}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* User Stats Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hourly Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daily Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recent Activity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStats.map((stat) => (
              <tr key={stat.user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stat.user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {stat.user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium px-2 py-1 rounded ${getUsageColor(
                          stat.hourly.count,
                          stat.hourly.limit
                        )}`}
                      >
                        {stat.hourly.count} / {stat.hourly.limit}
                      </span>
                      <span className="text-xs text-gray-500">
                        {stat.hourly.remaining} left
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          stat.hourly.count,
                          stat.hourly.limit
                        )}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (stat.hourly.count / stat.hourly.limit) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Resets in {formatTime(stat.hourly.resetIn)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium px-2 py-1 rounded ${getUsageColor(
                          stat.daily.count,
                          stat.daily.limit
                        )}`}
                      >
                        {stat.daily.count} / {stat.daily.limit}
                      </span>
                      <span className="text-xs text-gray-500">
                        {stat.daily.remaining} left
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          stat.daily.count,
                          stat.daily.limit
                        )}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (stat.daily.count / stat.daily.limit) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Resets in {formatTime(stat.daily.resetIn)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Last hour: {stat.recentActivity.lastHour}</div>
                  <div>Last 24h: {stat.recentActivity.last24Hours}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
