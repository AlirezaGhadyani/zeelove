'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { manageCategoryAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import type { CategoryItem } from './categories-client';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCat: CategoryItem | null;
  categories: CategoryItem[];
  defaultParentId?: string;
}

export function CategoryModal({ isOpen, onClose, editingCat, categories, defaultParentId }: CategoryModalProps) {
  const [name, setName] = useState(editingCat?.name ?? '');
  const [slug, setSlug] = useState(editingCat?.slug ?? '');
  const [description, setDescription] = useState(editingCat?.description ?? '');
  const [parentId, setParentId] = useState<string>(editingCat?.parentId ?? defaultParentId ?? '');
  const [isActive, setIsActive] = useState(editingCat?.isActive ?? true);
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
        parentId: parentId || null,
        displayOrder: editingCat?.displayOrder ?? categories.length,
        isActive,
      };

      const res = editingCat
        ? await manageCategoryAction('update', { id: editingCat.id, ...payload })
        : await manageCategoryAction('create', payload);

      if (!res.ok) {
        toast.error(res.error || 'خطا در ذخیره دسته‌بندی');
        return;
      }
      toast.success(editingCat ? 'دسته‌بندی بروزرسانی شد' : 'دسته‌بندی جدید ایجاد شد');
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg">{editingCat ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1">نام دسته‌بندی *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              placeholder="مثال: پیراهن و شومیز"
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
              placeholder="women-shirts"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">دسته والد (اختیاری)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
            >
              <option value="">بدون والد (دسته اصلی)</option>
              {categories
                .filter((c) => !editingCat || c.id !== editingCat.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
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
              id="catIsActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-border text-amber-500"
            />
            <label htmlFor="catIsActive" className="text-sm">دسته‌بندی فعال باشد</label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ذخیره دسته‌بندی'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
