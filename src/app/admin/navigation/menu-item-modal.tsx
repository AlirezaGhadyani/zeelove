'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import {
  createMenuItemAction,
  updateMenuItemAction,
} from '@/modules/content/presentation/actions/navigation-actions';

export interface AdminMenuItemData {
  id: string;
  menuId: string;
  parentId?: string | null;
  title: string;
  url: string;
  target?: string;
  displayOrder: number;
  isActive: boolean;
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
  editingItem: AdminMenuItemData | null;
  allItems: AdminMenuItemData[];
  defaultParentId?: string | null;
}

export function MenuItemModal({
  isOpen,
  onClose,
  menuId,
  editingItem,
  allItems,
  defaultParentId,
}: MenuItemModalProps) {
  const [title, setTitle] = useState(editingItem?.title ?? '');
  const [url, setUrl] = useState(editingItem?.url ?? '');
  const [parentId, setParentId] = useState<string>(editingItem?.parentId ?? defaultParentId ?? '');
  const [target, setTarget] = useState(editingItem?.target ?? '_self');
  const [isActive, setIsActive] = useState(editingItem?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('عنوان و آدرس لینک الزامی هستند');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        parentId: parentId || null,
        title,
        url,
        target,
        isActive,
      };

      const res = editingItem
        ? await updateMenuItemAction({ id: editingItem.id, ...payload })
        : await createMenuItemAction({ menuId, ...payload, displayOrder: allItems.length });

      if (!res.ok) {
        toast.error(res.error || 'خطا در ذخیره آیتم منو');
        return;
      }

      toast.success(editingItem ? 'آیتم منو بروزرسانی شد' : 'آیتم منوی جدید ایجاد شد');
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg text-foreground">
          {editingItem ? 'ویرایش آیتم منو' : 'افزودن آیتم جدید به منو'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1">عنوان نمایش *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              placeholder="مثال: پوشاک مردانه"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold">آدرس لینک مقصد (URL) *</label>
              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setUrl('/category/')}
                  className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                >
                  دسته‌بندی
                </button>
                <button
                  type="button"
                  onClick={() => setUrl('/page/')}
                  className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                >
                  صفحه
                </button>
                <button
                  type="button"
                  onClick={() => setUrl('/products/')}
                  className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                >
                  محصول
                </button>
              </div>
            </div>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-left"
              dir="ltr"
              placeholder="/category/men یا /products یا /page/about"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">آیتم والد (برای زیرمنوهای درختی)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
            >
              <option value="">بدون والد (سطح اصلی)</option>
              {allItems
                .filter((i) => !editingItem || i.id !== editingItem.id)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-xs font-semibold block mb-1">هدف باز شدن</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="_self">همان پنجره (_self)</option>
                <option value="_blank">پنجره جدید (_blank)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="menuActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border text-amber-500"
              />
              <label htmlFor="menuActive" className="text-sm">فعال باشد</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ذخیره آیتم'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
