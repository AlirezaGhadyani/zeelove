import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { TOKENS } from '@/shared/infrastructure/container/tokens';

describe('Storefront Read Queries Integration Tests', () => {
  const container = createAppContainer();
  const prisma = container.resolve(TOKENS.Prisma);
  let isDbAvailable = false;

  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      isDbAvailable = true;
    } catch {
      isDbAvailable = false;
      // eslint-disable-next-line no-console
      console.warn('[integration] PostgreSQL not available. Skipping storefront read integration tests.');
    }
  });

  afterAll(async () => {
    if (isDbAvailable) {
      await prisma.$disconnect();
    }
  });

  it('retrieves header_main menu tree from database', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    const getMenu = container.resolve(CONTENT_TOKENS.GetMenuUseCase);
    const result = await getMenu.execute({ code: 'header_main' });

    expect(result.isOk).toBe(true);
    if (result.isOk && result.value) {
      expect(result.value.code).toBe('header_main');
      expect(result.value.items.length).toBeGreaterThan(0);
      const menItem = result.value.items.find((i) => i.url === '/category/men-clothing');
      if (menItem) {
        expect(menItem.children.length).toBeGreaterThan(0);
      }
    }
  });

  it('queries active products with category filtering for category page', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);
    const category = await prisma.category.findFirst({ where: { isActive: true } });

    if (category) {
      const result = await listProducts.execute({
        categoryId: category.id,
        status: 'ACTIVE',
        limit: 10,
      });

      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value.products.every((p) => p.status === 'ACTIVE')).toBe(true);
      }
    }
  });

  it('normalizes search query for storefront instant search', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    const searchPort = container.resolve(CATALOG_TOKENS.SearchPort);
    // Search with Arabic Yeh 'ي'
    const res = await searchPort.search('پيراهن', { limit: 5 });

    expect(res.normalizedQuery).toBe('پیراهن');
    expect(res.items.length).toBeGreaterThan(0);
  });
});
