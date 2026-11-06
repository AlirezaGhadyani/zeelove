const zlib = require('node:zlib');
let zlibBare;
try {
  zlibBare = require('zlib');
} catch {
  // Ignore if bare import is unavailable
}

function applyPolyfill(target) {
  if (!target) return;
  const { Transform } = require('node:stream');

  if (typeof target.createZstdDecompress !== 'function') {
    target.createZstdDecompress = function () {
      return new Transform({
        transform(chunk, _encoding, callback) {
          callback(null, chunk);
        },
      });
    };
  }

  if (typeof target.createZstdCompress !== 'function') {
    target.createZstdCompress = function () {
      return new Transform({
        transform(chunk, _encoding, callback) {
          callback(null, chunk);
        },
      });
    };
  }

  if (typeof target.zstdDecompressSync !== 'function') {
    target.zstdDecompressSync = function (buf) {
      return buf;
    };
  }

  if (typeof target.zstdCompressSync !== 'function') {
    target.zstdCompressSync = function (buf) {
      return buf;
    };
  }

  if (!target.constants) {
    target.constants = {};
  }

  if (!target.constants.ZSTD_d_windowLogMax) {
    target.constants.ZSTD_d_windowLogMax = 23;
  }
}

applyPolyfill(zlib);
if (zlibBare && zlibBare !== zlib) {
  applyPolyfill(zlibBare);
}
