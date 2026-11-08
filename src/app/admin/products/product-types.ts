export interface AdminProductVariantItem {
  id: string;
  sku: string;
  priceToman: number;
  compareAtPriceToman?: number;
  isDefault?: boolean;
  options?: Record<string, string>;
}

export interface AdminProductImageItem {
  url: string;
  altText?: string;
  isMain?: boolean;
  displayOrder?: number;
}

export interface AdminProductAttributeItem {
  attributeId: string;
  value: string;
}

export interface AdminProductListItem {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  categoryName?: string;
  brandName?: string;
  categoryId?: string | null;
  brandId?: string | null;
  imageUrl?: string;
  priceToman: number;
  compareAtPriceToman?: number;
  variantsCount: number;
  totalStock: number;
  description?: string;
  shortDescription?: string;
  variants: AdminProductVariantItem[];
  images: AdminProductImageItem[];
  attributes: AdminProductAttributeItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}
