import { createRequire } from 'node:module';

try {
  const require = createRequire(import.meta.url);
  const zlib = require('node:zlib');
  if (typeof zlib.createZstdDecompress !== 'function') {
    const { Transform } = require('node:stream');
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
  if (!zlib.constants) zlib.constants = {};
  if (!zlib.constants.ZSTD_d_windowLogMax) zlib.constants.ZSTD_d_windowLogMax = 23;
} catch {
  // Safe fallback
}
