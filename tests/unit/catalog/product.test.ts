import { describe, it, expect } from 'vitest';
import { Product } from '@/modules/catalog/domain/aggregates/product.aggregate';
import { ProductVariant } from '@/modules/catalog/domain/entities/product-variant.entity';
import { ProductImage } from '@/modules/catalog/domain/entities/product-image.entity';
import { Slug } from '@/modules/catalog/domain/value-objects/slug.vo';
import { Money } from '@/shared/kernel/money';
import { ProductStatus } from '@/modules/catalog/domain/enums/product-status.enum';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

describe('Product Aggregate & Variants', () => {
  const sampleSlug = Slug.create('zeelove-shirt').unwrap();

  it('creates product and ensures exactly one default variant', () => {
    const v1 = new ProductVariant({
      id: 'var-1',
      productId: 'prod-1',
      sku: 'ZL-SH-M',
      price: Money.create(500000),
      isDefault: false,
    });
    const v2 = new ProductVariant({
      id: 'var-2',
      productId: 'prod-1',
      sku: 'ZL-SH-L',
      price: Money.create(520000),
      isDefault: false,
    });

    const product = new Product({
      id: 'prod-1',
      title: 'پیراهن نخی زیلاو',
      slug: sampleSlug,
      status: ProductStatus.DRAFT,
      variants: [v1, v2],
    });

    expect(product.variants.length).toBe(2);
    // Since neither was designated default, the first variant is automatically made default
    expect(product.defaultVariant?.id).toBe('var-1');
  });

  it('validates compare-at price must be strictly greater than selling price', () => {
    expect(() => {
      new ProductVariant({
        id: 'var-invalid',
        productId: 'prod-1',
        sku: 'INV-1',
        price: Money.create(500000),
        compareAtPrice: Money.create(400000), // Invalid: less than price
        isDefault: true,
      });
    }).toThrow(DomainRuleViolationError);
  });

  it('calculates discount percentage correctly', () => {
    const variant = new ProductVariant({
      id: 'var-disc',
      productId: 'prod-1',
      sku: 'DISC-1',
      price: Money.create(800000),
      compareAtPrice: Money.create(1000000), // 20% discount
      isDefault: true,
    });

    expect(variant.hasDiscount()).toBe(true);
    expect(variant.discountPercentage()).toBe(20);
  });

  it('prevents adding variant with duplicate SKU', () => {
    const product = new Product({
      id: 'prod-1',
      title: 'تست تکرار SKU',
      slug: sampleSlug,
      status: ProductStatus.DRAFT,
      variants: [
        new ProductVariant({
          id: 'v1',
          productId: 'prod-1',
          sku: 'DUPLICATE-SKU',
          price: Money.create(100000),
          isDefault: true,
        }),
      ],
    });

    expect(() => {
      product.addVariant(
        new ProductVariant({
          id: 'v2',
          productId: 'prod-1',
          sku: 'DUPLICATE-SKU',
          price: Money.create(120000),
          isDefault: false,
        }),
      );
    }).toThrow(DomainRuleViolationError);
  });

  it('enforces that active published product must have at least one variant', () => {
    const product = new Product({
      id: 'prod-empty',
      title: 'محصول بدون تنوع',
      slug: sampleSlug,
      status: ProductStatus.DRAFT,
      variants: [],
    });

    expect(() => {
      product.setStatus(ProductStatus.ACTIVE);
    }).toThrow(DomainRuleViolationError);
  });

  it('manages main product image automatically', () => {
    const product = new Product({
      id: 'prod-img',
      title: 'محصول با تصویر',
      slug: sampleSlug,
      status: ProductStatus.DRAFT,
    });

    const img1 = new ProductImage({
      id: 'img-1',
      productId: 'prod-img',
      url: '/assets/products/shirt.svg',
      displayOrder: 0,
      isMain: false,
    });
    const img2 = new ProductImage({
      id: 'img-2',
      productId: 'prod-img',
      url: '/assets/products/pants.svg',
      displayOrder: 1,
      isMain: false,
    });

    product.addImage(img1);
    expect(img1.isMain).toBe(true); // First image automatically becomes main

    product.addImage(img2);
    product.setMainImage('img-2');
    expect(product.images.find((i) => i.id === 'img-2')?.isMain).toBe(true);
    expect(product.images.find((i) => i.id === 'img-1')?.isMain).toBe(false);
  });
});
