import type { PageSeo, PageType } from '../types/page-builder.types';

export interface PageProps {
  id: string;
  slug: string;
  title: string;
  type: PageType;
  seo?: PageSeo;
  publishedVersionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Page {
  private constructor(private readonly props: PageProps) {}

  public static create(props: Omit<PageProps, 'createdAt' | 'updatedAt'>): Page {
    return new Page({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(props: PageProps): Page {
    return new Page(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get slug(): string {
    return this.props.slug;
  }

  public get title(): string {
    return this.props.title;
  }

  public get type(): PageType {
    return this.props.type;
  }

  public get seo(): PageSeo | undefined {
    return this.props.seo;
  }

  public get publishedVersionId(): string | null | undefined {
    return this.props.publishedVersionId;
  }

  public get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public setPublishedVersion(versionId: string | null): void {
    this.props.publishedVersionId = versionId;
    this.props.updatedAt = new Date();
  }

  public updateTitle(title: string): void {
    if (!title.trim()) throw new Error('عنوان برگه نمی‌تواند خالی باشد');
    this.props.title = title.trim();
    this.props.updatedAt = new Date();
  }

  public updateSeo(seo: PageSeo): void {
    this.props.seo = seo;
    this.props.updatedAt = new Date();
  }

  public toJSON(): PageProps {
    return { ...this.props };
  }
}
