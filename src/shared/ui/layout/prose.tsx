import React from 'react';

interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Prose({ className = '', children, ...props }: ProseProps) {
  return (
    <div
      className={`prose prose-neutral dark:prose-invert max-w-none text-start leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
