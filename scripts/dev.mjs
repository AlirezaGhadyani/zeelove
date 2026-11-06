#!/usr/bin/env node
import { spawn } from 'node:child_process';

const rawArgs = process.argv.slice(2);
const cleanArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (!arg) continue;

  if (arg === '--host') {
    // Map --host [value] to --hostname [value]
    if (i + 1 < rawArgs.length && !rawArgs[i + 1]?.startsWith('-')) {
      cleanArgs.push('--hostname', rawArgs[i + 1]);
      i++;
    } else {
      cleanArgs.push('--hostname', '0.0.0.0');
    }
  } else if (arg.startsWith('--host=')) {
    const val = arg.split('=')[1] || '0.0.0.0';
    cleanArgs.push('--hostname', val);
  } else {
    cleanArgs.push(arg);
  }
}

if (!cleanArgs.includes('--hostname') && !cleanArgs.includes('-H')) {
  cleanArgs.push('--hostname', '0.0.0.0');
}
if (!cleanArgs.includes('--port') && !cleanArgs.includes('-p')) {
  cleanArgs.push('--port', '3000');
}

import path from 'node:path';

const nextBin = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, 'dev', ...cleanArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
