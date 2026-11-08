import type { Product } from '../../domain/aggregates/product.aggregate';
import type { ProductStatusType } from '../../domain/enums/product-status.enum';

export interface ProductQueryCriteria {
  categoryId?: string;
  brandId?: string;
  status?: ProductStatusType;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStockOnly?: boolean;
  attributeFilters?: Array<{ attributeId: string; value: string }>;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'title';
  page?: number;
  limit?: number;
}

export interface ProductRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  existsBySlug(slug: string, excludeId?: string): Promise<boolean>;
  existsBySku(sku: string, excludeVariantId?: string): Promise<boolean>;
  findMany(criteria: ProductQueryCriteria): Promise<{ products: Product[]; total: number }>;
}
