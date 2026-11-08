'use client';

import React, { useState } from 'react';
import { Plus, Search, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardContent } from '@/shared/ui/primitives/card';
import { deleteProductAction } from '@/modules/catalog/presentation/actions/catalog-actions';
import { ProductEditorModal, type ProductFormData } from './product-editor-modal';
import { ProductCsvModal } from './product-csv-modal';
import { ProductTableRow } from './product-table-row';
import type { CategoryItem } from '../categories/categories-client';
import type { BrandItem } from '../brands/brands-client';
import type { AttributeItem } from '../attributes/attributes-client';

export type { AdminProductListItem } from './product-types';
import type { AdminProductListItem } from './product-types';

export function ProductsClient({
  initialProducts,
  categories,
  brands,
  attributes,
}: {
  initialProducts: AdminProductListItem[];
  categories: CategoryItem[];
  brands: BrandItem[];
  attributes: AttributeItem[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  const filtered = products.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف محصول "${title}" اطمینان دارید؟`)) return;
    const res = await deleteProductAction(id);
    if (!res.ok) {
      toast.error('خطا در حذف محصول');
      return;
    }
    toast.success('محصول با موفقیت حذف شد');
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت محصولات</h2>
          <p className="text-sm text-muted-foreground">فهرست، ویرایش تنوع‌ها، قیمت‌گذاری و بارگذاری محصولات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsCsvOpen(true)} className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            اکسپورت / ایمپورت CSV
          </Button>
          <Button onClick={() => { setEditingProduct(null); setIsEditorOpen(true); }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            افزودن محصول جدید
          </Button>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در عنوان یا اسلاگ کالا..."
                className="w-full pr-9 pl-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-xs"
              >
                <option value="">همه دسته‌ها</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-xs"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="ACTIVE">فعال</option>
                <option value="DRAFT">پیش‌نویس</option>
                <option value="ARCHIVED">بایگانی</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-border/60 text-xs text-muted-foreground pb-2">
                  <th className="pb-2">محصول</th>
                  <th className="pb-2">دسته و برند</th>
                  <th className="pb-2">قیمت پایه</th>
                  <th className="pb-2">تنوع / موجودی</th>
                  <th className="pb-2">وضعیت</th>
                  <th className="pb-2 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((p) => (
                  <ProductTableRow
                    key={p.id}
                    product={p}
                    onEdit={(item) => {
                      setEditingProduct({
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        status: item.status,
                        categoryId: item.categoryId,
                        brandId: item.brandId,
                        description: item.description,
                        shortDescription: item.shortDescription,
                        variants: item.variants,
                        images: item.images,
                        attributes: item.attributes,
                        seo: item.seo,
                      });
                      setIsEditorOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingProduct}
        categories={categories}
        brands={brands}
        attributes={attributes}
      />

      <ProductCsvModal
        isOpen={isCsvOpen}
        onClose={() => setIsCsvOpen(false)}
      />
    </div>
  );
}
