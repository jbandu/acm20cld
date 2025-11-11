/**
 * ChartCard Component
 *
 * Amplitude-inspired card wrapper for charts with:
 * - Title and subtitle
 * - Optional action buttons
 * - Chart container with proper spacing
 * - Loading states
 * - Responsive design
 */

import React from 'react';
import { LucideIcon, MoreVertical } from 'lucide-react';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  icon: Icon,
  loading = false,
  className = '',
  height = 'md',
}: ChartCardProps) {
  const heights = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
  };

  if (loading) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-6 bg-neutral-200 rounded w-40 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-32"></div>
            </div>
            <div className="h-8 w-8 bg-neutral-200 rounded"></div>
          </div>
          {/* Chart skeleton */}
          <div className={`${heights[height]} bg-neutral-100 rounded-lg shimmer`}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white
        border border-neutral-200
        rounded-xl
        p-6
        shadow-sm
        hover:shadow-md
        transition-shadow
        duration-normal
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary-100">
              <Icon className="w-5 h-5 text-primary-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action */}
        {action ? (
          action
        ) : (
          <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Chart Content */}
      <div className={heights[height]}>{children}</div>
    </div>
  );
}

/**
 * ChartCardGrid Component
 *
 * Responsive grid layout for chart cards
 */
export interface ChartCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function ChartCardGrid({
  children,
  columns = 2,
  className = '',
}: ChartCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * ChartCardSkeleton Component
 *
 * Loading skeleton for ChartCard
 */
export function ChartCardSkeleton({
  height = 'md',
  className = '',
}: {
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const heights = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
  };

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-neutral-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div className="h-8 w-8 bg-neutral-200 rounded"></div>
        </div>
        <div className={`${heights[height]} bg-neutral-100 rounded-lg shimmer`}></div>
      </div>
    </div>
  );
}

/**
 * Example Chart Placeholder
 *
 * Use this while waiting for real chart data
 */
export function ChartPlaceholder({ message = 'Chart will render here' }: { message?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
      <div className="text-center">
        <p className="text-sm text-neutral-500">{message}</p>
      </div>
    </div>
  );
}

export default ChartCard;
