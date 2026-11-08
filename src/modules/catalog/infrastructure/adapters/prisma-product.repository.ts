import type { Prisma, PrismaClient } from '@prisma/client';
import type { ProductRepositoryPort, ProductQueryCriteria } from '../../application/ports/product.repository.port';
import type { Product } from '../../domain/aggregates/product.aggregate';
import { toProductDomain } from './prisma-product.mapper';
import { buildProductWhere } from './prisma-product-query';

const PRODUCT_INCLUDE = {
  variants: true,
  images: { orderBy: { displayOrder: 'asc' as const } },
  attributeValues: true,
};

export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    return record ? toProductDomain(record) : null;
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { slug },
      include: PRODUCT_INCLUDE,
    });
    return record ? toProductDomain(record) : null;
  }

  public async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return count > 0;
  }

  public async existsBySku(sku: string, excludeVariantId?: string): Promise<boolean> {
    const count = await this.prisma.productVariant.count({
      where: { sku, ...(excludeVariantId ? { id: { not: excludeVariantId } } : {}) },
    });
    return count > 0;
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  public async save(product: Product): Promise<void> {
    const seoData = product.seo.toJSON();

    await this.prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: product.id },
        create: {
          id: product.id,
          title: product.title,
          slug: product.slug.value,
          description: product.description,
          shortDescription: product.shortDescription,
          status: product.status,
          categoryId: product.categoryId,
          brandId: product.brandId,
          seo: seoData as unknown as object,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
        update: {
          title: product.title,
          slug: product.slug.value,
          description: product.description,
          shortDescription: product.shortDescription,
          status: product.status,
          categoryId: product.categoryId,
          brandId: product.brandId,
          seo: seoData as unknown as object,
          updatedAt: product.updatedAt,
        },
      });

      const incomingVariantIds = product.variants.map((v) => v.id);
      await tx.productVariant.deleteMany({
        where: { productId: product.id, id: { notIn: incomingVariantIds } },
      });

      for (const v of product.variants) {
        await tx.productVariant.upsert({
          where: { id: v.id },
          create: {
            id: v.id,
            productId: product.id,
            sku: v.sku,
            price: v.price.amount,
            compareAtPrice: v.compareAtPrice?.amount,
            barcode: v.barcode,
            weightGrams: v.weightGrams,
            isDefault: v.isDefault,
            options: v.options as unknown as object,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          },
          update: {
            sku: v.sku,
            price: v.price.amount,
            compareAtPrice: v.compareAtPrice?.amount,
            barcode: v.barcode,
            weightGrams: v.weightGrams,
            isDefault: v.isDefault,
            options: v.options as unknown as object,
            updatedAt: v.updatedAt,
          },
        });
      }

      await tx.productImage.deleteMany({ where: { productId: product.id } });
      if (product.images.length > 0) {
        await tx.productImage.createMany({
          data: product.images.map((img) => ({
            id: img.id,
            productId: product.id,
            url: img.url,
            altText: img.altText,
            displayOrder: img.displayOrder,
            isMain: img.isMain,
            createdAt: img.createdAt,
          })),
        });
      }

      await tx.productAttributeValue.deleteMany({ where: { productId: product.id } });
      if (product.attributeValues.length > 0) {
        await tx.productAttributeValue.createMany({
          data: product.attributeValues.map((attr) => ({
            id: attr.id,
            productId: product.id,
            attributeId: attr.attributeId,
            value: attr.value,
          })),
        });
      }
    });
  }

  public async findMany(criteria: ProductQueryCriteria): Promise<{ products: Product[]; total: number }> {
    const where = buildProductWhere(criteria);
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 20;
    const skip = (page - 1) * limit;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (criteria.sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: records.map((r) => toProductDomain(r)),
      total,
    };
  }
}
