'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { adjustInventoryAction } from '@/modules/inventory/presentation/actions/inventory-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import type { AdminInventoryItem } from './inventory-client';

interface AdjustStockModalProps {
  item: AdminInventoryItem | null;
  onClose: () => void;
  onSuccess: (variantId: string, newQuantity: number) => void;
}

export function AdjustStockModal({ item, onClose, onSuccess }: AdjustStockModalProps) {
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>('RECEIPT');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adjustInventoryAction({
        variantId: item.variantId,
        deltaQuantity: delta,
        reason,
        note: note || undefined,
      });

      if (!res.ok) {
        toast.error(res.error || 'خطا در ثبت تعدیل موجودی');
        return;
      }

      const newQty = res.quantity ?? Math.max(0, item.stock + delta);
      toast.success(`موجودی جدید: ${toPersianDigits(newQty)} عدد`);
      onSuccess(item.variantId, newQty);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg text-foreground">ثبت سند تعدیل انبار</h3>
        <p className="text-xs text-muted-foreground">
          {item.productTitle} ({item.sku})
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1">نوع و جهت تغییر تعداد *</label>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-center"
              placeholder="مثال: +10 یا -2"
            />
            <span className="text-[11px] text-muted-foreground block mt-1">
              موجودی فعلی: {toPersianDigits(item.stock)} عدد | موجودی پس از ثبت:{' '}
              {toPersianDigits(Math.max(0, item.stock + delta))} عدد
            </span>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">علت تعدیل موجودی *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
            >
              <option value="RECEIPT">ورود کالا به انبار (رسید خرید)</option>
              <option value="CORRECTION">اصلاح شمارش / انبارگردانی</option>
              <option value="DAMAGE">ضایعات، خرابی یا مفقودی</option>
              <option value="MANUAL">سایر دلایل دستی</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">یادداشت سند</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              placeholder="شماره فاکتور یا توضیحات انباردار..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading || delta === 0}>
              {loading ? 'در حال ثبت...' : 'ثبت سند'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
