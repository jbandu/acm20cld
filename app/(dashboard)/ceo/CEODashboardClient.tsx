"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Activity,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface UserMetrics {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  department: string | null;
  institution: string | null;
  lastActivity: string;
  daysSinceLastActivity: number;
  onboardingComplete: boolean;
  primaryInterests: string[];
  expertiseLevel: string | null;
  metrics: {
    totalQueries: number;
    completedQueries: number;
    failedQueries: number;
    queriesPerWeek: number;
    avgCompletionTimeMinutes: number;
    successRate: number;
    totalFeedback: number;
    totalContributions: number;
    engagementScore: number;
  };
}

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalQueries: number;
  avgEngagement: number;
  onboardingComplete: number;
}

interface DashboardData {
  users: UserMetrics[];
  platformStats: PlatformStats;
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function CEODashboardClient({ user }: { user: User | null }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("engagement");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/ceo/users-efficacy");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sortedUsers = data?.users.sort((a, b) => {
    if (sortBy === "engagement") {
      return b.metrics.engagementScore - a.metrics.engagementScore;
    } else if (sortBy === "queries") {
      return b.metrics.totalQueries - a.metrics.totalQueries;
    } else if (sortBy === "recent") {
      return a.daysSinceLastActivity - b.daysSinceLastActivity;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getEngagementColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getActivityStatus = (days: number) => {
    if (days <= 1) return { text: "Active Today", color: "text-green-600" };
    if (days <= 7)
      return { text: `Active ${days}d ago`, color: "text-blue-600" };
    if (days <= 30)
      return { text: `Active ${days}d ago`, color: "text-yellow-600" };
    return { text: `Inactive ${days}d`, color: "text-red-600" };
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      {/* Header */}
      <header className="bg-white border-b-2 border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  CEO Dashboard
                </h1>
                <p className="text-neutral-600">
                  Research Platform Analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {user.name}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {user.role}
                  </div>
                </div>
              )}
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

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Error</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">
            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold gradient-text">
                  {data.platformStats.totalUsers}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Users
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-green-600" />
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {data.platformStats.activeUsers}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Active (7d)
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Search className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {data.platformStats.totalQueries}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Queries
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {data.platformStats.avgEngagement}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Avg Engagement
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-cyan-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="text-3xl font-bold text-cyan-600">
                  {data.platformStats.onboardingComplete}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Onboarded
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  User Research Efficacy
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("engagement")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      sortBy === "engagement"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Engagement
                  </button>
                  <button
                    onClick={() => setSortBy("queries")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      sortBy === "queries"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Queries
                  </button>
                  <button
                    onClick={() => setSortBy("recent")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      sortBy === "recent"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => setSortBy("name")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      sortBy === "name"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Name
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-card border-b-2 border-purple-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Queries
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Success Rate
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Queries/Week
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Engagement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedUsers?.map((user, index) => {
                      const activityStatus = getActivityStatus(
                        user.daysSinceLastActivity
                      );
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {user.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-xs font-medium ${activityStatus.color}`}
                            >
                              {activityStatus.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="font-semibold text-gray-900">
                              {user.metrics.totalQueries}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.metrics.completedQueries} completed
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-semibold text-gray-900">
                                {user.metrics.successRate}%
                              </span>
                              {user.metrics.successRate >= 80 ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                              ) : user.metrics.successRate >= 60 ? (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-gray-900">
                              {user.metrics.queriesPerWeek}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border-2 font-semibold ${getEngagementColor(
                                user.metrics.engagementScore
                              )}`}
                            >
                              <Award className="w-4 h-4" />
                              {user.metrics.engagementScore}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
