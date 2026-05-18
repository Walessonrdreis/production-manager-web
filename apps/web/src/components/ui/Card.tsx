import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Card({ className, title, description, children, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm', className)}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800">
          {title && (
            <h3 className="text-xl font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100 dark:text-white">
              {title}
            </h3>
          )}
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div className={cn('p-6 pt-0', !title && !description && 'pt-6')}>{children}</div>
    </div>
  );
}
