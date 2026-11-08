'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/primitives/card';
import { manageAttributeAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { AttributeModal } from './attribute-modal';

export interface AttributeItem {
  id: string;
  name: string;
  code: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT';
  options?: string[];
}

export function AttributesClient({ initialAttributes }: { initialAttributes: AttributeItem[] }) {
  const [attributes, setAttributes] = useState<AttributeItem[]>(initialAttributes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<AttributeItem | null>(null);

  const openCreateModal = () => {
    setEditingAttr(null);
    setIsModalOpen(true);
  };

  const openEditModal = (attr: AttributeItem) => {
    setEditingAttr(attr);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, attrName: string) => {
    if (!confirm(`آیا از حذف ویژگی "${attrName}" اطمینان دارید؟`)) return;
    const res = await manageAttributeAction('delete', id);
    if (!res.ok) {
      toast.error(res.error || 'خطا در حذف');
      return;
    }
    toast.success('ویژگی حذف شد');
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت ویژگی‌های مشخصات کالا</h2>
          <p className="text-sm text-muted-foreground">مشخصات فنی و ویژگی‌های قابل انتساب به محصولات</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          افزودن ویژگی جدید
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            فهرست ویژگی‌ها ({toPersianDigits(attributes.length)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {attributes.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{a.name}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded" dir="ltr">
                      {a.code}
                    </span>
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono">
                      {a.type}
                    </span>
                  </div>
                  {a.options && a.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {a.options.map((opt, idx) => (
                        <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(a)}>
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id, a.name)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AttributeModal
        key={editingAttr?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAttr={editingAttr}
      />
    </div>
  );
}
