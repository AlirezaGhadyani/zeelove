'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';

interface MobileStepFormProps {
  mobile: string;
  onMobileChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function MobileStepForm({ mobile, onMobileChange, onSubmit, loading }: MobileStepFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">شماره موبایل</label>
        <Input
          type="tel"
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          value={mobile}
          onChange={(e) => onMobileChange(e.target.value)}
          disabled={loading}
          autoFocus
          className="text-center text-lg tracking-wider"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !mobile}>
        {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
      </Button>
    </form>
  );
}
