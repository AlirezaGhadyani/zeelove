import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import { ConflictError, ValidationError, type DomainError } from '@/shared/kernel/domain-error';
import { Money } from '@/shared/kernel/money';
import { Slug } from '../../domain/value-objects/slug.vo';
import { Seo } from '../../domain/value-objects/seo.vo';
import { Product } from '../../domain/aggregates/product.aggregate';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { ProductAttributeValue } from '../../domain/entities/attribute.entity';
import type { ProductStatusType } from '../../domain/enums/product-status.enum';
import type { ProductRepositoryPort } from '../ports/product.repository.port';

export interface CreateVariantInput {
  sku: string;
  priceToman: number;
  compareAtPriceToman?: number;
  barcode?: string;
  weightGrams?: number;
  isDefault?: boolean;
  options?: Record<string, string>;
  initialStock?: number;
}

export interface CreateProductInput {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  status?: ProductStatusType;
  categoryId?: string | null;
  brandId?: string | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
  };
  variants: CreateVariantInput[];
  images?: Array<{ url: string; altText?: string; displayOrder?: number; isMain?: boolean }>;
  attributes?: Array<{ attributeId: string; value: string }>;
}

export class CreateProductUseCase
  implements UseCase<CreateProductInput, Result<Product, DomainError>>
{
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  public async execute(input: CreateProductInput): Promise<Result<Product, DomainError>> {
    if (!input.title || input.title.trim().length === 0) {
      return err(new ValidationError('Product title is required'));
    }

    const rawSlug = input.slug || input.title;
    const slugRes = Slug.create(rawSlug);
    if (slugRes.isErr) {
      return err(slugRes.error);
    }
    const slug = slugRes.value;

    const slugExists = await this.productRepo.existsBySlug(slug.value);
    if (slugExists) {
      return err(new ConflictError(`Product slug "${slug.value}" is already in use`));
    }

    if (!input.variants || input.variants.length === 0) {
      return err(new ValidationError('Product must have at least one variant'));
    }

    const skuSet = new Set<string>();
    for (const v of input.variants) {
      const cleanSku = v.sku.trim();
      if (skuSet.has(cleanSku)) {
        return err(new ConflictError(`Duplicate SKU "${cleanSku}" in variant list`));
      }
      skuSet.add(cleanSku);

      const exists = await this.productRepo.existsBySku(cleanSku);
      if (exists) {
        return err(new ConflictError(`SKU "${cleanSku}" already exists in the system`));
      }
    }

    const productId = input.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const variants = input.variants.map((v, idx) => {
      const price = Money.create(v.priceToman);
      const comparePrice = v.compareAtPriceToman ? Money.create(v.compareAtPriceToman) : undefined;
      return new ProductVariant({
        id: `var-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        productId,
        sku: v.sku.trim(),
        price,
        compareAtPrice: comparePrice,
        barcode: v.barcode,
        weightGrams: v.weightGrams,
        isDefault: v.isDefault ?? idx === 0,
        options: v.options,
      });
    });

    const images = (input.images || []).map((img, idx) => {
      return new ProductImage({
        id: `img-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        productId,
        url: img.url,
        altText: img.altText,
        displayOrder: img.displayOrder ?? idx,
        isMain: img.isMain ?? idx === 0,
      });
    });

    const attributes = (input.attributes || []).map((attr, idx) => {
      return new ProductAttributeValue({
        id: `attrval-${Date.now()}-${idx}`,
        productId,
        attributeId: attr.attributeId,
        value: attr.value,
      });
    });

    const product = new Product({
      id: productId,
      title: input.title,
      slug,
      description: input.description,
      shortDescription: input.shortDescription,
      status: input.status ?? 'DRAFT',
      categoryId: input.categoryId,
      brandId: input.brandId,
      seo: input.seo ? Seo.create(input.seo) : undefined,
      variants,
      images,
      attributeValues: attributes,
    });

    await this.productRepo.save(product);

    return ok(product);
  }
}
