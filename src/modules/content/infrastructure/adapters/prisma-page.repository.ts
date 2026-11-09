import type { PrismaClient } from '@prisma/client';
import type { PageRepositoryPort } from '../../application/ports/page.repository.port';
import { Page } from '../../domain/entities/page.entity';
import { PageVersion } from '../../domain/entities/page-version.entity';
import type { PageType, RowLayout, PageSeo } from '../../domain/types/page-builder.types';

export class PrismaPageRepository implements PageRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findBySlug(slug: string): Promise<Page | null> {
    const rec = await this.prisma.cmsPage.findUnique({
      where: { slug },
    });
    if (!rec) return null;
    return this.mapToPage(rec);
  }

  public async findByType(type: PageType): Promise<Page | null> {
    const rec = await this.prisma.cmsPage.findFirst({
      where: {
        OR: [{ type: type.toUpperCase() }, { type: type.toLowerCase() }],
      },
    });
    if (!rec) return null;
    return this.mapToPage(rec);
  }

  public async findById(id: string): Promise<Page | null> {
    const rec = await this.prisma.cmsPage.findUnique({
      where: { id },
    });
    if (!rec) return null;
    return this.mapToPage(rec);
  }

  public async save(page: Page): Promise<void> {
    await this.prisma.cmsPage.upsert({
      where: { id: page.id },
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        type: page.type.toUpperCase(),
        seo: (page.seo as any) || undefined,
        publishedVersionId: page.publishedVersionId || undefined,
      },
      update: {
        slug: page.slug,
        title: page.title,
        type: page.type.toUpperCase(),
        seo: (page.seo as any) || undefined,
        publishedVersionId: page.publishedVersionId || undefined,
      },
    });
  }

  public async saveVersion(version: PageVersion): Promise<void> {
    await this.prisma.cmsPageVersion.upsert({
      where: { id: version.id },
      create: {
        id: version.id,
        pageId: version.pageId,
        versionNumber: version.versionNumber,
        status: version.status.toUpperCase(),
        rows: (version.rows as any) || [],
        scheduledPublishAt: version.scheduledPublishAt || null,
        scheduledUnpublishAt: version.scheduledUnpublishAt || null,
        publishedAt: version.publishedAt || null,
        createdBy: version.createdBy || null,
      },
      update: {
        status: version.status.toUpperCase(),
        rows: (version.rows as any) || [],
        scheduledPublishAt: version.scheduledPublishAt || null,
        scheduledUnpublishAt: version.scheduledUnpublishAt || null,
        publishedAt: version.publishedAt || null,
      },
    });
  }

  public async findVersionById(id: string): Promise<PageVersion | null> {
    const rec = await this.prisma.cmsPageVersion.findUnique({
      where: { id },
    });
    if (!rec) return null;
    return this.mapToVersion(rec);
  }

  public async findActiveVersion(pageId: string): Promise<PageVersion | null> {
    const now = new Date();
    const versions = await this.prisma.cmsPageVersion.findMany({
      where: { pageId },
      orderBy: { versionNumber: 'desc' },
    });

    for (const v of versions) {
      const entity = this.mapToVersion(v);
      if (entity.isCurrentlyActive(now)) {
        return entity;
      }
    }
    return null;
  }

  public async listVersions(pageId: string): Promise<PageVersion[]> {
    const records = await this.prisma.cmsPageVersion.findMany({
      where: { pageId },
      orderBy: { versionNumber: 'asc' },
    });
    return records.map((r) => this.mapToVersion(r));
  }

  private mapToPage(r: any): Page {
    return Page.reconstitute({
      id: r.id,
      slug: r.slug,
      title: r.title,
      type: r.type.toLowerCase() as PageType,
      seo: (r.seo as PageSeo) || undefined,
      publishedVersionId: r.publishedVersionId || null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  private mapToVersion(r: any): PageVersion {
    return PageVersion.reconstitute({
      id: r.id,
      pageId: r.pageId,
      versionNumber: r.versionNumber,
      status: r.status.toLowerCase() as any,
      rows: (r.rows as RowLayout[]) || [],
      scheduledPublishAt: r.scheduledPublishAt,
      scheduledUnpublishAt: r.scheduledUnpublishAt,
      publishedAt: r.publishedAt,
      createdBy: r.createdBy,
      createdAt: r.createdAt,
    });
  }
}
