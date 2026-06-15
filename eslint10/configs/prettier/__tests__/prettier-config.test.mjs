import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import prettier, { prettierOptions } from '../index.mjs';
import prettierConfig from '../../../prettier-config.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-prettier-config-'));
  const sourceFile = path.join(root, 'sample.js');
  fs.writeFileSync(sourceFile, 'export const value = 1;\n');

  return {
    root,
    sourceFile
  };
}

test('prettier config enables eslint-plugin-prettier recommended config', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: prettier
  });

  const config = await eslint.calculateConfigForFile(fixture.sourceFile);

  assert.deepEqual(prettierOptions, prettierConfig);
  assert.ok(config.plugins.prettier);
  assert.deepEqual(config.rules['prettier/prettier'], [2, prettierOptions, {
    usePrettierrc: false
  }]);
  assert.equal(config.rules['arrow-body-style'][0], 0);
  assert.equal(config.rules['prefer-arrow-callback'][0], 0);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
