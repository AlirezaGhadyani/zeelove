import { Result, ok, err } from '@/shared/kernel/result';
import type { PageRepositoryPort } from '../ports/page.repository.port';
import { Page } from '../../domain/entities/page.entity';
import { PageVersion } from '../../domain/entities/page-version.entity';
import type { PageType, RowLayout, PageSeo } from '../../domain/types/page-builder.types';

export class ManagePageUseCase {
  constructor(private readonly pageRepo: PageRepositoryPort) {}

  public async createPage(input: {
    id?: string;
    slug: string;
    title: string;
    type?: PageType;
    seo?: PageSeo;
  }): Promise<Result<Page, string>> {
    const existing = await this.pageRepo.findBySlug(input.slug);
    if (existing) {
      return err('برگه‌ای با این آدرس (slug) قبلاً ثبت شده است');
    }

    const page = Page.create({
      id: input.id || `page-${Date.now()}`,
      slug: input.slug,
      title: input.title,
      type: input.type || 'custom',
      seo: input.seo,
    });

    await this.pageRepo.save(page);
    return ok(page);
  }

  public async createVersion(input: {
    pageId: string;
    rows: RowLayout[];
    createdBy?: string;
  }): Promise<Result<PageVersion, string>> {
    const page = await this.pageRepo.findById(input.pageId);
    if (!page) {
      return err('برگه مورد نظر یافت نشد');
    }

    const existingVersions = await this.pageRepo.listVersions(input.pageId);
    const nextVersionNumber = existingVersions.length + 1;

    const version = PageVersion.create({
      id: `ver-${Date.now()}`,
      pageId: input.pageId,
      versionNumber: nextVersionNumber,
      rows: input.rows,
      createdBy: input.createdBy,
    });

    await this.pageRepo.saveVersion(version);
    return ok(version);
  }

  public async publishVersion(
    versionId: string,
  ): Promise<Result<PageVersion, string>> {
    const version = await this.pageRepo.findVersionById(versionId);
    if (!version) {
      return err('نسخه برگه یافت نشد');
    }

    const page = await this.pageRepo.findById(version.pageId);
    if (!page) {
      return err('برگه مرتبط یافت نشد');
    }

    version.publish();
    page.setPublishedVersion(version.id);

    await this.pageRepo.saveVersion(version);
    await this.pageRepo.save(page);

    return ok(version);
  }

  public async schedulePublish(
    versionId: string,
    publishDate: Date,
  ): Promise<Result<PageVersion, string>> {
    const version = await this.pageRepo.findVersionById(versionId);
    if (!version) {
      return err('نسخه برگه یافت نشد');
    }

    version.schedulePublish(publishDate);
    await this.pageRepo.saveVersion(version);

    return ok(version);
  }
}
