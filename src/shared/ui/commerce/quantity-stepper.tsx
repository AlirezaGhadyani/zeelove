'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { cn } from '@/shared/lib/utils';

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className = '',
  disabled = false,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-900/80 p-1',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="کاهش تعداد"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="w-9 text-center font-semibold text-xs text-white">
        {toPersianDigits(value)}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="افزایش تعداد"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
