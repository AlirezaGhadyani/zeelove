import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';

interface DataTablePaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export function DataTablePagination({
  page,
  perPage,
  total,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-muted-foreground border-t border-border/40">
      <div>
        نمایش {toPersianDigits(startItem)} تا {toPersianDigits(endItem)} از {toPersianDigits(total)}{' '}
        مورد
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          قبلی
        </Button>
        <span className="text-xs font-medium px-2">
          صفحه {toPersianDigits(page)} از {toPersianDigits(totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
