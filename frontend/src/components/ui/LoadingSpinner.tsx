import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-2 py-6', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-neutral-200 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {label && <span className="text-xs text-neutral-500 font-medium">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}

