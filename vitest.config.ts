import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';
import path from 'path';

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
  // Safe fallback if zlib cannot be modified
}

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 20000,
    setupFiles: ['./tests/setup.ts'],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
          environment: 'node',
          setupFiles: ['./tests/setup.ts'],
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
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
    ],
  },
});
