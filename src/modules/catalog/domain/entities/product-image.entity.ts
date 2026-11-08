import { Entity } from '@/shared/kernel/entity';

export interface ProductImageProps {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  displayOrder: number;
  isMain: boolean;
  createdAt?: Date;
}

export class ProductImage extends Entity<string> {
  private _productId: string;
  private _url: string;
  private _altText?: string;
  private _displayOrder: number;
  private _isMain: boolean;
  private _createdAt: Date;

  constructor(props: ProductImageProps) {
    super(props.id);
    this._productId = props.productId;
    this._url = props.url;
    this._altText = props.altText;
    this._displayOrder = props.displayOrder;
    this._isMain = props.isMain;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get productId(): string {
    return this._productId;
  }
  public get url(): string {
    return this._url;
  }
  public get altText(): string | undefined {
    return this._altText;
  }
  public get displayOrder(): number {
    return this._displayOrder;
  }
  public get isMain(): boolean {
    return this._isMain;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  public setMain(isMain: boolean): void {
    this._isMain = isMain;
  }

  public setDisplayOrder(order: number): void {
    this._displayOrder = order;
  }

  public update(props: Partial<Pick<ProductImageProps, 'url' | 'altText' | 'displayOrder' | 'isMain'>>): void {
    if (props.url !== undefined) this._url = props.url;
    if (props.altText !== undefined) this._altText = props.altText;
    if (props.displayOrder !== undefined) this._displayOrder = props.displayOrder;
    if (props.isMain !== undefined) this._isMain = props.isMain;
  }
}
