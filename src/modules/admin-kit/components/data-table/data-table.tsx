'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/ui/primitives/table';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  selectedIds?: string[];
  onSelectIds?: (ids: string[]) => void;
  bulkActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
  loading?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  total,
  page,
  perPage,
  onPageChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  selectedIds = [],
  onSelectIds,
  bulkActions,
  extraActions,
  rowActions,
  loading = false,
}: DataTableProps<T>) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleSelectAll = () => {
    if (!onSelectIds) return;
    onSelectIds(isAllSelected ? [] : data.map((d) => d.id));
  };

  const toggleSelectRow = (id: string) => {
    if (!onSelectIds) return;
    onSelectIds(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    );
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
        extraActions={extraActions}
      />

      <div className="rounded-lg border border-border/70 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectIds && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="انتخاب همه"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
              {rowActions && <TableHead className="w-16">عملیات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onSelectIds ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  در حال بارگذاری اطلاعات...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onSelectIds ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  هیچ موردی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {onSelectIds && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onCheckedChange={() => toggleSelectRow(row.id)}
                        aria-label={`انتخاب سطر ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                  {rowActions && <TableCell>{rowActions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
