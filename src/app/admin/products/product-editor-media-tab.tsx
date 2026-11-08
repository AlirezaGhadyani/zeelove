'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import type { AttributeItem } from '../attributes/attributes-client';
import type { ProductImageData } from './product-editor-modal';

export function ImagesTab({
  images, setImages, title,
}: {
  images: ProductImageData[];
  setImages: React.Dispatch<React.SetStateAction<ProductImageData[]>>;
  title: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">تصاویر محصول</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const idx = images.length + 1;
            setImages((prev) => [
              ...prev,
              {
                url: `/assets/placeholder-product-${(idx % 4) + 1}.svg`,
                altText: title || 'تصویر محصول',
                displayOrder: idx,
                isMain: false,
              },
            ]);
          }}
        >
          + افزودن تصویر جدید
        </Button>
      </div>
      <div className="space-y-3">
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border border-border/60 rounded-lg bg-muted/20">
            <div className="w-12 h-12 rounded bg-muted border border-border flex items-center justify-center text-xs font-mono overflow-hidden">
              <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={img.url}
                onChange={(e) => {
                  const val = e.target.value;
                  setImages((prev) => {
                    const c = [...prev];
                    c[i]!.url = val;
                    return c;
                  });
                }}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-background font-mono"
                placeholder="آدرس تصویر (URL)"
              />
              <input
                type="text"
                value={img.altText || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setImages((prev) => {
                    const c = [...prev];
                    c[i]!.altText = val;
                    return c;
                  });
                }}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                placeholder="متن جایگزین (Alt text)"
              />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="mainImage"
                  checked={img.isMain ?? i === 0}
                  onChange={() => {
                    setImages((prev) => prev.map((item, idx) => ({ ...item, isMain: idx === i })));
                  }}
                />
                <span>اصلی</span>
              </label>
              {images.length > 1 && (
                <button
                  type="button"
                  className="text-[10px] text-red-500 hover:underline"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttributesTab({
  attributes, attrValues, setAttrValues,
}: {
  attributes: AttributeItem[];
  attrValues: Record<string, string>;
  setAttrValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">مقادیر مشخصات فنی را برای این کالا تعیین کنید</p>
      {attributes.map((attr) => (
        <div key={attr.id} className="grid grid-cols-3 gap-3 items-center">
          <span className="text-xs font-semibold text-foreground">{attr.name}</span>
          <div className="col-span-2">
            {attr.type === 'SELECT' && attr.options && attr.options.length > 0 ? (
              <select
                value={attrValues[attr.id] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAttrValues((prev) => ({ ...prev, [attr.id]: val }));
                }}
                className="w-full px-3 py-1.5 border border-border rounded-lg bg-background text-xs"
              >
                <option value="">انتخاب کنید...</option>
                {attr.options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={attr.type === 'NUMBER' ? 'number' : 'text'}
                value={attrValues[attr.id] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAttrValues((prev) => ({ ...prev, [attr.id]: val }));
                }}
                className="w-full px-3 py-1.5 border border-border rounded-lg bg-background text-xs"
                placeholder={`مقدار ${attr.name}`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeoTab({
  metaTitle, setMetaTitle,
  metaDescription, setMetaDescription,
  title,
}: {
  metaTitle: string; setMetaTitle: (v: string) => void;
  metaDescription: string; setMetaDescription: (v: string) => void;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold block mb-1">عنوان سئو (Meta Title)</label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          placeholder={title || 'عنوان صفحه در موتورهای جستجو'}
        />
      </div>
      <div>
        <label className="text-xs font-semibold block mb-1">توضیحات سئو (Meta Description)</label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          placeholder="توضیحات جذاب برای نمایش در گوگل (حدود ۱۶۰ کاراکتر)"
        />
      </div>
    </div>
  );
}
