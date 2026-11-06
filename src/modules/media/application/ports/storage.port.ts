export interface StoragePort {
  save(filename: string, buffer: Buffer, mimeType: string): Promise<string>;
  delete(filename: string): Promise<void>;
  getUrl(filename: string): string;
}
