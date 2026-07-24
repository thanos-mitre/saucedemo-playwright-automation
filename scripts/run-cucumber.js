#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

function parseArgs(argv) {
  const normalizedArgs = [];
  let parallelCount = process.env.CUCUMBER_PARALLEL || process.env.PARALLEL || null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--parallel') {
      const nextValue = argv[index + 1];
      if (nextValue && !nextValue.startsWith('-')) {
        parallelCount = nextValue;
        index += 1;
      } else {
        parallelCount = parallelCount || '2';
      }
      continue;
    }

    if (arg.startsWith('--parallel=')) {
      parallelCount = arg.split('=')[1] || parallelCount || '2';
      continue;
    }

    normalizedArgs.push(arg);
  }

  return { normalizedArgs, parallelCount };
}

const { normalizedArgs, parallelCount } = parseArgs(process.argv.slice(2));
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const cucumberArgs = ['cucumber-js', ...normalizedArgs];

if (parallelCount) {
  cucumberArgs.push('--parallel', String(parallelCount));
}

const result = spawnSync(command, cucumberArgs, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: false,
});

process.exit(result.status === null ? 1 : result.status);
