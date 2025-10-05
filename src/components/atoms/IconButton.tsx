import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'aria-label': string;
}

const variantClasses = {
  primary: 'bg-primary-800 text-surface hover:bg-primary-800/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary-800',
  secondary: 'bg-bg-100 text-text-900 hover:bg-muted/80 focus:ring-2 focus:ring-offset-2 focus:ring-primary-800',
  ghost: 'text-muted-500 hover:text-text-900 hover:bg-bg-100 focus:ring-2 focus:ring-offset-2 focus:ring-primary-800',
};

const sizeClasses = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};

export function IconButton({ 
  variant = 'ghost', 
  size = 'md', 
  children, 
  className = '', 
  disabled,
  ...props 
}: IconButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md transition-colors focus:outline-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}