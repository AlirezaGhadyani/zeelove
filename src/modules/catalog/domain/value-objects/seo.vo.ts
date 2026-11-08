import { ValueObject } from '@/shared/kernel/value-object';

export interface SeoProps {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export class Seo extends ValueObject<SeoProps> {
  private constructor(props: SeoProps) {
    super(props);
  }

  public static create(props: SeoProps = {}): Seo {
    return new Seo({
      metaTitle: props.metaTitle?.trim() || undefined,
      metaDescription: props.metaDescription?.trim() || undefined,
      canonicalUrl: props.canonicalUrl?.trim() || undefined,
      keywords: props.keywords ? props.keywords.map((k) => k.trim()).filter(Boolean) : undefined,
    });
  }

  public get metaTitle(): string | undefined {
    return this.props.metaTitle;
  }

  public get metaDescription(): string | undefined {
    return this.props.metaDescription;
  }

  public get canonicalUrl(): string | undefined {
    return this.props.canonicalUrl;
  }

  public get keywords(): string[] | undefined {
    return this.props.keywords;
  }

  public toJSON(): SeoProps {
    return { ...this.props };
  }
}
