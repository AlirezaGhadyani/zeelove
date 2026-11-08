import { Entity } from '@/shared/kernel/entity';
import type { Slug } from '../value-objects/slug.vo';

export interface BrandProps {
  id: string;
  name: string;
  slug: Slug;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Brand extends Entity<string> {
  private _name: string;
  private _slug: Slug;
  private _logo?: string;
  private _description?: string;
  private _websiteUrl?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BrandProps) {
    super(props.id);
    this._name = props.name;
    this._slug = props.slug;
    this._logo = props.logo;
    this._description = props.description;
    this._websiteUrl = props.websiteUrl;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get name(): string {
    return this._name;
  }
  public get slug(): Slug {
    return this._slug;
  }
  public get logo(): string | undefined {
    return this._logo;
  }
  public get description(): string | undefined {
    return this._description;
  }
  public get websiteUrl(): string | undefined {
    return this._websiteUrl;
  }
  public get isActive(): boolean {
    return this._isActive;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(props: Partial<Pick<BrandProps, 'name' | 'slug' | 'logo' | 'description' | 'websiteUrl' | 'isActive'>>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.slug !== undefined) this._slug = props.slug;
    if (props.logo !== undefined) this._logo = props.logo;
    if (props.description !== undefined) this._description = props.description;
    if (props.websiteUrl !== undefined) this._websiteUrl = props.websiteUrl;
    if (props.isActive !== undefined) this._isActive = props.isActive;
    this._updatedAt = new Date();
  }
}
