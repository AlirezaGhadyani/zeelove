import { Product } from '../../domain/aggregates/product.aggregate';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { ProductAttributeValue } from '../../domain/entities/attribute.entity';
import { Slug } from '../../domain/value-objects/slug.vo';
import { Seo } from '../../domain/value-objects/seo.vo';
import { Money } from '@/shared/kernel/money';
import type { ProductStatusType } from '../../domain/enums/product-status.enum';

export interface PrismaProductRaw {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  status: string;
  categoryId: string | null;
  brandId: string | null;
  seo: unknown;
  createdAt: Date;
  updatedAt: Date;
  variants?: Array<{
    id: string;
    productId: string;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    barcode: string | null;
    weightGrams: number | null;
    isDefault: boolean;
    options: unknown;
    createdAt: Date;
    updatedAt: Date;
  }>;
  images?: Array<{
    id: string;
    productId: string;
    url: string;
    altText: string | null;
    displayOrder: number;
    isMain: boolean;
    createdAt: Date;
  }>;
  attributeValues?: Array<{
    id: string;
    productId: string;
    attributeId: string;
    value: string;
  }>;
}

export function toProductDomain(record: PrismaProductRaw): Product {
  const slug = Slug.create(record.slug).unwrapOr(Slug.create(record.title).unwrapOr(null as unknown as Slug));
  const seoObj = (typeof record.seo === 'object' && record.seo !== null ? record.seo : {}) as {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
  };

  const variants = (record.variants || []).map((v) => {
    const opts = (typeof v.options === 'object' && v.options !== null ? v.options : {}) as Record<string, string>;
    return new ProductVariant({
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      price: Money.create(v.price),
      compareAtPrice: v.compareAtPrice ? Money.create(v.compareAtPrice) : undefined,
      barcode: v.barcode ?? undefined,
      weightGrams: v.weightGrams ?? undefined,
      isDefault: v.isDefault,
      options: opts,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    });
  });

  const images = (record.images || []).map(
    (img) =>
      new ProductImage({
        id: img.id,
        productId: img.productId,
        url: img.url,
        altText: img.altText ?? undefined,
        displayOrder: img.displayOrder,
        isMain: img.isMain,
        createdAt: img.createdAt,
      }),
  );

  const attributeValues = (record.attributeValues || []).map(
    (attr) =>
      new ProductAttributeValue({
        id: attr.id,
        productId: attr.productId,
        attributeId: attr.attributeId,
        value: attr.value,
      }),
  );

  return new Product({
    id: record.id,
    title: record.title,
    slug,
    description: record.description ?? undefined,
    shortDescription: record.shortDescription ?? undefined,
    status: (record.status as ProductStatusType) || 'DRAFT',
    categoryId: record.categoryId,
    brandId: record.brandId,
    seo: Seo.create(seoObj),
    variants,
    images,
    attributeValues,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}
