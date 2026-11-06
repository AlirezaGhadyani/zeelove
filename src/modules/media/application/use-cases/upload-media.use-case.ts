import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import type { StoragePort } from '../ports/storage.port';
import type { MediaRepositoryPort } from '../ports/media.repository.port';
import { Media } from '../../domain/media.entity';
import { sniffMimeType } from '../../domain/mime-sniffer';

export interface UploadMediaInput {
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
  altText?: string;
}

export class UploadMediaUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly mediaRepo: MediaRepositoryPort
  ) {}

  public async execute(input: UploadMediaInput): Promise<Media> {
    const sniffed = sniffMimeType(input.fileBuffer);
    if (!sniffed) {
      throw new Error('فرمت فایل نامعتبر یا پشتیبانی نشده است.');
    }

    const fileId = randomUUID();
    let finalBuffer = input.fileBuffer;
    let finalMime = sniffed.mimeType;
    let filename = `${fileId}-${input.originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;

    if (sniffed.isImage) {
      filename = `${fileId}.webp`;
      finalMime = 'image/webp';

      const imageInstance = sharp(input.fileBuffer);
      const metadata = await imageInstance.metadata();
      width = metadata.width;
      height = metadata.height;

      finalBuffer = await sharp(input.fileBuffer)
        .webp({ quality: 85 })
        .toBuffer();

      const thumbBuffer = await sharp(input.fileBuffer)
        .resize({ width: 300, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const thumbFilename = `${fileId}-thumb.webp`;
      thumbnailUrl = await this.storage.save(thumbFilename, thumbBuffer, 'image/webp');
    }

    const url = await this.storage.save(filename, finalBuffer, finalMime);
    const folder = input.folder || 'general';
    const now = new Date();

    const media = new Media({
      id: fileId,
      filename,
      originalName: input.originalName,
      mimeType: finalMime,
      size: finalBuffer.length,
      width: width ?? null,
      height: height ?? null,
      altText: input.altText ?? null,
      folder,
      url,
      thumbnailUrl: thumbnailUrl ?? null,
      createdAt: now,
      updatedAt: now,
    });

    await this.mediaRepo.create(media);
    return media;
  }
}
