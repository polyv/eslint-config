import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import importx from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-importx-config-'));
  const sourceFile = path.join(root, 'sample.js');
  const eslintConfigFile = path.join(root, 'eslint.config.mjs');
  fs.writeFileSync(sourceFile, 'export const value = 1;\n');
  fs.writeFileSync(eslintConfigFile, 'export default [];\n');

  return {
    eslintConfigFile,
    root,
    sourceFile
  };
}

test('importx config enables recommended rules and node resolver extensions', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: importx
  });

  const config = await eslint.calculateConfigForFile(fixture.sourceFile);

  assert.ok(config.rules['import-x/no-duplicates']);
  assert.deepEqual(config.rules['import-x/no-absolute-path'], [2, {
    esmodule: true,
    commonjs: true,
    amd: false
  }]);
  assert.deepEqual(config.rules['import-x/no-unresolved'], [0]);
  assert.deepEqual(config.rules['import-x/no-webpack-loader-syntax'], [2]);
  assert.deepEqual(config.settings['import-x/ignore'], ['vite-plugin-dts']);
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

  const eslintConfig = await eslint.calculateConfigForFile(fixture.eslintConfigFile);
  assert.deepEqual(eslintConfig.rules['import-x/no-named-as-default-member'], [0]);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
