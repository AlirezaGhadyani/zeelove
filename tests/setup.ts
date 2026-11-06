import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    // Ignore error
  }
}

if (typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(path.resolve(process.cwd(), '.env.local')); } catch {}
  try { process.loadEnvFile(path.resolve(process.cwd(), '.env')); } catch {}
} else {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'));
  loadEnvFile(path.resolve(process.cwd(), '.env'));
}

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
