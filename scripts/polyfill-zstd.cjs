const fs = require('node:fs');
const path = require('node:path');

function loadEnvFile(filePath) {
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

loadEnvFile(path.resolve(process.cwd(), '.env.local'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

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
