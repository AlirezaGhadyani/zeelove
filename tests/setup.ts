import zlib from 'node:zlib';
import { Transform } from 'node:stream';

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
