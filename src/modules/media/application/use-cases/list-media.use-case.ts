import type { PrismaClient } from '@prisma/client';
import { Media } from '../../domain/media.entity';

export interface ListMediaInput {
  folder?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export class ListMediaUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  public async execute(
    input: ListMediaInput
  ): Promise<{ items: Media[]; total: number; folders: string[] }> {
    const page = Math.max(1, input.page ?? 1);
    const perPage = Math.min(100, Math.max(1, input.perPage ?? 24));
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {};
    if (input.folder && input.folder !== 'all') {
      where.folder = input.folder;
    }
    if (input.search) {
      where.OR = [
        { originalName: { contains: input.search, mode: 'insensitive' } },
        { altText: { contains: input.search, mode: 'insensitive' } },
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

    const items = records.map((r) => new Media(r));
    const folders = distinctFolders.map((f) => f.folder);

    return { items, total, folders };
  }
}
