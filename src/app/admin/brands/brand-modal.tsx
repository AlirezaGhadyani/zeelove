'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { manageBrandAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import type { BrandItem } from './brands-client';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBrand: BrandItem | null;
}

export function BrandModal({ isOpen, onClose, editingBrand }: BrandModalProps) {
  const [name, setName] = useState(editingBrand?.name ?? '');
  const [slug, setSlug] = useState(editingBrand?.slug ?? '');
  const [description, setDescription] = useState(editingBrand?.description ?? '');
  const [websiteUrl, setWebsiteUrl] = useState(editingBrand?.websiteUrl ?? '');
  const [isActive, setIsActive] = useState(editingBrand?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        slug: slug || undefined,
        description: description || undefined,
        websiteUrl: websiteUrl || undefined,
        isActive,
      };

      const res = editingBrand
        ? await manageBrandAction('update', { id: editingBrand.id, ...payload })
        : await manageBrandAction('create', payload);

      if (!res.ok) {
        toast.error(res.error || 'خطا در ذخیره برند');
        return;
      }
      toast.success(editingBrand ? 'برند بروزرسانی شد' : 'برند جدید ایجاد شد');
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg">{editingBrand ? 'ویرایش برند' : 'افزودن برند جدید'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1">نام برند *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              placeholder="مثال: هاکوپیان"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">اسلاگ (شناسه انگلیسی یا فارسی)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-left"
              dir="ltr"
              placeholder="hacoupian"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">آدرس وب‌سایت (اختیاری)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm text-left"
              dir="ltr"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="brandModalActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-border text-amber-500"
            />
            <label htmlFor="brandModalActive" className="text-sm">برند فعال باشد</label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ذخیره برند'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
