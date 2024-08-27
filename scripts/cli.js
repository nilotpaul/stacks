#!/usr/bin/env node

const path = require('path');
const clack = require('@clack/prompts');
const degit = require('degit');

const REPO = 'https://github.com/nilotpaul/stacks';

async function main() {
  clack.intro('Create Pre-Configured Stack');

  const template = await clack.select({
    message: 'Which template would you like to use?',
    options: [
      {
        label: 'Hono + tRPC + Vite',
        value: 'hono-trpc-vite',
        hint: 'Use this when a mature web framework is needed',
      },
      {
        label: 'tRPC + Vite',
        value: 'trpc-vite-simple',
        hint: 'Use this for simplicity with basic http server',
      },
    ],
    initialValue: 'hono-trpc-vite',
  });

  if (clack.isCancel(template)) {
    clack.cancel('Operation Cancelled');
    process.exit(0);
  }

  const destPath = await clack.text({
    message: 'Enter project name',
    initialValue: template,
    defaultValue: template,
    placeholder: template,
    validate: (v) => {
      if (v?.length === 0) {
        return 'Choose a path';
      }
    },
  });

  if (clack.isCancel(destPath)) {
    clack.cancel('Operation Cancelled');
    process.exit(0);
  }

  const fullRepoPath = `${REPO}/templates/${template}`;

  const emitter = degit(fullRepoPath, {
    cache: false,
    force: true,
    verbose: true,
  });

  const spinner = clack.spinner();

  spinner.start('Setting everything up...');
  if (destPath === '.') {
    process.chdir(destPath);
    await emitter.clone(path.resolve('.'));
  } else {
    await emitter.clone(path.resolve(destPath));
  }
  spinner.stop();

  clack.log.info(destPath !== '.' ? `Run: cd ${template} && npm install` : 'Run: npm install');
  clack.outro('Happy Coding 😊');

  process.exit(0);
}

main().catch((err) => console.error(err));
