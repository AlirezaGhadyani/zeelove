'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { toast } from 'sonner';
import { Download, Upload } from 'lucide-react';
import {
  exportInventoryCsvAction,
  importInventoryCsvAction,
} from '@/modules/inventory/presentation/actions/inventory-actions';

export function ProductCsvModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [csvContent, setCsvContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportInventoryCsvAction();
      if (!res.ok || !res.csv) {
        toast.error('خطا در دریافت خروجی CSV');
        return;
      }
      const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `zeelove-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('فایل CSV با موفقیت دانلود شد');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!csvContent.trim()) {
      toast.error('لطفاً محتوای CSV را وارد کنید');
      return;
    }
    setLoading(true);
    try {
      const res = await importInventoryCsvAction(csvContent);
      if (!res.ok) {
        toast.error(res.error || 'خطا در ایمپورت');
        return;
      }
      toast.success(`${res.importedCount} تنوع با موفقیت بروزرسانی شد`);
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <h3 className="font-bold text-lg text-foreground">ایمپورت / اکسپورت داده‌های کالا و موجودی (CSV)</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>بستن</Button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-3 bg-muted/40 rounded-lg space-y-2">
            <h4 className="font-semibold text-xs flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-500" />
              دانلود خروجی CSV قیمت و موجودی
            </h4>
            <p className="text-xs text-muted-foreground">
              فایل CSV شامل شناسه‌ها، SKU، قیمت و موجودی انبار تمام تنوع‌ها جهت ویرایش سریع در اکسل.
            </p>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
              دانلود فایل CSV
            </Button>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <h4 className="font-semibold text-xs flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-500" />
              ایمپورت و بروزرسانی دسته‌ای قیمت و موجودی
            </h4>
            <p className="text-xs text-muted-foreground">
              محتوای فایل CSV اصلاح‌شده را در کادر زیر جای‌گذاری نمایید یا فایل را انتخاب کنید:
            </p>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={5}
              placeholder="variantId,productTitle,sku,priceToman,stock,safetyStock&#10;..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs font-mono"
              dir="ltr"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" onClick={onClose}>انصراف</Button>
            <Button onClick={handleImport} disabled={loading || !csvContent.trim()}>
              {loading ? 'در حال اعمال...' : 'اعمال بروزرسانی دسته‌ای'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
