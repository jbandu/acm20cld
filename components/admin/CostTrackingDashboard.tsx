"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserSpending {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string | null;
  };
  spending: {
    totalCost: number;
    queryCount: number;
    averageCostPerQuery: number;
    costByService: Record<string, number>;
  };
}

interface CostReportData {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  organization: {
    totalCost: number;
    totalQueries: number;
    averageCostPerQuery: number;
    userCount: number;
  };
  users: UserSpending[];
}

export function CostTrackingDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<CostReportData | null>(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchCostReport();
  }, [period]);

  const fetchCostReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/cost-report?days=${period}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch cost report");
      }

      const reportData = await response.json();
      setData(reportData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cost Tracking</h2>
          <p className="text-gray-600 mt-1">
            Query costs and spending analysis
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Organization Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-1">
            Total Spend
          </div>
          <div className="text-3xl font-bold text-blue-900">
            ${data.organization.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Last {period} days
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-sm font-medium text-green-700 mb-1">
            Total Queries
          </div>
          <div className="text-3xl font-bold text-green-900">
            {data.organization.totalQueries}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Across {data.organization.userCount} users
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-sm font-medium text-purple-700 mb-1">
            Avg Per Query
          </div>
          <div className="text-3xl font-bold text-purple-900">
            ${data.organization.averageCostPerQuery.toFixed(4)}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Organization average
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="text-sm font-medium text-orange-700 mb-1">
            Active Users
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {data.organization.userCount}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            With query activity
          </div>
        </div>
      </div>

      {/* Cost Breakdown Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-yellow-900">
            <strong>Note:</strong> Costs are estimated based on current API
            pricing. Data sources (OpenAlex, PubMed, Patents) are free. LLM
            costs vary by usage: Claude ~$0.066/query, GPT-4 ~$0.14/query.
          </div>
        </div>
      </div>

      {/* User Spending Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Spending by Researcher
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Researcher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg/Query
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Top Service
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((userSpend) => {
                const topService = Object.entries(
                  userSpend.spending.costByService
                ).sort(([, a], [, b]) => b - a)[0];

                return (
                  <tr key={userSpend.user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {userSpend.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {userSpend.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userSpend.user.department || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userSpend.spending.queryCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${userSpend.spending.totalCost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        ${userSpend.spending.averageCostPerQuery.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topService ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {topService[0]}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${topService[1].toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.users.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              No query activity in the selected period
            </p>
          </div>
        )}
      </div>

      {/* Budget Recommendation */}
      {data.organization.totalCost > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Budget Planning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-700 font-medium mb-1">
                Projected Monthly
              </div>
              <div className="text-2xl font-bold text-blue-900">
                $
                {((data.organization.totalCost / period) * 30).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium mb-1">
                Projected Quarterly
              </div>
              <div className="text-2xl font-bold text-blue-900">
                $
                {((data.organization.totalCost / period) * 90).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium mb-1">
                Projected Annual
              </div>
              <div className="text-2xl font-bold text-blue-900">
                $
                {((data.organization.totalCost / period) * 365).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
