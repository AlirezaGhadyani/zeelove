import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-10 text-center',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800/80 text-amber-400 mb-4 shadow-inner">
        {icon ?? <PackageOpen className="h-7 w-7" />}
      </div>

      <h3 className="text-base font-bold text-white mb-1">{title}</h3>

      {description && (
        <p className="max-w-sm text-xs text-neutral-400 mb-5 leading-relaxed">{description}</p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}
