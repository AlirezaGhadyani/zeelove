import { appContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';
import { getBlockDefinition } from '../blocks/registry';
import type { RowLayout } from '../domain/types/page-builder.types';
import type {
  DataNeed,
  PageResolvedData,
  ResolvedBlockData,
} from '../blocks/common/data-needs';
import type { Product } from '@/modules/catalog/domain/aggregates/product.aggregate';

function mapProduct(p: Product) {
  const defVar = p.variants.find((v) => v.isDefault) || p.variants[0];
  const mainImg = p.images.find((img) => img.isMain) || p.images[0];
  const price = defVar ? defVar.price.amount : 0;
  const compareAtPrice = defVar?.compareAtPrice ? defVar.compareAtPrice.amount : null;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  return {
    id: p.id,
    title: p.title,
    slug: p.slug.value,
    price,
    compareAtPrice,
    discountPercent,
    imageUrl: mainImg?.url || '/assets/products/placeholder.svg',
    rating: 4.8,
    inStock: p.variants.some((v) => v.stock > 0),
  };
}

export async function resolvePageData(rows: RowLayout[]): Promise<PageResolvedData> {
  const resolvedData: PageResolvedData = {};

  // Extract all block instances
  const blockEntries: Array<{ blockId: string; need: DataNeed }> = [];

  for (const row of rows) {
    for (const col of row.columns) {
      for (const block of col.blocks) {
        const def = getBlockDefinition(block.type);
        if (def?.getDataNeeds) {
          const needs = def.getDataNeeds(block.props);
          for (const need of needs) {
            blockEntries.push({ blockId: block.id, need });
          }
        }
      }
    }
  }

  if (blockEntries.length === 0) {
    return resolvedData;
  }

  const listProductsUseCase = appContainer.resolve(
    CATALOG_TOKENS.ListProductsUseCase,
  );
  const categoryRepo = appContainer.resolve(CATALOG_TOKENS.CategoryRepository);
  const brandRepo = appContainer.resolve(CATALOG_TOKENS.BrandRepository);

  // Execute resolutions in parallel
  await Promise.all(
    blockEntries.map(async ({ blockId, need }) => {
      const blockData: ResolvedBlockData = {};

      try {
        if (need.type === 'products' && need.ids.length > 0) {
          const res = await listProductsUseCase.execute({
            limit: need.ids.length,
          });
          const matched = res.value.products.filter((p) =>
            need.ids.includes(p.id),
          );
          blockData.products = (matched.length > 0
            ? matched
            : res.value.products
          ).map(mapProduct);
        } else if (need.type === 'collection') {
          const res = await listProductsUseCase.execute({
            categoryId: need.categoryId,
            brandId: need.brandId,
            sort:
              need.rule === 'newest'
                ? 'newest'
                : need.rule === 'best_selling'
                ? 'popular'
                : undefined,
            limit: need.limit ?? 8,
          });

          let items = res.value.products;
          if (need.rule === 'discounted') {
            const disc = items.filter((p) =>
              p.variants.some(
                (v) => v.compareAtPrice && v.compareAtPrice.amount > v.price.amount,
              ),
            );
            if (disc.length > 0) items = disc;
          }
          blockData.products = items.map(mapProduct);
        } else if (need.type === 'categories') {
          const categories = await categoryRepo.findActiveRoots();
          blockData.categories = categories.slice(0, need.limit ?? 8).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug.value,
            imageUrl: `/assets/categories/${c.slug.value}.jpg`,
            productCount: 12,
          }));
        } else if (need.type === 'brands') {
          const brands = await brandRepo.findActive();
          blockData.brands = brands.map((b) => ({
            id: b.id,
            name: b.name,
            slug: b.slug.value,
            logoUrl: b.logoUrl,
          }));
        }
      } catch (err) {
        console.error(`Error resolving data for block ${blockId}:`, err);
      }

      resolvedData[blockId] = {
        ...resolvedData[blockId],
        ...blockData,
      };
    }),
  );

  return resolvedData;
}
