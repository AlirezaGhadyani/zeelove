import React from 'react';
import { redirect } from 'next/navigation';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import {
  IDENTITY_TOKENS,
  getSessionToken,
  requirePermission,
  PERMISSIONS,
} from '@/modules/identity-access';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { Badge } from '@/shared/ui/primitives/badge';
import { AdminLogoutButton } from '../admin-logout-button';
import { AdminNav } from '../admin-nav';
import { ProductsClient, type AdminProductListItem } from './products-client';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/auth/login?redirect=/admin/products');
  }

  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await getCurrentUser.execute({ sessionToken: token });

  if (result.isErr || !result.value) {
    redirect('/auth/login?redirect=/admin/products');
  }

  try {
    requirePermission(result.value, PERMISSIONS.ADMIN_ACCESS);
  } catch {
    redirect('/auth/login?error=forbidden');
  }

  const prisma = container.resolve(TOKENS.Prisma);

  const [productsData, categoriesData, brandsData, attributesData] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          include: {
            inventory: true,
          },
        },
        images: { orderBy: { displayOrder: 'asc' } },
        attributeValues: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.attribute.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const formattedProducts: AdminProductListItem[] = productsData.map((p) => {
    const defaultVariant = p.variants.find((v) => v.isDefault) ?? p.variants[0];
    const totalStock = p.variants.reduce((sum, v) => sum + (v.inventory?.quantity ?? 0), 0);
    const mainImg = p.images.find((img) => img.isMain) ?? p.images[0];

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
      categoryName: p.category?.name,
      brandName: p.brand?.name,
      categoryId: p.categoryId,
      brandId: p.brandId,
      imageUrl: mainImg?.url,
      priceToman: defaultVariant?.price ?? 0,
      compareAtPriceToman: defaultVariant?.compareAtPrice ?? undefined,
      variantsCount: p.variants.length,
      totalStock,
      description: p.description ?? undefined,
      shortDescription: p.shortDescription ?? undefined,
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        priceToman: v.price,
        compareAtPriceToman: v.compareAtPrice ?? undefined,
        isDefault: v.isDefault,
        options: (typeof v.options === 'object' && v.options !== null ? v.options : {}) as Record<string, string>,
      })),
      images: p.images.map((img) => ({
        url: img.url,
        altText: img.altText ?? undefined,
        isMain: img.isMain,
        displayOrder: img.displayOrder,
      })),
      attributes: p.attributeValues.map((a) => ({
        attributeId: a.attributeId,
        value: a.value,
      })),
      seo: (typeof p.seo === 'object' && p.seo !== null ? p.seo : undefined) as { metaTitle?: string; metaDescription?: string } | undefined,
    };
  });

  const categories = categoriesData.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    parentId: c.parentId,
    displayOrder: c.displayOrder,
    image: c.image ?? undefined,
    isActive: c.isActive,
  }));

  const brands = brandsData.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo ?? undefined,
    description: b.description ?? undefined,
    websiteUrl: b.websiteUrl ?? undefined,
    isActive: b.isActive,
  }));

  const attributes = attributesData.map((a) => ({
    id: a.id,
    name: a.name,
    code: a.code,
    type: a.type as 'TEXT' | 'NUMBER' | 'SELECT',
    options: Array.isArray(a.options) ? (a.options as string[]) : undefined,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="text-muted-foreground text-sm">|</span>
            <span className="font-bold text-foreground">مدیریت محصولات</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-xs">
              {result.value.role}
            </Badge>
            <AdminLogoutButton />
          </div>
        </header>

        <AdminNav />

        <ProductsClient
          initialProducts={formattedProducts}
          categories={categories}
          brands={brands}
          attributes={attributes}
        />
      </div>
    </div>
  );
}
