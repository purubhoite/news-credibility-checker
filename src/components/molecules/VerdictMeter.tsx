import React from 'react';
import { VerdictType } from '../../types';

interface VerdictMeterProps {
  verdict: VerdictType;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const verdictColors = {
  'true': 'stroke-accent-green',
  'false': 'stroke-danger-red',
  'partial': 'stroke-warn-orange',
  'unverified': 'stroke-muted-500',
};

const sizeConfig = {
  sm: { radius: 20, strokeWidth: 3, fontSize: 'text-xs' },
  md: { radius: 30, strokeWidth: 4, fontSize: 'text-sm' },
  lg: { radius: 40, strokeWidth: 5, fontSize: 'text-base' },
};

export function VerdictMeter({ verdict, confidence, size = 'md', className = '' }: VerdictMeterProps) {
  const { radius, strokeWidth, fontSize } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;
  
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
          role="progressbar"
          aria-valuenow={confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${verdict} verdict with ${confidence}% confidence`}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${verdictColors[verdict]} transition-all duration-500 ease-in-out`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        
        {/* Confidence percentage */}
        <div className={`absolute inset-0 flex items-center justify-center ${fontSize} font-medium text-text-900`}>
          {confidence}%
        </div>
      </div>
    </div>
  );
}