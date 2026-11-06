import { Entity } from '@/shared/kernel/entity';

export interface MediaProps {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  folder: string;
  url: string;
  thumbnailUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Media extends Entity<string> {
  private readonly _props: MediaProps;

  constructor(props: MediaProps) {
    super(props.id);
    this._props = { ...props };
  }

  public get filename(): string {
    return this._props.filename;
  }

  public get originalName(): string {
    return this._props.originalName;
  }

  public get mimeType(): string {
    return this._props.mimeType;
  }

  public get size(): number {
    return this._props.size;
  }

  public get width(): number | null | undefined {
    return this._props.width;
  }

  public get height(): number | null | undefined {
    return this._props.height;
  }

  public get altText(): string | null | undefined {
    return this._props.altText;
  }

  public get folder(): string {
    return this._props.folder;
  }

  public get url(): string {
    return this._props.url;
  }

  public get thumbnailUrl(): string | null | undefined {
    return this._props.thumbnailUrl;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public get updatedAt(): Date {
    return this._props.updatedAt;
  }

  public updateAltText(altText: string): void {
    this._props.altText = altText;
    this._props.updatedAt = new Date();
  }
}
