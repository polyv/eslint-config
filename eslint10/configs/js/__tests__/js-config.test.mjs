import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import common from '../../common/index.mjs';
import js from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-js-config-'));
  const sourceFile = path.join(root, 'sample.js');
  fs.writeFileSync(sourceFile, 'var value = 1\nconsole.log(value)\n');

  return {
    root,
    sourceFile
  };
}

test('js config loads eslint recommended and migrated rules', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...js
    ]
  });

  const [result] = await eslint.lintFiles([fixture.sourceFile]);
  const ruleIds = result.messages.map((message) => message.ruleId);
  const config = await eslint.calculateConfigForFile(fixture.sourceFile);

  assert.ok(ruleIds.includes('no-var'));
  assert.ok(ruleIds.includes('semi'));
  assert.deepEqual(config.rules['no-useless-assignment'], [0]);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
