'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/primitives/card';
import { manageCategoryAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { CategoryModal } from './category-modal';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  displayOrder: number;
  image?: string;
  isActive: boolean;
}

export function CategoriesClient({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | undefined>(undefined);

  const openCreateModal = (parent?: string) => {
    setEditingCat(null);
    setDefaultParentId(parent);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCat(cat);
    setDefaultParentId(cat.parentId ?? undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی "${catName}" اطمینان دارید؟`)) return;
    const res = await manageCategoryAction('delete', id);
    if (!res.ok) {
      toast.error(res.error || 'خطا در حذف');
      return;
    }
    toast.success('دسته‌بندی حذف شد');
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const next = [...categories];
    const temp = next[index]!;
    next[index] = next[targetIdx]!;
    next[targetIdx] = temp;

    const reordered = next.map((cat, i) => ({ ...cat, displayOrder: i }));
    setCategories(reordered);

    await manageCategoryAction(
      'reorder',
      reordered.map((c) => ({ id: c.id, displayOrder: c.displayOrder, parentId: c.parentId })),
    );
    toast.success('ترتیب دسته‌بندی‌ها ذخیره شد');
  };

  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-sm text-muted-foreground">ساختار درختی و ترتیب نمایش دسته‌ها در فروشگاه</p>
        </div>
        <Button onClick={() => openCreateModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          افزودن دسته‌بندی اصلی
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-500" />
            درخت دسته‌بندی‌ها ({toPersianDigits(categories.length)})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rootCategories.map((root, rootIdx) => {
            const children = categories.filter((c) => c.parentId === root.id);
            return (
              <div key={root.id} className="border border-border/60 rounded-lg p-3 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{root.name}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      /{root.slug}
                    </span>
                    {!root.isActive && (
                      <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded">غیرفعال</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleMoveOrder(rootIdx, 'up')} disabled={rootIdx === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMoveOrder(rootIdx, 'down')} disabled={rootIdx === rootCategories.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openCreateModal(root.id)} className="text-xs">
                      + زیردسته
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(root)}>
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(root.id, root.name)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="mr-6 border-r-2 border-border/80 pr-4 space-y-2 pt-1">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-2 rounded bg-muted/40 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{child.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">/{child.slug}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(child)}>
                            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(child.id, child.name)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <CategoryModal
        key={editingCat?.id ?? defaultParentId ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCat={editingCat}
        categories={categories}
        defaultParentId={defaultParentId}
      />
    </div>
  );
}
