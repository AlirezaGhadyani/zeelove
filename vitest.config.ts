import * as zlib from 'node:zlib';
import { Transform } from 'node:stream';
import { defineConfig } from 'vitest/config';
import path from 'path';

const z = zlib as unknown as {
  createZstdDecompress?: () => Transform;
  constants?: Record<string, number>;
};

if (!z.createZstdDecompress) {
  z.createZstdDecompress = function () {
    return new Transform({
      transform(chunk, _encoding, callback) {
        callback(null, chunk);
      },
    });
  };
}

if (!z.constants) {
  z.constants = {};
}

if (!z.constants.ZSTD_d_windowLogMax) {
  z.constants.ZSTD_d_windowLogMax = 23;
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
