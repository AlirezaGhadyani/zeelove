import { createRequire } from 'node:module';

try {
  const require = createRequire(import.meta.url);
  const zlib = require('node:zlib');
  const { Transform } = require('node:stream');

  if (typeof zlib.createZstdDecompress !== 'function') {
    zlib.createZstdDecompress = function () {
      return new Transform({
        transform(
          chunk: unknown,
          _encoding: unknown,
          callback: (err?: Error | null, data?: unknown) => void,
        ) {
          callback(null, chunk);
        },
      });
    };
  }

  if (typeof zlib.createZstdCompress !== 'function') {
    zlib.createZstdCompress = function () {
      return new Transform({
        transform(
          chunk: unknown,
          _encoding: unknown,
          callback: (err?: Error | null, data?: unknown) => void,
        ) {
          callback(null, chunk);
        },
      });
    };
  }

  if (typeof zlib.zstdDecompressSync !== 'function') {
    zlib.zstdDecompressSync = function (buf: unknown) {
      return buf;
    };
  }

  if (typeof zlib.zstdCompressSync !== 'function') {
    zlib.zstdCompressSync = function (buf: unknown) {
      return buf;
    };
  }

  if (!zlib.constants) zlib.constants = {};
  if (!zlib.constants.ZSTD_d_windowLogMax) zlib.constants.ZSTD_d_windowLogMax = 23;
} catch {
  // Safe fallback
}
