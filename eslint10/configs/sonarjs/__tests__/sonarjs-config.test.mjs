import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import sonarjs from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-sonarjs-config-'));
  const sourceFile = path.join(root, 'sample.js');
  fs.writeFileSync(sourceFile, 'export const value = 1;\n');

  return {
    root,
    sourceFile
  };
}

function assertRuleOff(config, ruleName) {
  assert.equal(config.rules[ruleName][0], 0);
}

test('sonarjs config enables recommended rules and migrated overrides', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: sonarjs
  });

  const config = await eslint.calculateConfigForFile(fixture.sourceFile);

  assert.ok(config.rules['sonarjs/no-identical-expressions']);
  assert.deepEqual(config.rules['sonarjs/cognitive-complexity'], [2, 20]);
  assertRuleOff(config, 'sonarjs/no-clear-text-protocols');
  assertRuleOff(config, 'sonarjs/no-commented-code');
  assertRuleOff(config, 'sonarjs/no-collection-size-mischeck');
  assertRuleOff(config, 'sonarjs/no-duplicate-string');
  assertRuleOff(config, 'sonarjs/no-hardcoded-ip');
  assertRuleOff(config, 'sonarjs/no-ignored-exceptions');
  assertRuleOff(config, 'sonarjs/no-invariant-returns');
  assertRuleOff(config, 'sonarjs/no-os-command-from-path');
  assertRuleOff(config, 'sonarjs/prefer-single-boolean-return');
  assertRuleOff(config, 'sonarjs/pseudo-random');
  assertRuleOff(config, 'sonarjs/redundant-type-aliases');
  assertRuleOff(config, 'sonarjs/slow-regex');
  assertRuleOff(config, 'sonarjs/todo-tag');

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
