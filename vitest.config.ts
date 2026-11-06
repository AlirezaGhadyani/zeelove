import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';
import path from 'path';

const polyfillPath = path.resolve(__dirname, './scripts/polyfill-zstd.cjs').replace(/\\/g, '/');

// Propagate polyfill to child processes via NODE_OPTIONS
const requireFlag = `--require "${polyfillPath}"`;
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('polyfill-zstd')) {
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} ${requireFlag}`
    : requireFlag;
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
  // Safe fallback if zlib cannot be modified
}

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 20000,
    setupFiles: ['./tests/setup.ts'],
    execArgv: ['--require', polyfillPath],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
          environment: 'node',
          setupFiles: ['./tests/setup.ts'],
          execArgv: ['--require', polyfillPath],
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          environment: 'node',
          testTimeout: 20000,
          setupFiles: ['./tests/setup.ts'],
          execArgv: ['--require', polyfillPath],
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
    ],
  },
});
