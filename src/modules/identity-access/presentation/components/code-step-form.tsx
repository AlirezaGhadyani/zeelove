'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { OtpInput } from './otp-input';

interface CodeStepFormProps {
  code: string;
  onCodeChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  countdown: number;
  onResend: (e: React.FormEvent) => void;
  onBackToMobile: () => void;
}

export function CodeStepForm({
  code,
  onCodeChange,
  onSubmit,
  loading,
  countdown,
  onResend,
  onBackToMobile,
}: CodeStepFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <OtpInput value={code} onChange={onCodeChange} disabled={loading} />
      <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
        {loading ? 'در حال بررسی...' : 'تایید و ورود'}
      </Button>
      <div className="flex items-center justify-between text-sm pt-2 border-t border-border/40">
        <button
          type="button"
          onClick={onBackToMobile}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          تغییر شماره موبایل
        </button>
        {countdown > 0 ? (
          <span className="text-muted-foreground text-xs">
            ارسال مجدد تا {toPersianDigits(countdown)} ثانیه
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-primary hover:underline text-xs font-medium"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </form>
  );
}
