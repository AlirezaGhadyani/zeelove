import type { PrismaClient } from '@prisma/client';
import type { StoragePort } from '../ports/storage.port';

export class DeleteMediaUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly prisma: PrismaClient
  ) {}

  public async execute(id: string): Promise<boolean> {
    const record = await this.prisma.media.findUnique({ where: { id } });
    if (!record) return false;

    await this.storage.delete(record.filename);
    if (record.thumbnailUrl) {
      const thumbFilename = record.filename.replace('.webp', '-thumb.webp');
      await this.storage.delete(thumbFilename);
    }

    await this.prisma.media.delete({ where: { id } });
    return true;
  }
}
