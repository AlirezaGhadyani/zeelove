import React from 'react';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'col' | 'row';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  children: React.ReactNode;
}

export function Stack({
  direction = 'col',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className = '',
  children,
  ...props
}: StackProps) {
  const dirClass = direction === 'row' ? 'flex flex-row' : 'flex flex-col';

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1.5',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }[gap];

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[align];

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }[justify];

  return (
    <div
      className={`${dirClass} ${gapClasses} ${alignClasses} ${justifyClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
