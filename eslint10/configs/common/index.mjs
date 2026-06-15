import fs from 'node:fs';
import path from 'node:path';
import { includeIgnoreFile } from 'eslint/config';
import promisePlugin from 'eslint-plugin-promise';
import importx from '../importx/index.mjs';
import sonarjs from '../sonarjs/index.mjs';
import polyvPlugin from '../../plugin.mjs';

const skippedGitignoreSearchDirectories = new Set([
  '.git',
  'node_modules',
  'dest',
  'dist',
  '.dist',
  'coverage'
]);

function findGitignoreFiles(root) {
  const gitignoreFiles = [];
  const pendingDirectories = [root];

  while (pendingDirectories.length > 0) {
    const directory = pendingDirectories.pop();

    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isFile() && entry.name === '.gitignore') {
        gitignoreFiles.push(entryPath);
        continue;
      }

      if (entry.isDirectory() && !skippedGitignoreSearchDirectories.has(entry.name)) {
        pendingDirectories.push(entryPath);
      }
    }
  }

  return gitignoreFiles;
}

const consumerRoot = fs.realpathSync(process.cwd());
const consumerGitignorePaths = findGitignoreFiles(consumerRoot);
const consumerGitignoreConfig = consumerGitignorePaths.length > 0
  ? includeIgnoreFile(consumerGitignorePaths, {
      // 读取消费项目内的 .gitignore，让未提交到 git 的产物文件也进入 ESLint 忽略范围。
      gitignoreResolution: true,
      name: 'polyv/consumer-gitignore'
    })
  : [];

export default [
  ...consumerGitignoreConfig,
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      'dest/**',
      '**/dest/**',
      'dist/**',
      '**/dist/**',
      '.dist/**',
      '**/.dist/**',
      'coverage/**',
      'pnpm-lock.yaml',
      'package-lock.json'
    ]
  },
  {
    plugins: {
      // 注册 Polyv 自定义规则插件，供各场景配置按需启用 polyv/* 规则。
      polyv: polyvPlugin
    }
  },
  ...importx,
  // 启用 promise 推荐规则，检查 Promise 常见错误写法。
  promisePlugin.configs['flat/recommended'],
  ...sonarjs
];
