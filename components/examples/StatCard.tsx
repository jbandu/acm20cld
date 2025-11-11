/**
 * StatCard Component
 *
 * Amplitude-inspired analytics stat card with:
 * - Large prominent value
 * - Icon in purple/blue
 * - Change indicator with trend
 * - Hover effect with shadow lift
 * - Optional sparkline chart
 */

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'cyan' | 'pink' | 'emerald' | 'amber';
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  trend = 'neutral',
  color = 'primary',
  loading = false,
  className = '',
}: StatCardProps) {
  // Color mapping
  const colorClasses = {
    primary: {
      icon: 'text-primary-500',
      iconBg: 'bg-primary-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
    secondary: {
      icon: 'text-secondary-500',
      iconBg: 'bg-secondary-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
    cyan: {
      icon: 'text-accent-cyan-500',
      iconBg: 'bg-accent-cyan-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
    pink: {
      icon: 'text-accent-pink-500',
      iconBg: 'bg-accent-pink-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
    emerald: {
      icon: 'text-accent-emerald-500',
      iconBg: 'bg-accent-emerald-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
    amber: {
      icon: 'text-accent-amber-500',
      iconBg: 'bg-accent-amber-100',
      trend: trend === 'up' ? 'text-accent-emerald-600' : 'text-accent-red-600',
    },
  };

  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-10 w-10 bg-neutral-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-neutral-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white
        border border-neutral-200
        rounded-lg
        p-6
        shadow-sm
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all
        duration-normal
        ${className}
      `}
    >
      {/* Header - Title and Icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
        <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-1">
          {trend === 'up' && (
            <TrendingUp className="w-4 h-4 text-accent-emerald-600" />
          )}
          {trend === 'down' && (
            <TrendingDown className="w-4 h-4 text-accent-red-600" />
          )}
          <span className={`text-sm font-medium ${colors.trend}`}>
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          <span className="text-sm text-neutral-500 ml-1">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

/**
 * StatCardGrid Component
 *
 * Responsive grid layout for stat cards
 */
export interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatCardGrid({
  children,
  columns = 4,
  className = '',
}: StatCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * StatCardSkeleton Component
 *
 * Loading skeleton for StatCard
 */
export function StatCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-neutral-200 rounded-lg p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-10 w-10 bg-neutral-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-neutral-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

export default StatCard;
