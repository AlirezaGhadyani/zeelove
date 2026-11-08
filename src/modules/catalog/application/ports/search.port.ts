import type { Product } from '../../domain/aggregates/product.aggregate';

export interface SearchOptions {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  items: Product[];
  total: number;
  normalizedQuery: string;
}

export interface SearchPort {
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
}
