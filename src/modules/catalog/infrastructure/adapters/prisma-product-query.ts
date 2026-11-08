import type { Prisma } from '@prisma/client';
import type { ProductQueryCriteria } from '../../application/ports/product.repository.port';

export function buildProductWhere(criteria: ProductQueryCriteria): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (criteria.status) where.status = criteria.status;
  if (criteria.categoryId) where.categoryId = criteria.categoryId;
  if (criteria.brandId) where.brandId = criteria.brandId;

  if (criteria.search) {
    const q = criteria.search.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    where.variants = {
      some: {
        price: {
          gte: criteria.minPrice,
          lte: criteria.maxPrice,
        },
      },
    };
  }

  if (criteria.inStockOnly) {
    where.variants = {
      ...where.variants,
      some: {
        ...(where.variants && 'some' in where.variants ? where.variants.some : {}),
        inventory: {
          quantity: { gt: 0 },
        },
      },
    };
  }

  if (criteria.attributeFilters && criteria.attributeFilters.length > 0) {
    where.AND = criteria.attributeFilters.map((f) => ({
      attributeValues: {
        some: { attributeId: f.attributeId, value: f.value },
      },
    }));
  }

  return where;
}
