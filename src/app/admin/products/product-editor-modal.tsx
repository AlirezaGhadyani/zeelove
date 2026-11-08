'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { toast } from 'sonner';
import { createProductAction, updateProductAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import type { CategoryItem } from '../categories/categories-client';
import type { BrandItem } from '../brands/brands-client';
import type { AttributeItem } from '../attributes/attributes-client';
import { GeneralTab, PricingTab } from './product-editor-tabs';
import { VariantsTab } from './product-editor-variants-tab';
import { ImagesTab, AttributesTab, SeoTab } from './product-editor-media-tab';

export interface ProductVariantData {
  id?: string;
  sku: string;
  priceToman: number;
  compareAtPriceToman?: number;
  isDefault?: boolean;
  options?: Record<string, string>;
  initialStock?: number;
}

export interface ProductImageData {
  id?: string;
  url: string;
  altText?: string;
  isMain?: boolean;
  displayOrder?: number;
}

export interface ProductFormData {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  categoryId?: string | null;
  brandId?: string | null;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; keywords?: string[] };
  variants: ProductVariantData[];
  images: ProductImageData[];
  attributes: Array<{ attributeId: string; value: string }>;
}

export function ProductEditorModal({
  isOpen,
  onClose,
  initialData,
  categories,
  brands,
  attributes,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductFormData | null;
  categories: CategoryItem[];
  brands: BrandItem[];
  attributes: AttributeItem[];
}) {
  const [tab, setTab] = useState<'general' | 'pricing' | 'variants' | 'images' | 'attributes' | 'seo'>('general');
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'ARCHIVED'>(initialData?.status || 'DRAFT');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [brandId, setBrandId] = useState(initialData?.brandId || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [variants, setVariants] = useState<ProductVariantData[]>(
    initialData?.variants && initialData.variants.length > 0
      ? initialData.variants
      : [{ sku: `SKU-${Date.now().toString().slice(-6)}`, priceToman: 250000, initialStock: 10, isDefault: true }],
  );

  const [images, setImages] = useState<ProductImageData[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [{ url: '/assets/placeholder-product.svg', isMain: true, displayOrder: 0, altText: 'تصویر محصول' }],
  );

  const [attrValues, setAttrValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    initialData?.attributes?.forEach((a) => {
      init[a.attributeId] = a.value;
    });
    return init;
  });

  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('عنوان محصول الزامی است');
      return;
    }
    if (variants.length === 0) {
      toast.error('حداقل یک تنوع با قیمت الزامی است');
      return;
    }

    setLoading(true);
    try {
      const formattedAttrs = Object.entries(attrValues)
        .filter(([, v]) => v.trim().length > 0)
        .map(([attributeId, value]) => ({ attributeId, value }));

      const payload = {
        title,
        slug: slug.trim() || undefined,
        status,
        categoryId: categoryId || null,
        brandId: brandId || null,
        shortDescription: shortDescription || undefined,
        description: description || undefined,
        seo: { metaTitle: metaTitle || undefined, metaDescription: metaDescription || undefined },
        variants,
        images,
        attributes: formattedAttrs,
      };

      const res = initialData?.id
        ? await updateProductAction({ id: initialData.id, ...payload })
        : await createProductAction(payload);

      if (!res.ok) {
        toast.error(res.error || 'خطا در ثبت محصول');
        return;
      }

      toast.success(initialData?.id ? 'محصول با موفقیت بروزرسانی شد' : 'محصول جدید با موفقیت ایجاد شد');
      onClose();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'general', label: 'اطلاعات پایه' },
    { key: 'pricing', label: 'قیمت‌گذاری' },
    { key: 'variants', label: 'تنوع‌ها (سایز و رنگ)' },
    { key: 'images', label: 'تصاویر' },
    { key: 'attributes', label: 'مشخصات فنی' },
    { key: 'seo', label: 'سئو' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] rounded-xl p-6 shadow-2xl flex flex-col space-y-4">
        <h3 className="font-bold text-lg text-foreground">
          {initialData?.id ? 'ویرایش اطلاعات کالا' : 'افزودن کالای جدید'}
        </h3>

        <div className="flex border-b border-border/60 overflow-x-auto gap-2 text-xs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`pb-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                tab === t.key ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {tab === 'general' && (
            <GeneralTab
              title={title} setTitle={setTitle}
              slug={slug} setSlug={setSlug}
              status={status} setStatus={setStatus}
              categoryId={categoryId} setCategoryId={setCategoryId}
              brandId={brandId} setBrandId={setBrandId}
              shortDescription={shortDescription} setShortDescription={setShortDescription}
              description={description} setDescription={setDescription}
              categories={categories} brands={brands}
            />
          )}

          {tab === 'pricing' && <PricingTab variants={variants} setVariants={setVariants} />}
          {tab === 'variants' && <VariantsTab variants={variants} setVariants={setVariants} />}
          {tab === 'images' && <ImagesTab images={images} setImages={setImages} title={title} />}
          {tab === 'attributes' && <AttributesTab attributes={attributes} attrValues={attrValues} setAttrValues={setAttrValues} />}
          {tab === 'seo' && <SeoTab metaTitle={metaTitle} setMetaTitle={setMetaTitle} metaDescription={metaDescription} setMetaDescription={setMetaDescription} title={title} />}

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ذخیره محصول'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
