import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /\bml-[0-9a-zA-Z_[\]]+/g,
  /\bmr-[0-9a-zA-Z_[\]]+/g,
  /\bpl-[0-9a-zA-Z_[\]]+/g,
  /\bpr-[0-9a-zA-Z_[\]]+/g,
  /\bleft-[0-9a-zA-Z_[\]]+/g,
  /\bright-[0-9a-zA-Z_[\]]+/g,
  /\btext-left\b/g,
  /\btext-right\b/g,
  /\bborder-l-[0-9a-zA-Z_[\]]+/g,
  /\bborder-r-[0-9a-zA-Z_[\]]+/g,
  /\brounded-l-[0-9a-zA-Z_[\]]+/g,
  /\brounded-r-[0-9a-zA-Z_[\]]+/g,
];

let hasErrors = false;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.next-dev') {
        scanDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      FORBIDDEN_PATTERNS.forEach((pattern) => {
        const matches = content.match(pattern);
        if (matches) {
          console.error(
            `RTL violation in ${fullPath}: forbidden non-logical classes: ${matches.join(', ')}`,
          );
          hasErrors = true;
        }
      });
    }
  }
}

scanDir('src');

if (hasErrors) {
  console.error(
    '\nUse logical classes (ms-*, me-*, ps-*, pe-*, start-*, end-*, text-start, border-s-*, etc.)',
  );
  process.exit(1);
} else {
  console.log('RTL logical properties check passed: 0 forbidden directional classes found.');
}
