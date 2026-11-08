import { Entity } from '@/shared/kernel/entity';
import type { Slug } from '../value-objects/slug.vo';

export interface CategoryProps {
  id: string;
  name: string;
  slug: Slug;
  description?: string;
  parentId?: string | null;
  displayOrder: number;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category extends Entity<string> {
  private _name: string;
  private _slug: Slug;
  private _description?: string;
  private _parentId?: string | null;
  private _displayOrder: number;
  private _image?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CategoryProps) {
    super(props.id);
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._parentId = props.parentId;
    this._displayOrder = props.displayOrder;
    this._image = props.image;
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
  public get description(): string | undefined {
    return this._description;
  }
  public get parentId(): string | null | undefined {
    return this._parentId;
  }
  public get displayOrder(): number {
    return this._displayOrder;
  }
  public get image(): string | undefined {
    return this._image;
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

  public update(props: Partial<Pick<CategoryProps, 'name' | 'slug' | 'description' | 'parentId' | 'displayOrder' | 'image' | 'isActive'>>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.slug !== undefined) this._slug = props.slug;
    if (props.description !== undefined) this._description = props.description;
    if (props.parentId !== undefined) this._parentId = props.parentId;
    if (props.displayOrder !== undefined) this._displayOrder = props.displayOrder;
    if (props.image !== undefined) this._image = props.image;
    if (props.isActive !== undefined) this._isActive = props.isActive;
    this._updatedAt = new Date();
  }
}
