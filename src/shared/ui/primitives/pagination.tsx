import * as React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="صفحه‌بندی"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

export function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('', className)} {...props} />;
}

export function PaginationLink({
  isActive,
  children,
  ...props
}: { isActive?: boolean; children: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className="h-8 w-8 p-0 text-xs font-mono"
      {...props}
    >
      {children}
    </Button>
  );
}

export function PaginationPrevious({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="sm" className="gap-1 px-2.5 text-xs text-neutral-300" {...props}>
      <ChevronRight className="h-4 w-4" />
      <span>قبلی</span>
    </Button>
  );
}

export function PaginationNext({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="sm" className="gap-1 px-2.5 text-xs text-neutral-300" {...props}>
      <span>بعدی</span>
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
}
