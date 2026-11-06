import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-amber-500 text-neutral-950 hover:bg-amber-400',
        secondary: 'border-transparent bg-neutral-800 text-neutral-200 hover:bg-neutral-700',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-500',
        outline: 'text-neutral-300 border-neutral-700',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
