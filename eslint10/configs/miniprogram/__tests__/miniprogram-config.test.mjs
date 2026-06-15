import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import common from '../../common/index.mjs';
import miniprogram from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-config-'));
  const src = path.join(root, 'src');
  fs.mkdirSync(path.join(src, 'interface'), { recursive: true });
  fs.writeFileSync(path.join(src, 'interface', 'index.js'), 'export default 1;\n');
  fs.writeFileSync(path.join(src, 'main.js'), "import value from './interface';\nconsole.log(value);\n");
  fs.writeFileSync(path.join(src, 'main.test.js'), "import value from './interface';\nconsole.log(value);\n");
  fs.writeFileSync(path.join(src, 'explicit-index.js'), "import value from './interface/index';\nconsole.log(value);\n");

  return {
    root,
    sourceFile: path.join(src, 'main.js'),
    testFile: path.join(src, 'main.test.js'),
    explicitIndexFile: path.join(src, 'explicit-index.js')
  };
}

test('miniprogram config disables directory index rule for unit test files', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...miniprogram
    ]
  });

  const [sourceResult, testResult] = await eslint.lintFiles([
    fixture.sourceFile,
    fixture.testFile
  ]);

  assert.equal(sourceResult.messages.length, 1);
  assert.equal(sourceResult.messages[0].ruleId, 'polyv/no-relative-directory-index-imports');
  assert.equal(
    testResult.messages.some((message) => message.ruleId === 'polyv/no-relative-directory-index-imports'),
    false
  );

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('miniprogram config disables import no-useless-path-segments', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      {
        rules: {
          // 模拟消费项目或其他配置先开启该规则。
          'import-x/no-useless-path-segments': 'error'
        }
      },
      ...miniprogram
    ]
  });

  const [result] = await eslint.lintFiles([fixture.explicitIndexFile]);

  assert.equal(result.messages.length, 0);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
