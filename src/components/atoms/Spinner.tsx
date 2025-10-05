import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-muted-500 border-t-primary-800 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}