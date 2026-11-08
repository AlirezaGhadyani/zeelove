'use client';

import React, { useState } from 'react';
import { Search, FileSpreadsheet, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardContent } from '@/shared/ui/primitives/card';
import { bulkUpdateInventoryAction } from '@/modules/inventory/presentation/actions/inventory-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { formatToman } from '@/shared/lib/formatters/currency';
import { ProductCsvModal } from '../products/product-csv-modal';
import { AdjustStockModal } from './adjust-stock-modal';

export interface AdminInventoryItem {
  variantId: string;
  sku: string;
  productTitle: string;
  priceToman: number;
  stock: number;
  safetyStock: number;
  options?: Record<string, string>;
}

export function InventoryClient({ initialItems }: { initialItems: AdminInventoryItem[] }) {
  const [items, setItems] = useState<AdminInventoryItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<AdminInventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});

  const filtered = items.filter((item) => {
    if (lowStockOnly && item.stock > item.safetyStock) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return item.sku.toLowerCase().includes(q) || item.productTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveBulk = async () => {
    const changes = Object.entries(pendingChanges).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    }));
    if (changes.length === 0) return;

    setLoading(true);
    try {
      const res = await bulkUpdateInventoryAction({
        items: changes,
        reason: 'MANUAL',
        note: 'ویرایش دسته‌ای در پنل انبار',
      });
      if (!res.ok) {
        toast.error('خطا در ذخیره دسته‌ای');
        return;
      }
      toast.success(`${res.updatedCount} مورد با موفقیت ذخیره شد`);
      setPendingChanges({});
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت موجودی انبار</h2>
          <p className="text-sm text-muted-foreground">کنترل نقطه سفارش، موجودی فیزیکی و ثبت سندهای تعدیل انبار</p>
        </div>
        <div className="flex items-center gap-2">
          {hasPendingChanges && (
            <Button onClick={handleSaveBulk} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2">
              <Check className="w-4 h-4" />
              ذخیره تغییرات دسته‌ای ({toPersianDigits(Object.keys(pendingChanges).length)})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsCsvModalOpen(true)} className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            اکسپورت / ایمپورت CSV
          </Button>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو با عنوان محصول یا کد SKU..."
                className="w-full pr-9 pl-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span>فقط کالاهای کم‌موجود / ناموجود</span>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-border/60 text-xs text-muted-foreground pb-2">
                  <th className="pb-2">محصول و مشخصات</th>
                  <th className="pb-2">کد SKU</th>
                  <th className="pb-2">قیمت (تومان)</th>
                  <th className="pb-2">موجودی فعلی</th>
                  <th className="pb-2">حداقل ایمنی</th>
                  <th className="pb-2 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((item) => {
                  const currentVal = pendingChanges[item.variantId] !== undefined
                    ? pendingChanges[item.variantId]!
                    : item.stock;

                  return (
                    <tr key={item.variantId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <span className="font-bold block text-foreground">{item.productTitle}</span>
                        {item.options && (
                          <span className="text-xs text-muted-foreground">
                            {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-xs">{item.sku}</td>
                      <td className="py-3 text-xs">{formatToman(item.priceToman)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 max-w-[120px]">
                          <input
                            type="number"
                            min={0}
                            value={currentVal}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setPendingChanges((prev) => ({ ...prev, [item.variantId]: val }));
                            }}
                            className={`w-16 px-2 py-1 text-xs border rounded bg-background ${
                              pendingChanges[item.variantId] !== undefined ? 'border-amber-500 font-bold' : 'border-border'
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">عدد</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs font-mono">{toPersianDigits(item.safetyStock)}</td>
                      <td className="py-3 text-left">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdjustingItem(item)}
                          className="text-xs"
                        >
                          ثبت سند تعدیل
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AdjustStockModal
        item={adjustingItem}
        onClose={() => setAdjustingItem(null)}
        onSuccess={(variantId, newQuantity) => {
          setItems((prev) =>
            prev.map((i) => (i.variantId === variantId ? { ...i, stock: newQuantity } : i)),
          );
        }}
      />

      <ProductCsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />
    </div>
  );
}
