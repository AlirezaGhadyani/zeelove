import type { Page } from '../../domain/entities/page.entity';
import type { PageVersion } from '../../domain/entities/page-version.entity';
import type { PageType } from '../../domain/types/page-builder.types';

export interface PageRepositoryPort {
  findBySlug(slug: string): Promise<Page | null>;
  findByType(type: PageType): Promise<Page | null>;
  findById(id: string): Promise<Page | null>;
  save(page: Page): Promise<void>;
  saveVersion(version: PageVersion): Promise<void>;
  findVersionById(id: string): Promise<PageVersion | null>;
  findActiveVersion(pageId: string): Promise<PageVersion | null>;
  listVersions(pageId: string): Promise<PageVersion[]>;
}
