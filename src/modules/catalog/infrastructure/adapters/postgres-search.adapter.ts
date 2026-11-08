import type { Prisma, PrismaClient } from '@prisma/client';
import type { SearchPort, SearchOptions, SearchResult } from '../../application/ports/search.port';
import { normalizeForSearch } from '../../domain/services/persian-search-normalizer';
import { toProductDomain } from './prisma-product.mapper';

export class PostgresSearchAdapter implements SearchPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const normalized = normalizeForSearch(query);
    if (!normalized) {
      return { items: [], total: 0, normalizedQuery: '' };
    }

    const tokens = normalized.split(' ').filter((t) => t.length > 0);
    const whereConditions: Prisma.ProductWhereInput[] = [];

    for (const token of tokens) {
      whereConditions.push({
        OR: [
          { title: { contains: token, mode: 'insensitive' } },
          { description: { contains: token, mode: 'insensitive' } },
          { shortDescription: { contains: token, mode: 'insensitive' } },
          { slug: { contains: token, mode: 'insensitive' } },
          { category: { name: { contains: token, mode: 'insensitive' } } },
          { brand: { name: { contains: token, mode: 'insensitive' } } },
        ],
      });
    }

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      AND: whereConditions,
    };

    if (options.categoryId) where.categoryId = options.categoryId;
    if (options.brandId) where.brandId = options.brandId;
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: options.minPrice,
            lte: options.maxPrice,
          },
        },
      };
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          variants: true,
          images: { orderBy: { displayOrder: 'asc' } },
          attributeValues: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const items = records.map((r) => toProductDomain(r));

    return {
      items: items.filter(Boolean),
      total,
      normalizedQuery: normalized,
    };
  }
}
