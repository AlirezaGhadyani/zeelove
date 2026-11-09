import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content/infrastructure/container/register-content';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { resolvePageData } from '@/modules/content/rendering/data-resolver';
import { ZEELOVE_HOMEPAGE_ROWS } from '@/modules/content/infrastructure/seed/homepage-seed';

describe('Page Builder Integration & Data Resolution', () => {
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
      console.warn('[integration] PostgreSQL not available. Skipping live page rendering DB tests.');
    }
  });

  afterAll(async () => {
    if (isDbAvailable) {
      await prisma.$disconnect();
    }
  });

  it('retrieves the active home page via GetPageUseCase', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const getPageUseCase = container.resolve(CONTENT_TOKENS.GetPageUseCase);
    const result = await getPageUseCase.execute({ type: 'home' });

    expect(result.isOk).toBe(true);
    if (result.isOk) {
      expect(result.value.page.slug).toBe('home');
      expect(result.value.rows.length).toBeGreaterThan(0);
      expect(result.value.version?.status).toBe('published');
    }
  });

  it('resolves product and category data for seeded rows in parallel', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();

    const resolvedData = await resolvePageData(ZEELOVE_HOMEPAGE_ROWS);
    expect(typeof resolvedData).toBe('object');

    // Category block should have resolved categories
    const catBlockData = resolvedData['block-cat-1'];
    expect(catBlockData).toBeDefined();

    // Deals carousel should have products
    const dealBlockData = resolvedData['block-deal-1'];
    expect(dealBlockData).toBeDefined();

    // Brands strip should have brands
    const brandBlockData = resolvedData['block-brands-1'];
    expect(brandBlockData).toBeDefined();
  });
});
