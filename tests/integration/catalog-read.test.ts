import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/shared/infrastructure/database/prisma';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';

describe('Catalog Read Side & Search Integration Tests', () => {
  let isDbAvailable = false;

  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      isDbAvailable = true;
    } catch {
      isDbAvailable = false;
      // eslint-disable-next-line no-console
      console.warn('[integration] PostgreSQL not available. Skipping catalog read integration tests.');
    }
  });

  it('lists products with category and brand filtering', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const container = createAppContainer();
    const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);

    const result = await listProducts.execute({
      categoryId: 'cat-men-shirts',
      limit: 10,
    });

    expect(result.isOk).toBe(true);
    expect(result.value.products.length).toBeGreaterThan(0);
    expect(result.value.products.every((p) => p.categoryId === 'cat-men-shirts')).toBe(true);
  });

  it('filters products by price range', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const container = createAppContainer();
    const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);

    const result = await listProducts.execute({
      minPrice: 500000,
      maxPrice: 1000000,
      limit: 20,
    });

    expect(result.isOk).toBe(true);
    expect(result.value.products.length).toBeGreaterThan(0);
    for (const p of result.value.products) {
      const defaultVariant = p.defaultVariant;
      expect(defaultVariant?.price.amount).toBeGreaterThanOrEqual(500000);
      expect(defaultVariant?.price.amount).toBeLessThanOrEqual(1000000);
    }
  });

  it('finds products using Persian SearchPort with Arabic Yeh/Kaf normalization', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const container = createAppContainer();
    const searchPort = container.resolve(CATALOG_TOKENS.SearchPort);

    // Search with Arabic Yeh (ي) and Arabic Kaf (ك)
    const arabicQuery = 'پيراهن كلاسيك';
    const searchRes = await searchPort.search(arabicQuery);

    expect(searchRes.items.length).toBeGreaterThan(0);
    expect(searchRes.items[0]!.title).toContain('پیراهن');
  });

  it('retrieves full product details by slug', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const container = createAppContainer();
    const getProduct = container.resolve(CATALOG_TOKENS.GetProductBySlugUseCase);

    const result = await getProduct.execute({ slug: 'zeelove-classic-oxford-shirt' });
    expect(result.isOk).toBe(true);

    const product = result.value;
    expect(product.title).toBe('پیراهن آکسفورد مردانه زیلاو کلاسیک');
    expect(product.variants.length).toBeGreaterThanOrEqual(2);
    expect(product.images.length).toBeGreaterThanOrEqual(1);
  });
});
