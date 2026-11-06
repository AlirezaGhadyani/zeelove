import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  action,
  breadcrumbs,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 pb-6 border-b border-neutral-800 text-start', className)}>
      {breadcrumbs && <div>{breadcrumbs}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h1>
            {badge}
          </div>

          {description && (
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
