import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isShimmer?: boolean;
}

export function Skeleton({ className, isShimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded",
        className
      )}
      {...props}
    >
      {isShimmer && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
      )}
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  );
}
