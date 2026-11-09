import { describe, it, expect } from 'vitest';
import { Page } from '@/modules/content/domain/entities/page.entity';
import { PageVersion } from '@/modules/content/domain/entities/page-version.entity';

describe('Page & PageVersion Domain Aggregates', () => {
  it('creates a Page aggregate root with initial state', () => {
    const page = Page.create({
      id: 'p-1',
      slug: 'landing-autumn',
      title: 'کمپین پاییزه زیلاو',
      type: 'landing',
      seo: {
        metaTitle: 'پاییز با زیلاو',
        metaDescription: 'کالکشن جدید پاییزه',
      },
    });

    expect(page.id).toBe('p-1');
    expect(page.slug).toBe('landing-autumn');
    expect(page.type).toBe('landing');
    expect(page.publishedVersionId).toBeUndefined();

    page.setPublishedVersion('ver-1');
    expect(page.publishedVersionId).toBe('ver-1');
  });

  it('handles draft, publish, and unpublish lifecycle on PageVersion', () => {
    const version = PageVersion.create({
      id: 'ver-100',
      pageId: 'p-1',
      versionNumber: 1,
      rows: [],
    });

    expect(version.status).toBe('draft');
    expect(version.isCurrentlyActive()).toBe(false);

    version.publish();
    expect(version.status).toBe('published');
    expect(version.publishedAt).toBeInstanceOf(Date);
    expect(version.isCurrentlyActive()).toBe(true);

    version.unpublish();
    expect(version.status).toBe('draft');
    expect(version.publishedAt).toBeNull();
    expect(version.isCurrentlyActive()).toBe(false);
  });

  it('evaluates scheduled publishing correctly based on current time', () => {
    const baseTime = Date.now();
    const now = new Date(baseTime);
    const futureDate = new Date(baseTime + 5 * 24 * 60 * 60 * 1000);

    const version = PageVersion.create({
      id: 'ver-200',
      pageId: 'p-1',
      versionNumber: 2,
      rows: [],
    });

    version.schedulePublish(futureDate, now);
    expect(version.scheduledPublishAt).toEqual(futureDate);
    // Before futureDate, it is not active
    expect(version.isCurrentlyActive(now)).toBe(false);

    // After futureDate, it is active
    const afterPublish = new Date(baseTime + 6 * 24 * 60 * 60 * 1000);
    expect(version.isCurrentlyActive(afterPublish)).toBe(true);

    // If scheduled unpublish has passed, it is no longer active
    version.scheduleUnpublish(new Date(baseTime + 7 * 24 * 60 * 60 * 1000));
    const afterUnpublish = new Date(baseTime + 8 * 24 * 60 * 60 * 1000);
    expect(version.isCurrentlyActive(afterUnpublish)).toBe(false);
  });

  it('prevents modifying rows on an archived version', () => {
    const version = PageVersion.create({
      id: 'ver-300',
      pageId: 'p-1',
      versionNumber: 3,
      rows: [],
    });

    version.archive();
    expect(version.status).toBe('archived');
    expect(version.isCurrentlyActive()).toBe(false);

    expect(() => version.updateRows([])).toThrow('ویرایش نسخه بایگانی شده مجاز نیست');
  });
});
