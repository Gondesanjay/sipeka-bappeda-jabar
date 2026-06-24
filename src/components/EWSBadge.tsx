import React from 'react';
import { EWSStatus } from '../data/mockData';

interface EWSBadgeProps {
  status: EWSStatus;
  variant?: 'solid' | 'soft';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  green: {
    label: 'AMAN',
    solid: 'bg-ews-green text-white',
    soft: 'bg-emerald-50/70 text-emerald-900 border border-emerald-200/50',
  },
  amber: {
    label: 'WASPADA',
    solid: 'bg-ews-amber text-white',
    soft: 'bg-amber-50/70 text-amber-900 border border-amber-200/50',
  },
  red: {
    label: 'KRITIS',
    solid: 'bg-ews-red text-white',
    soft: 'bg-rose-50/70 text-rose-900 border border-rose-200/50',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-badge tracking-wide',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const EWSBadge: React.FC<EWSBadgeProps> = ({
  status,
  variant = 'soft',
  size = 'md',
}) => {
  const config = statusConfig[status];
  const style = variant === 'solid' ? config.solid : config.soft;

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-md uppercase
        ${style} ${sizeConfig[size]} transition-colors duration-200`}
    >
      {config.label}
    </span>
  );
};
