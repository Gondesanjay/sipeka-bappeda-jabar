import React from 'react';
import { EWSStatus } from '../data/mockData';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: EWSStatus;
}

const statusColors = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
};

const sizeConfig = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
};

const getEWSStatus = (value: number): EWSStatus => {
  if (value >= 80) return 'green';
  if (value >= 30) return 'amber';
  return 'red';
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  status,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const effectiveStatus = status || getEWSStatus(value);

  const glowColor = {
    green: 'shadow-[0_0_8px_rgba(16,185,129,0.35)]',
    amber: 'shadow-[0_0_8px_rgba(245,158,11,0.35)]',
    red: 'shadow-[0_0_8px_rgba(239,68,68,0.35)]',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 bg-slate-100/80 rounded-full overflow-hidden ${sizeConfig[size]}`}>
        <div
          className={`h-full rounded-full ${statusColors[effectiveStatus]} ${glowColor[effectiveStatus]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold tabular-nums text-slate-700 min-w-[3rem] text-right">
          {value.toFixed(0)}%
        </span>
      )}
    </div>
  );
};
