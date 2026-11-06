const zlib = require('node:zlib');

if (!zlib.createZstdDecompress) {
  const { Transform } = require('node:stream');
  zlib.createZstdDecompress = function () {
    return new Transform({
      transform(chunk, _encoding, callback) {
        callback(null, chunk);
      },
    });
  };
}

if (!zlib.constants) {
  zlib.constants = {};
}

if (!zlib.constants.ZSTD_d_windowLogMax) {
  zlib.constants.ZSTD_d_windowLogMax = 23;
}
