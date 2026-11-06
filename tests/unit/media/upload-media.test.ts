import { describe, it, expect } from 'vitest';
import {
  UploadMediaUseCase,
  MAX_MEDIA_SIZE_BYTES,
} from '@/modules/media/application/use-cases/upload-media.use-case';
import type { StoragePort } from '@/modules/media/application/ports/storage.port';
import type {
  MediaRepositoryPort,
  ListMediaResult,
} from '@/modules/media/application/ports/media.repository.port';
import type { Media } from '@/modules/media/domain/media.entity';

class FakeStorage implements StoragePort {
  async save(filename: string): Promise<string> {
    return `/media/${filename}`;
  }
  async delete(): Promise<void> {}
  async get(): Promise<Buffer | null> {
    return null;
  }
  getUrl(filename: string): string {
    return `/media/${filename}`;
  }
}

class FakeMediaRepo implements MediaRepositoryPort {
  public items: Media[] = [];
  async findById(): Promise<Media | null> {
    return null;
  }
  async create(media: Media): Promise<void> {
    this.items.push(media);
  }
  async delete(): Promise<void> {}
  async findMany(): Promise<ListMediaResult> {
    return { items: [], total: 0, folders: [] };
  }
}

describe('UploadMediaUseCase Hardening Tests', () => {
  const storage = new FakeStorage();
  const repo = new FakeMediaRepo();
  const useCase = new UploadMediaUseCase(storage, repo);

  it('rejects files larger than 15MB limit', async () => {
    const oversized = Buffer.alloc(MAX_MEDIA_SIZE_BYTES + 1024);
    await expect(
      useCase.execute({
        fileBuffer: oversized,
        originalName: 'large.png',
        mimeType: 'image/png',
      }),
    ).rejects.toThrow('حجم فایل بیش از حد مجاز');
  });

  it('rejects files with invalid or spoofed MIME magic bytes', async () => {
    const fakeBuffer = Buffer.from('NOT_AN_IMAGE_OR_PDF');
    await expect(
      useCase.execute({
        fileBuffer: fakeBuffer,
        originalName: 'fake.png',
        mimeType: 'image/png',
      }),
    ).rejects.toThrow('فرمت فایل نامعتبر');
  });

  it('accepts and processes valid PDF document within size limit', async () => {
    const pdfBuffer = Buffer.from('%PDF-1.4 sample content');
    const media = await useCase.execute({
      fileBuffer: pdfBuffer,
      originalName: 'doc.pdf',
      mimeType: 'application/pdf',
      folder: 'legal/../hack',
    });

    expect(media.id).toBeDefined();
    expect(media.mimeType).toBe('application/pdf');
    expect(media.folder).toBe('legalhack');
  });
});
