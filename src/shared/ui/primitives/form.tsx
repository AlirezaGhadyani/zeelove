import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Label } from './label';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function FormItem({
  label,
  error,
  description,
  required,
  className,
  children,
  ...props
}: FormItemProps) {
  return (
    <div className={cn('space-y-1.5 text-start', className)} {...props}>
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-[11px] text-neutral-400 leading-normal">{description}</p>
      )}
      {error && <p className="text-[11px] font-medium text-red-500 leading-normal">{error}</p>}
    </div>
  );
}
