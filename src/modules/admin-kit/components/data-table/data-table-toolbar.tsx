'use client';

import React from 'react';
import { Input } from '@/shared/ui/primitives/input';
import { Button } from '@/shared/ui/primitives/button';

interface DataTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  extraActions?: React.ReactNode;
}

export function DataTableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'جستجو...',
  selectedCount = 0,
  bulkActions,
  extraActions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="h-9 px-2 text-xs"
          >
            پاک کردن
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end">
        {selectedCount > 0 && bulkActions}
        {extraActions}
      </div>
    </div>
  );
}
