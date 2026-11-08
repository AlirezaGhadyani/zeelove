import type { Container } from '@/shared/infrastructure/container/container';
import { createToken, TOKENS } from '@/shared/infrastructure/container/tokens';
import type { CategoryRepositoryPort } from '../../application/ports/category.repository.port';
import type { BrandRepositoryPort } from '../../application/ports/brand.repository.port';
import type { AttributeRepositoryPort } from '../../application/ports/attribute.repository.port';
import type { ProductRepositoryPort } from '../../application/ports/product.repository.port';
import type { SearchPort } from '../../application/ports/search.port';
import { PrismaCategoryRepository } from '../adapters/prisma-category.repository';
import { PrismaBrandRepository } from '../adapters/prisma-brand.repository';
import { PrismaAttributeRepository } from '../adapters/prisma-attribute.repository';
import { PrismaProductRepository } from '../adapters/prisma-product.repository';
import { PostgresSearchAdapter } from '../adapters/postgres-search.adapter';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { ManageCategoriesUseCase } from '../../application/use-cases/manage-categories.use-case';
import { ManageBrandsUseCase } from '../../application/use-cases/manage-brands.use-case';
import { ManageAttributesUseCase } from '../../application/use-cases/manage-attributes.use-case';

export const CATALOG_TOKENS = {
  CategoryRepository: createToken<CategoryRepositoryPort>('CategoryRepository'),
  BrandRepository: createToken<BrandRepositoryPort>('BrandRepository'),
  AttributeRepository: createToken<AttributeRepositoryPort>('AttributeRepository'),
  ProductRepository: createToken<ProductRepositoryPort>('ProductRepository'),
  SearchPort: createToken<SearchPort>('SearchPort'),
  ListProductsUseCase: createToken<ListProductsUseCase>('ListProductsUseCase'),
  GetProductBySlugUseCase: createToken<GetProductBySlugUseCase>('GetProductBySlugUseCase'),
  CreateProductUseCase: createToken<CreateProductUseCase>('CreateProductUseCase'),
  UpdateProductUseCase: createToken<UpdateProductUseCase>('UpdateProductUseCase'),
  ManageCategoriesUseCase: createToken<ManageCategoriesUseCase>('ManageCategoriesUseCase'),
  ManageBrandsUseCase: createToken<ManageBrandsUseCase>('ManageBrandsUseCase'),
  ManageAttributesUseCase: createToken<ManageAttributesUseCase>('ManageAttributesUseCase'),
} as const;

export function registerCatalog(container: Container): void {
  container.register(
    CATALOG_TOKENS.CategoryRepository,
    (c) => new PrismaCategoryRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.BrandRepository,
    (c) => new PrismaBrandRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.AttributeRepository,
    (c) => new PrismaAttributeRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.ProductRepository,
    (c) => new PrismaProductRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.SearchPort,
    (c) => new PostgresSearchAdapter(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    CATALOG_TOKENS.ListProductsUseCase,
    (c) => new ListProductsUseCase(c.resolve(CATALOG_TOKENS.ProductRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.GetProductBySlugUseCase,
    (c) => new GetProductBySlugUseCase(c.resolve(CATALOG_TOKENS.ProductRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.CreateProductUseCase,
    (c) => new CreateProductUseCase(c.resolve(CATALOG_TOKENS.ProductRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.UpdateProductUseCase,
    (c) => new UpdateProductUseCase(c.resolve(CATALOG_TOKENS.ProductRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.ManageCategoriesUseCase,
    (c) => new ManageCategoriesUseCase(c.resolve(CATALOG_TOKENS.CategoryRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.ManageBrandsUseCase,
    (c) => new ManageBrandsUseCase(c.resolve(CATALOG_TOKENS.BrandRepository)),
    'singleton',
  );
  container.register(
    CATALOG_TOKENS.ManageAttributesUseCase,
    (c) => new ManageAttributesUseCase(c.resolve(CATALOG_TOKENS.AttributeRepository)),
    'singleton',
  );
}
