'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Tag, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/primitives/card';
import { manageBrandAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { BrandModal } from './brand-modal';

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  isActive: boolean;
}

export function BrandsClient({ initialBrands }: { initialBrands: BrandItem[] }) {
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

  const openCreateModal = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BrandItem) => {
    setEditingBrand(b);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, bName: string) => {
    if (!confirm(`آیا از حذف برند "${bName}" اطمینان دارید؟`)) return;
    const res = await manageBrandAction('delete', id);
    if (!res.ok) {
      toast.error(res.error || 'خطا در حذف');
      return;
    }
    toast.success('برند حذف شد');
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت برندها</h2>
          <p className="text-sm text-muted-foreground">برندهای تولیدکننده و همکار در زیلاو</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          افزودن برند جدید
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            فهرست برندها ({toPersianDigits(brands.length)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {brands.map((b) => (
              <div key={b.id} className="border border-border/60 rounded-xl p-4 bg-card/60 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-base text-foreground">{b.name}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      /{b.slug}
                    </span>
                  </div>
                  {b.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{b.description}</p>
                  )}
                  {b.websiteUrl && (
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="truncate" dir="ltr">{b.websiteUrl}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className={`text-xs px-2 py-0.5 rounded ${b.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {b.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(b)}>
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id, b.name)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <BrandModal
        key={editingBrand?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBrand={editingBrand}
      />
    </div>
  );
}
