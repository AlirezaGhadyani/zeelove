// Public API of catalog bounded context
export * from './domain/value-objects/slug.vo';
export * from './domain/value-objects/seo.vo';
export * from './domain/enums/product-status.enum';
export * from './domain/entities/category.entity';
export * from './domain/entities/brand.entity';
export * from './domain/entities/attribute.entity';
export * from './domain/entities/product-image.entity';
export * from './domain/entities/product-variant.entity';
export * from './domain/aggregates/product.aggregate';
export * from './domain/services/persian-search-normalizer';

export * from './application/ports/category.repository.port';
export * from './application/ports/brand.repository.port';
export * from './application/ports/attribute.repository.port';
export * from './application/ports/product.repository.port';
export * from './application/ports/search.port';

export * from './application/use-cases/list-products.use-case';
export * from './application/use-cases/get-product-by-slug.use-case';
export * from './application/use-cases/create-product.use-case';
export * from './application/use-cases/update-product.use-case';
export * from './application/use-cases/manage-categories.use-case';
export * from './application/use-cases/manage-brands.use-case';
export * from './application/use-cases/manage-attributes.use-case';

export * from './infrastructure/container/register-catalog';
