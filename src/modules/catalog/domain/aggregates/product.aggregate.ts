import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';
import type { Slug } from '../value-objects/slug.vo';
import { Seo } from '../value-objects/seo.vo';
import type { ProductStatusType } from '../enums/product-status.enum';
import { ProductStatus } from '../enums/product-status.enum';
import type { ProductVariant } from '../entities/product-variant.entity';
import type { ProductImage } from '../entities/product-image.entity';
import type { ProductAttributeValue } from '../entities/attribute.entity';

export interface ProductProps {
  id: string;
  title: string;
  slug: Slug;
  description?: string;
  shortDescription?: string;
  status: ProductStatusType;
  categoryId?: string | null;
  brandId?: string | null;
  seo?: Seo;
  variants?: ProductVariant[];
  images?: ProductImage[];
  attributeValues?: ProductAttributeValue[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends AggregateRoot<string> {
  private _title: string;
  private _slug: Slug;
  private _description?: string;
  private _shortDescription?: string;
  private _status: ProductStatusType;
  private _categoryId?: string | null;
  private _brandId?: string | null;
  private _seo: Seo;
  private _variants: ProductVariant[];
  private _images: ProductImage[];
  private _attributeValues: ProductAttributeValue[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    super(props.id);
    if (!props.title || props.title.trim().length === 0) {
      throw new DomainRuleViolationError('INVALID_TITLE', 'Product title cannot be empty');
    }
    this._title = props.title.trim();
    this._slug = props.slug;
    this._description = props.description;
    this._shortDescription = props.shortDescription;
    this._status = props.status;
    this._categoryId = props.categoryId;
    this._brandId = props.brandId;
    this._seo = props.seo ?? Seo.create();
    this._variants = props.variants ? [...props.variants] : [];
    this._images = props.images ? [...props.images] : [];
    this._attributeValues = props.attributeValues ? [...props.attributeValues] : [];
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.ensureDefaultVariantInvariant();
  }

  public get title(): string { return this._title; }
  public get slug(): Slug { return this._slug; }
  public get description(): string | undefined { return this._description; }
  public get shortDescription(): string | undefined { return this._shortDescription; }
  public get status(): ProductStatusType { return this._status; }
  public get categoryId(): string | null | undefined { return this._categoryId; }
  public get brandId(): string | null | undefined { return this._brandId; }
  public get seo(): Seo { return this._seo; }
  public get variants(): ProductVariant[] { return [...this._variants]; }
  public get images(): ProductImage[] { return [...this._images]; }
  public get attributeValues(): ProductAttributeValue[] { return [...this._attributeValues]; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  public get defaultVariant(): ProductVariant | undefined {
    return this._variants.find((v) => v.isDefault) ?? this._variants[0];
  }

  public addVariant(variant: ProductVariant): void {
    if (this._variants.some((v) => v.sku === variant.sku)) {
      throw new DomainRuleViolationError('DUPLICATE_SKU', `SKU ${variant.sku} already exists`);
    }
    if (this._variants.length === 0) {
      variant.setDefault(true);
    }
    this._variants.push(variant);
    this.ensureDefaultVariantInvariant();
    this._updatedAt = new Date();
  }

  public removeVariant(variantId: string): void {
    if (this._variants.length <= 1 && this._status === ProductStatus.ACTIVE) {
      throw new DomainRuleViolationError('MIN_VARIANT_RULE', 'Active product must have at least one variant');
    }
    this._variants = this._variants.filter((v) => v.id !== variantId);
    this.ensureDefaultVariantInvariant();
    this._updatedAt = new Date();
  }

  public setDefaultVariant(variantId: string): void {
    const target = this._variants.find((v) => v.id === variantId);
    if (!target) {
      throw new DomainRuleViolationError('VARIANT_NOT_FOUND', `Variant ${variantId} not found`);
    }
    for (const v of this._variants) {
      v.setDefault(v.id === variantId);
    }
    this._updatedAt = new Date();
  }

  public setStatus(status: ProductStatusType): void {
    if (status === ProductStatus.ACTIVE && this._variants.length === 0) {
      throw new DomainRuleViolationError('PUBLISH_ERROR', 'Cannot publish product without at least one variant');
    }
    this._status = status;
    this._updatedAt = new Date();
  }

  public addImage(image: ProductImage): void {
    if (this._images.length === 0) {
      image.setMain(true);
    }
    this._images.push(image);
    this._updatedAt = new Date();
  }

  public removeImage(imageId: string): void {
    const removed = this._images.find((img) => img.id === imageId);
    this._images = this._images.filter((img) => img.id !== imageId);
    if (removed?.isMain && this._images.length > 0) {
      this._images[0]!.setMain(true);
    }
    this._updatedAt = new Date();
  }

  public setMainImage(imageId: string): void {
    for (const img of this._images) {
      img.setMain(img.id === imageId);
    }
    this._updatedAt = new Date();
  }

  public setAttributes(values: ProductAttributeValue[]): void {
    this._attributeValues = [...values];
    this._updatedAt = new Date();
  }

  public updateGeneralInfo(props: {
    title?: string;
    slug?: Slug;
    description?: string;
    shortDescription?: string;
    categoryId?: string | null;
    brandId?: string | null;
    seo?: Seo;
  }): void {
    if (props.title !== undefined) this._title = props.title.trim();
    if (props.slug !== undefined) this._slug = props.slug;
    if (props.description !== undefined) this._description = props.description;
    if (props.shortDescription !== undefined) this._shortDescription = props.shortDescription;
    if (props.categoryId !== undefined) this._categoryId = props.categoryId;
    if (props.brandId !== undefined) this._brandId = props.brandId;
    if (props.seo !== undefined) this._seo = props.seo;
    this._updatedAt = new Date();
  }

  private ensureDefaultVariantInvariant(): void {
    if (this._variants.length === 0) return;
    const defaults = this._variants.filter((v) => v.isDefault);
    if (defaults.length === 0) {
      this._variants[0]!.setDefault(true);
    } else if (defaults.length > 1) {
      for (let i = 1; i < defaults.length; i++) {
        defaults[i]!.setDefault(false);
      }
    }
  }
}
