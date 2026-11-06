import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function Breadcrumb({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="مسیر راهنما" className={cn('text-sm', className)} {...props} />;
}

export function BreadcrumbList({ className, ...props }: React.ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-xs text-neutral-400',
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

export function BreadcrumbLink({ className, href, ...props }: React.ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href={href}
      className={cn('transition-colors hover:text-amber-400 text-neutral-400', className)}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span aria-current="page" className={cn('font-semibold text-white', className)} {...props} />
  );
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5 opacity-60', className)}
      {...props}
    >
      {children ?? <ChevronLeft className="rtl:rotate-0 rotate-180" />}
    </li>
  );
}
