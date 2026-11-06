import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import type { PrismaClient } from '@prisma/client';
import type { StoragePort } from '../ports/storage.port';
import { Media } from '../../domain/media.entity';

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
    private readonly prisma: PrismaClient
  ) {}

  public async execute(input: UploadMediaInput): Promise<Media> {
    const isImage = input.mimeType.startsWith('image/');
    const fileId = randomUUID();
    let finalBuffer = input.fileBuffer;
    let finalMime = input.mimeType;
    let filename = `${fileId}-${input.originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;

    if (isImage) {
      filename = `${fileId}.webp`;
      finalMime = 'image/webp';

      const imageInstance = sharp(input.fileBuffer);
      const metadata = await imageInstance.metadata();
      width = metadata.width;
      height = metadata.height;

      finalBuffer = await sharp(input.fileBuffer)
        .webp({ quality: 85 })
        .toBuffer();

      // Generate 300px thumbnail
      const thumbBuffer = await sharp(input.fileBuffer)
        .resize({ width: 300, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const thumbFilename = `${fileId}-thumb.webp`;
      thumbnailUrl = await this.storage.save(thumbFilename, thumbBuffer, 'image/webp');
    }

    const url = await this.storage.save(filename, finalBuffer, finalMime);
    const folder = input.folder || 'general';

    const record = await this.prisma.media.create({
      data: {
        id: fileId,
        filename,
        originalName: input.originalName,
        mimeType: finalMime,
        size: finalBuffer.length,
        width,
        height,
        altText: input.altText,
        folder,
        url,
        thumbnailUrl,
      },
    });

    return new Media({
      id: record.id,
      filename: record.filename,
      originalName: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
      width: record.width,
      height: record.height,
      altText: record.altText,
      folder: record.folder,
      url: record.url,
      thumbnailUrl: record.thumbnailUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
