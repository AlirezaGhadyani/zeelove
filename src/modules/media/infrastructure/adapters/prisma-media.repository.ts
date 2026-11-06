import type { PrismaClient } from '@prisma/client';
import type {
  MediaRepositoryPort,
  ListMediaFilter,
  ListMediaResult,
} from '../../application/ports/media.repository.port';
import { Media } from '../../domain/media.entity';

export class PrismaMediaRepository implements MediaRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<Media | null> {
    const record = await this.prisma.media.findUnique({ where: { id } });
    if (!record) return null;
    return new Media(record);
  }

  public async create(media: Media): Promise<void> {
    await this.prisma.media.create({
      data: {
        id: media.id,
        filename: media.filename,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: media.size,
        width: media.width,
        height: media.height,
        altText: media.altText,
        folder: media.folder,
        url: media.url,
        thumbnailUrl: media.thumbnailUrl,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.media.delete({ where: { id } });
  }

  public async findMany(filter: ListMediaFilter): Promise<ListMediaResult> {
    const page = Math.max(1, filter.page ?? 1);
    const perPage = Math.min(100, Math.max(1, filter.perPage ?? 24));
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {};
    if (filter.folder && filter.folder !== 'all') {
      where.folder = filter.folder;
    }
    if (filter.search) {
      where.OR = [
        { originalName: { contains: filter.search, mode: 'insensitive' } },
        { altText: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [total, records, distinctFolders] = await Promise.all([
      this.prisma.media.count({ where }),
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.media.findMany({
        distinct: ['folder'],
        select: { folder: true },
      }),
    ]);

    type PrismaMediaRecord = {
      id: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      width: number | null;
      height: number | null;
      altText: string | null;
      folder: string;
      url: string;
      thumbnailUrl: string | null;
      createdAt: Date;
      updatedAt: Date;
    };

    const items = (records as PrismaMediaRecord[]).map((r) => new Media(r));
    const folders = (distinctFolders as Array<{ folder: string }>).map((f) => f.folder);

    return { items, total, folders };
  }
}
