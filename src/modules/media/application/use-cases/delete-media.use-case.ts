import type { StoragePort } from '../ports/storage.port';
import type { MediaRepositoryPort } from '../ports/media.repository.port';

export class DeleteMediaUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly mediaRepo: MediaRepositoryPort,
  ) {}

  public async execute(id: string): Promise<boolean> {
    const record = await this.mediaRepo.findById(id);
    if (!record) return false;

    await this.storage.delete(record.filename);
    if (record.thumbnailUrl) {
      const thumbFilename = record.filename.replace('.webp', '-thumb.webp');
      await this.storage.delete(thumbFilename);
    }

    await this.mediaRepo.delete(id);
    return true;
  }
}
