import React from 'react';
import { VerdictType } from '../../types';

interface VerdictBadgeProps {
  verdict: VerdictType;
  className?: string;
}

const verdictConfig = {
  'true': {
    label: 'TRUE',
    className: 'bg-accent-green/10 text-accent-green border border-accent-green/20',
  },
  'false': {
    label: 'FALSE',
    className: 'bg-danger-red/10 text-danger-red border border-danger-red/20',
  },
  'partial': {
    label: 'PARTIAL',
    className: 'bg-warn-orange/10 text-warn-orange border border-warn-orange/20',
  },
  'unverified': {
    label: 'UNVERIFIED',
    className: 'bg-muted-500/10 text-muted-500 border border-muted-500/20',
  },
};

export function VerdictBadge({ verdict, className = '' }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-sm font-medium uppercase tracking-wide ${config.className} ${className}`}
      role="status"
      aria-label={`Verdict: ${config.label}`}
    >
      {config.label}
    </span>
  );
}