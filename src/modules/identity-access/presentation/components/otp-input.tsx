'use client';

import React, { useRef } from 'react';
import { parsePersianDigits } from '@/shared/lib/formatters/persian-digits';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, char: string) => {
    const parsed = parsePersianDigits(char).replace(/\D/g, '');
    if (!parsed) return;

    const nextDigits = [...digits];
    nextDigits[index] = parsed[parsed.length - 1] ?? '';
    const nextVal = nextDigits.join('').slice(0, 6);
    onChange(nextVal);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        onChange(nextDigits.join(''));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = parsePersianDigits(e.clipboardData.getData('text')).replace(/\D/g, '');
    if (pasted.length > 0) {
      const code = pasted.slice(0, 6);
      onChange(code);
      const focusIndex = Math.min(code.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="h-12 w-11 rounded-lg border border-border bg-card text-center text-xl font-bold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          aria-label={`رقم ${idx + 1}`}
        />
      ))}
    </div>
  );
}
