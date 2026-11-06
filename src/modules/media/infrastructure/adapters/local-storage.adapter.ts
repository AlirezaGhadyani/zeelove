import fs from 'node:fs/promises';
import path from 'node:path';
import type { StoragePort } from '../../application/ports/storage.port';

export class LocalStorageAdapter implements StoragePort {
  private readonly uploadDir: string;

  constructor(baseDir?: string) {
    this.uploadDir = baseDir ?? path.join(process.cwd(), 'public', 'uploads');
  }

  public async save(filename: string, buffer: Buffer): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    return this.getUrl(filename);
  }

  public async delete(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }

  public getUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
