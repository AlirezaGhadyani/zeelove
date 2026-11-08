'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { manageAttributeAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import type { AttributeItem } from './attributes-client';

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttr: AttributeItem | null;
}

export function AttributeModal({ isOpen, onClose, editingAttr }: AttributeModalProps) {
  const [name, setName] = useState(editingAttr?.name ?? '');
  const [code, setCode] = useState(editingAttr?.code ?? '');
  const [type, setType] = useState<'TEXT' | 'NUMBER' | 'SELECT'>(editingAttr?.type ?? 'TEXT');
  const [optionsStr, setOptionsStr] = useState(editingAttr?.options ? editingAttr.options.join(', ') : '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const options = type === 'SELECT'
        ? optionsStr.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

      const payload = { name, code, type, options };
      const res = editingAttr
        ? await manageAttributeAction('update', { id: editingAttr.id, ...payload })
        : await manageAttributeAction('create', payload);

      if (!res.ok) {
        toast.error(res.error || 'خطا در ذخیره ویژگی');
        return;
      }
      toast.success(editingAttr ? 'ویژگی بروزرسانی شد' : 'ویژگی جدید ایجاد شد');
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg">{editingAttr ? 'ویرایش ویژگی' : 'افزودن ویژگی جدید'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1">نام ویژگی *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              placeholder="مثال: جنس پارچه"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">کد سیستمی ویژگی *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-left"
              dir="ltr"
              placeholder="material"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">نوع مقدار</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'TEXT' | 'NUMBER' | 'SELECT')}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
            >
              <option value="TEXT">متنی آزاد (Text)</option>
              <option value="NUMBER">عددی (Number)</option>
              <option value="SELECT">انتخابی از لیست (Select)</option>
            </select>
          </div>
          {type === 'SELECT' && (
            <div>
              <label className="text-xs font-semibold block mb-1">گزینه‌های مجاز (جدا شده با کاما)</label>
              <input
                type="text"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                placeholder="نخ پنبه, کتان, چرم طبیعی, پلی‌استر"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ذخیره ویژگی'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
