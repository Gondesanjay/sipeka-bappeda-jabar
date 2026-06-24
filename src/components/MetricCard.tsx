import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'danger' | 'warning' | 'success';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'text-primary',
    danger: 'text-rose-700',
    warning: 'text-amber-700',
    success: 'text-emerald-700',
  };

  const bgStyles = {
    default: 'bg-primary-container',
    danger: 'bg-rose-50',
    warning: 'bg-amber-50',
    success: 'bg-emerald-50',
  };

  const iconStyles = {
    default: 'text-primary',
    danger: 'text-rose-700',
    warning: 'text-amber-700',
    success: 'text-emerald-700',
  };

  const trendStyles = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-slate-500',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 shadow-card border border-slate-100
        transition-all duration-200 hover:shadow-pop hover:border-slate-200
        ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${bgStyles[variant]} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconStyles[variant]}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trendStyles[trend.direction]}`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-label text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-display tabular-nums mt-1 ${variantStyles[variant]}`}>
          {value}
        </p>
        {subtext && (
          <p className="text-body text-slate-500 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};
