/**
 * DashboardLayout Component
 *
 * Complete Amplitude-inspired dashboard layout example showcasing:
 * - StatCards in a grid
 * - ChartCards with visualizations
 * - DataTable
 * - Responsive design
 * - Beautiful purple/blue color scheme
 */

'use client';

import React from 'react';
import {
  Search,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Database,
  ArrowRight,
} from 'lucide-react';
import { StatCard, StatCardGrid } from './StatCard';
import { ChartCard, ChartCardGrid, ChartPlaceholder } from './ChartCard';
import { DataTable, Column } from './DataTable';

// Sample data types
interface QueryData {
  id: string;
  query: string;
  sources: string;
  status: string;
  date: string;
}

export function DashboardLayout() {
  // Sample stat data
  const stats = [
    {
      title: 'Total Queries',
      value: '1,234',
      change: 12.5,
      trend: 'up' as const,
      icon: Search,
      color: 'primary' as const,
    },
    {
      title: 'Data Sources',
      value: '8',
      change: 2,
      trend: 'up' as const,
      icon: Database,
      color: 'secondary' as const,
    },
    {
      title: 'Research Papers',
      value: '12.4K',
      change: -3.2,
      trend: 'down' as const,
      icon: FileText,
      color: 'cyan' as const,
    },
    {
      title: 'Active Users',
      value: '89',
      change: 8.1,
      trend: 'up' as const,
      icon: Users,
      color: 'emerald' as const,
    },
  ];

  // Sample table data
  const tableData: QueryData[] = [
    {
      id: '1',
      query: 'Machine learning applications in biology',
      sources: 'OpenAlex, PubMed',
      status: 'Completed',
      date: '2025-11-10',
    },
    {
      id: '2',
      query: 'CRISPR gene editing techniques',
      sources: 'PubMed, Patents',
      status: 'Processing',
      date: '2025-11-10',
    },
    {
      id: '3',
      query: 'Biomarkers for cancer detection',
      sources: 'OpenAlex, PubMed',
      status: 'Completed',
      date: '2025-11-09',
    },
    {
      id: '4',
      query: 'Stem cell research advances',
      sources: 'OpenAlex',
      status: 'Completed',
      date: '2025-11-09',
    },
    {
      id: '5',
      query: 'Neuroscience and AI integration',
      sources: 'PubMed, OpenAlex',
      status: 'Failed',
      date: '2025-11-08',
    },
  ];

  const tableColumns: Column<QueryData>[] = [
    {
      key: 'query',
      header: 'Query',
      accessor: (row) => (
        <div className="font-medium text-neutral-900">{row.query}</div>
      ),
      sortable: true,
      width: 'w-1/3',
    },
    {
      key: 'sources',
      header: 'Sources',
      accessor: (row) => (
        <div className="text-neutral-600">{row.sources}</div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => {
        const statusColors = {
          Completed: 'bg-accent-emerald-100 text-accent-emerald-800',
          Processing: 'bg-secondary-100 text-secondary-800',
          Failed: 'bg-accent-red-100 text-accent-red-800',
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              statusColors[row.status as keyof typeof statusColors]
            }`}
          >
            {row.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (row) => (
        <div className="text-neutral-600">{row.date}</div>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container-dashboard py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Research Dashboard
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Welcome back! Here's your research activity overview.
              </p>
            </div>

            <button className="px-6 py-2.5 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md">
              New Query
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-dashboard py-8">
        {/* Stats Grid */}
        <section className="mb-8">
          <StatCardGrid columns={4}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </StatCardGrid>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Analytics Overview
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <ChartCardGrid columns={2}>
            {/* Research Activity Chart */}
            <ChartCard
              title="Research Activity"
              subtitle="Last 30 days"
              icon={BarChart3}
              height="lg"
            >
              <ChartPlaceholder message="Line chart showing daily query volume will render here" />
            </ChartCard>

            {/* Data Source Usage Chart */}
            <ChartCard
              title="Data Source Usage"
              subtitle="Distribution by source"
              icon={Database}
              height="lg"
            >
              <ChartPlaceholder message="Donut chart showing source distribution will render here" />
            </ChartCard>
          </ChartCardGrid>
        </section>

        {/* Recent Queries Table */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Recent Queries
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View History
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <DataTable
            data={tableData}
            columns={tableColumns}
            searchable
            searchPlaceholder="Search queries..."
            pageSize={5}
          />
        </section>

        {/* Additional Metrics */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Success Rate */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-600">
                Success Rate
              </h3>
              <TrendingUp className="w-5 h-5 text-accent-emerald-500" />
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-neutral-900">94.2%</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-accent-emerald-600">
                +2.3%
              </span>
              <span className="text-sm text-neutral-500">vs last month</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: '94.2%' }}></div>
            </div>
          </div>

          {/* Average Response Time */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-600">
                Avg Response Time
              </h3>
              <Activity className="w-5 h-5 text-secondary-500" />
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-neutral-900">2.4s</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-accent-emerald-600">
                -0.3s
              </span>
              <span className="text-sm text-neutral-500">faster</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-secondary" style={{ width: '76%' }}></div>
            </div>
          </div>

          {/* API Usage */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-600">
                API Usage
              </h3>
              <BarChart3 className="w-5 h-5 text-accent-cyan-500" />
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-neutral-900">67%</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-neutral-600">
                3,350 / 5,000 requests
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent-cyan-500" style={{ width: '67%' }}></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
