import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Section({ spacing = 'md', className = '', children, ...props }: SectionProps) {
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-6 sm:py-8',
    md: 'py-10 sm:py-14',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-28',
  }[spacing];

  return (
    <section className={`w-full ${spacingClasses} ${className}`} {...props}>
      {children}
    </section>
  );
}
