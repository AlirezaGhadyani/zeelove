'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';

interface SaveBarProps {
  isDirty: boolean;
  onSave: () => void | Promise<void>;
  onReset: () => void;
  loading?: boolean;
  message?: string;
}

export function SaveBar({
  isDirty,
  onSave,
  onReset,
  loading = false,
  message = 'تغییرات ذخیره‌نشده‌ای دارید.',
}: SaveBarProps) {
  if (!isDirty) return null;

  return (
    <div className="fixed bottom-6 inset-x-6 z-50 max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl p-4 flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-sm font-medium text-foreground">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onReset} disabled={loading}>
          انصراف
        </Button>
        <Button size="sm" onClick={onSave} disabled={loading}>
          {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </div>
  );
}
