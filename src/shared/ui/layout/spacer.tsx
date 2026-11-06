import React from 'react';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Spacer({ size = 'md' }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-24 w-24',
  }[size];

  return <div aria-hidden="true" className={sizeClasses} />;
}
