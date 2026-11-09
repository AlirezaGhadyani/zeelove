import type { PageVersionStatus, RowLayout } from '../types/page-builder.types';

export interface PageVersionProps {
  id: string;
  pageId: string;
  versionNumber: number;
  status: PageVersionStatus;
  rows: RowLayout[];
  scheduledPublishAt?: Date | null;
  scheduledUnpublishAt?: Date | null;
  publishedAt?: Date | null;
  createdBy?: string | null;
  createdAt?: Date;
}

export class PageVersion {
  private constructor(private readonly props: PageVersionProps) {}

  public static create(
    props: Omit<PageVersionProps, 'status' | 'createdAt' | 'publishedAt'> & {
      status?: PageVersionStatus;
    },
  ): PageVersion {
    return new PageVersion({
      ...props,
      status: props.status ?? 'draft',
      createdAt: new Date(),
    });
  }

  public static reconstitute(props: PageVersionProps): PageVersion {
    return new PageVersion(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get pageId(): string {
    return this.props.pageId;
  }

  public get versionNumber(): number {
    return this.props.versionNumber;
  }

  public get status(): PageVersionStatus {
    return this.props.status;
  }

  public get rows(): RowLayout[] {
    return this.props.rows;
  }

  public get scheduledPublishAt(): Date | null | undefined {
    return this.props.scheduledPublishAt;
  }

  public get scheduledUnpublishAt(): Date | null | undefined {
    return this.props.scheduledUnpublishAt;
  }

  public get publishedAt(): Date | null | undefined {
    return this.props.publishedAt;
  }

  public get createdBy(): string | null | undefined {
    return this.props.createdBy;
  }

  public get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  public updateRows(rows: RowLayout[]): void {
    if (this.props.status === 'archived') {
      throw new Error('ویرایش نسخه بایگانی شده مجاز نیست');
    }
    this.props.rows = rows;
  }

  public publish(now: Date = new Date()): void {
    this.props.status = 'published';
    this.props.publishedAt = now;
    this.props.scheduledPublishAt = null;
  }

  public schedulePublish(date: Date, now: Date = new Date()): void {
    if (date.getTime() <= now.getTime()) {
      this.publish(now);
      return;
    }
    this.props.scheduledPublishAt = date;
  }

  public scheduleUnpublish(date: Date): void {
    this.props.scheduledUnpublishAt = date;
  }

  public unpublish(): void {
    this.props.status = 'draft';
    this.props.publishedAt = null;
    this.props.scheduledPublishAt = null;
  }

  public archive(): void {
    this.props.status = 'archived';
  }

  public isCurrentlyActive(now: Date = new Date()): boolean {
    if (this.props.status === 'archived') return false;

    if (this.props.status === 'published') {
      if (this.props.scheduledUnpublishAt && now >= this.props.scheduledUnpublishAt) {
        return false;
      }
      return true;
    }

    if (this.props.scheduledPublishAt && now >= this.props.scheduledPublishAt) {
      if (this.props.scheduledUnpublishAt && now >= this.props.scheduledUnpublishAt) {
        return false;
      }
      return true;
    }

    return false;
  }

  public toJSON(): PageVersionProps {
    return { ...this.props };
  }
}
