import { describe, it, expect } from 'vitest';
import { sniffMimeType } from '@/modules/media/domain/mime-sniffer';

describe('sniffMimeType Unit Test', () => {
  it('detects a valid PNG header', () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const result = sniffMimeType(pngHeader);

    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe('image/png');
    expect(result?.extension).toBe('.png');
    expect(result?.isImage).toBe(true);
  });

  it('detects a valid JPEG header', () => {
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const result = sniffMimeType(jpegHeader);

    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe('image/jpeg');
    expect(result?.isImage).toBe(true);
  });

  it('detects a valid WebP header', () => {
    const webpHeader = Buffer.from([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const result = sniffMimeType(webpHeader);

    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe('image/webp');
    expect(result?.isImage).toBe(true);
  });

  it('detects a valid PDF header', () => {
    const pdfHeader = Buffer.from('%PDF-1.7\n%some data', 'utf-8');
    const result = sniffMimeType(pdfHeader);

    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe('application/pdf');
    expect(result?.isImage).toBe(false);
  });

  it('rejects an invalid or spoofed executable/HTML/text file', () => {
    const spoofedFile = Buffer.from('<html><script>alert(1)</script></html>', 'utf-8');
    const result = sniffMimeType(spoofedFile);

    expect(result).toBeNull();
  });

  it('rejects an empty or too short buffer', () => {
    const shortBuffer = Buffer.from([0x01, 0x02]);
    const result = sniffMimeType(shortBuffer);

    expect(result).toBeNull();
  });
});
