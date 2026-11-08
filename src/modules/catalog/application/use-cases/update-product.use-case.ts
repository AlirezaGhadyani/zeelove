import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import { NotFoundError, ConflictError, ValidationError, type DomainError } from '@/shared/kernel/domain-error';
import { Money } from '@/shared/kernel/money';
import { Slug } from '../../domain/value-objects/slug.vo';
import { Seo } from '../../domain/value-objects/seo.vo';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { ProductAttributeValue } from '../../domain/entities/attribute.entity';
import type { ProductStatusType } from '../../domain/enums/product-status.enum';
import type { ProductRepositoryPort } from '../ports/product.repository.port';
import type { Product } from '../../domain/aggregates/product.aggregate';
import type { CreateVariantInput } from './create-product.use-case';

export interface UpdateProductInput {
  id: string;
  title?: string;
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
  variants?: CreateVariantInput[];
  images?: Array<{ url: string; altText?: string; displayOrder?: number; isMain?: boolean }>;
  attributes?: Array<{ attributeId: string; value: string }>;
}

export class UpdateProductUseCase
  implements UseCase<UpdateProductInput, Result<Product, DomainError>>
{
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  public async execute(input: UpdateProductInput): Promise<Result<Product, DomainError>> {
    const product = await this.productRepo.findById(input.id);
    if (!product) {
      return err(new NotFoundError('Product', input.id));
    }

    let slug = product.slug;
    if (input.slug && input.slug !== product.slug.value) {
      const slugRes = Slug.create(input.slug);
      if (slugRes.isErr) return err(slugRes.error);
      const exists = await this.productRepo.existsBySlug(slugRes.value.value, product.id);
      if (exists) {
        return err(new ConflictError(`Slug "${slugRes.value.value}" is already used by another product`));
      }
      slug = slugRes.value;
    }

    product.updateGeneralInfo({
      title: input.title,
      slug,
      description: input.description,
      shortDescription: input.shortDescription,
      categoryId: input.categoryId,
      brandId: input.brandId,
      seo: input.seo ? Seo.create(input.seo) : undefined,
    });

    if (input.variants && input.variants.length > 0) {
      const nextVariants: ProductVariant[] = [];
      const skuSet = new Set<string>();
      for (let i = 0; i < input.variants.length; i++) {
        const v = input.variants[i]!;
        const cleanSku = v.sku.trim();
        if (skuSet.has(cleanSku)) {
          return err(new ConflictError(`Duplicate SKU "${cleanSku}"`));
        }
        skuSet.add(cleanSku);
        const price = Money.create(v.priceToman);
        const comparePrice = v.compareAtPriceToman ? Money.create(v.compareAtPriceToman) : undefined;
        nextVariants.push(
          new ProductVariant({
            id: `var-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            productId: product.id,
            sku: cleanSku,
            price,
            compareAtPrice: comparePrice,
            barcode: v.barcode,
            weightGrams: v.weightGrams,
            isDefault: v.isDefault ?? i === 0,
            options: v.options,
          }),
        );
      }
      // Replace variants on aggregate
      while (product.variants.length > 0) {
        product.removeVariant(product.variants[0]!.id);
      }
      for (const v of nextVariants) {
        product.addVariant(v);
      }
    }

    if (input.images) {
      while (product.images.length > 0) {
        product.removeImage(product.images[0]!.id);
      }
      input.images.forEach((img, idx) => {
        product.addImage(
          new ProductImage({
            id: `img-${Date.now()}-${idx}`,
            productId: product.id,
            url: img.url,
            altText: img.altText,
            displayOrder: img.displayOrder ?? idx,
            isMain: img.isMain ?? idx === 0,
          }),
        );
      });
    }

    if (input.attributes) {
      const attrs = input.attributes.map(
        (a, idx) =>
          new ProductAttributeValue({
            id: `attrval-${Date.now()}-${idx}`,
            productId: product.id,
            attributeId: a.attributeId,
            value: a.value,
          }),
      );
      product.setAttributes(attrs);
    }

    if (input.status !== undefined) {
      try {
        product.setStatus(input.status);
      } catch (errRule) {
        return err(new ValidationError(errRule instanceof Error ? errRule.message : 'Invalid status transition'));
      }
    }

    await this.productRepo.save(product);
    return ok(product);
  }
}
