export type CollectionRule =
  | 'newest'
  | 'discounted'
  | 'best_selling'
  | 'by_category'
  | 'by_brand'
  | 'manual';

export type DataNeed =
  | {
      type: 'products';
      ids: string[];
    }
  | {
      type: 'collection';
      rule: CollectionRule;
      categoryId?: string;
      brandId?: string;
      limit?: number;
      productIds?: string[];
    }
  | {
      type: 'categories';
      ids?: string[];
      limit?: number;
    }
  | {
      type: 'brands';
      ids?: string[];
      limit?: number;
    };

export interface ResolvedBlockData {
  products?: Array<{
    id: string;
    title: string;
    slug: string;
    brandName?: string;
    categoryName?: string;
    price: number;
    compareAtPrice?: number | null;
    discountPercent?: number | null;
    imageUrl?: string;
    rating?: number;
    inStock: boolean;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
  }>;
  brands?: Array<{
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  }>;
}

export type PageResolvedData = Record<string, ResolvedBlockData>;
