import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import common from '../index.mjs';

const commonConfigUrl = new URL('../index.mjs', import.meta.url);

function createFixture() {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-common-config-')));
  const sourceFile = path.join(root, 'sample.js');
  const polyvSourceFile = path.join(root, 'polyv-sample.js');
  fs.writeFileSync(sourceFile, [
    "import { value as first } from './dep.js';",
    "import { value as second } from './dep.js';",
    'new Promise((foo, bar) => {',
    '  foo(first + second);',
    '});',
    ''
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'dep.js'), 'export const value = 1;\n');
  fs.mkdirSync(path.join(root, 'interface'));
  fs.writeFileSync(path.join(root, 'interface', 'index.js'), 'export default 1;\n');
  fs.writeFileSync(polyvSourceFile, "import value from './interface';\nexport default value;\n");

  return {
    root,
    polyvSourceFile,
    sourceFile
  };
}

async function importCommonConfigForCwd(cwd) {
  const previousCwd = process.cwd();
  process.chdir(cwd);

  try {
    const module = await import(`${commonConfigUrl.href}?cwd=${encodeURIComponent(cwd)}&t=${Date.now()}`);
    return module.default;
  } finally {
    process.chdir(previousCwd);
  }
}

test('common config enables import-x promise and sonarjs recommended rules', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: common
  });

  const [result] = await eslint.lintFiles([fixture.sourceFile]);
  const ruleIds = result.messages.map((message) => message.ruleId);

  assert.ok(ruleIds.includes('import-x/no-duplicates'));
  assert.ok(ruleIds.includes('promise/param-names'));
  assert.ok(ruleIds.some((ruleId) => ruleId?.startsWith('sonarjs/')));

  const config = await eslint.calculateConfigForFile(fixture.sourceFile);
  assert.deepEqual(config.settings['import-x/resolver'].node.extensions, [
    '.js',
    '.cjs',
    '.mjs',
    '.jsx',
    '.ts',
    '.tsx',
    '.mts',
    '.cts',
    '.d.ts'
  ]);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('common config includes nested consumer project .gitignore files when they exist', async () => {
  const fixture = createFixture();
  const rootIgnoredFile = path.join(fixture.root, 'generated', 'ignored.js');
  const packageRoot = path.join(fixture.root, 'packages', 'demo');
  const nestedIgnoredFile = path.join(packageRoot, 'lib', 'ignored.js');
  const skippedGitignoreFile = path.join(fixture.root, 'node_modules', 'demo', '.gitignore');

  fs.mkdirSync(path.dirname(rootIgnoredFile), { recursive: true });
  fs.mkdirSync(path.dirname(nestedIgnoredFile), { recursive: true });
  fs.mkdirSync(path.dirname(skippedGitignoreFile), { recursive: true });
  fs.writeFileSync(rootIgnoredFile, 'export const ignored = true;\n');
  fs.writeFileSync(nestedIgnoredFile, 'export const ignored = true;\n');
  fs.writeFileSync(skippedGitignoreFile, '*.js\n');
  fs.writeFileSync(path.join(fixture.root, '.gitignore'), 'generated/**\n');
  fs.writeFileSync(path.join(packageRoot, '.gitignore'), 'lib/**\n');

  const commonForFixture = await importCommonConfigForCwd(fixture.root);
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: commonForFixture
  });

  assert.equal(await eslint.isPathIgnored(rootIgnoredFile), true);
  assert.equal(await eslint.isPathIgnored(nestedIgnoredFile), true);
  assert.equal(commonForFixture.some((config) => config.basePath === path.dirname(skippedGitignoreFile)), false);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('common config registers polyv plugin', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      {
        rules: {
          // 验证 common 已注册 polyv 插件，消费方可以直接启用 polyv/* 规则。
          'polyv/no-relative-directory-index-imports': 'error'
        }
      }
    ]
  });

  const [result] = await eslint.lintFiles([fixture.polyvSourceFile]);
  const ruleIds = result.messages.map((message) => message.ruleId);
  const config = await eslint.calculateConfigForFile(fixture.polyvSourceFile);

  assert.ok(config.plugins.polyv.rules['explicit-module-boundary-types']);
  assert.ok(ruleIds.includes('polyv/no-relative-directory-index-imports'));

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
