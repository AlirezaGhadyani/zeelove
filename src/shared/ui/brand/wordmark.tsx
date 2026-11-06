import React from 'react';

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Wordmark({ className = '', size = 'md' }: WordmarkProps) {
  const dimensions = {
    sm: { width: 100, height: 28 },
    md: { width: 140, height: 38 },
    lg: { width: 180, height: 48 },
  }[size];

  return (
    <svg
      viewBox="0 0 200 50"
      width={dimensions.width}
      height={dimensions.height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-label="زیلاو - zeelove"
    >
      <rect width="40" height="40" x="5" y="5" rx="10" fill="url(#zeelove-gradient)" />
      <path
        d="M25 15L33 25L25 35L17 25Z"
        fill="#09090b"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x="55"
        y="30"
        fill="currentColor"
        fontSize="22"
        fontWeight="800"
        fontFamily="var(--font-vazirmatn), sans-serif"
      >
        زیلاو
      </text>
      <text
        x="125"
        y="28"
        fill="#a1a1aa"
        fontSize="13"
        fontWeight="600"
        letterSpacing="0.08em"
        fontFamily="sans-serif"
      >
        zeelove
      </text>
      <defs>
        <linearGradient id="zeelove-gradient" x1="5" y1="5" x2="45" y2="45">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}
