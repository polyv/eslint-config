import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import common from '../../common/index.mjs';
import ts from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-ts-config-'));
  const tsFile = path.join(root, 'sample.ts');
  const jsFile = path.join(root, 'sample.js');
  fs.writeFileSync(tsFile, [
    'export type Empty = {}',
    'export type LegacyFunction = Function;',
    'export type LegacyString = String;',
    'export namespace LegacyNamespace {',
    '  export const value = 1;',
    '}',
    'export const value: any = 1',
    'const _unused = 1;',
    'const record = { ignored: 1, used: 2 };',
    'const { ignored, ...rest } = record;',
    'const flag = Boolean(Date.now());',
    'const run = () => {};',
    'flag && run();',
    'flag ? run() : run();',
    'try {',
    '  run();',
    '} catch {}',
    'console.log(rest.used);',
    "export const escaped = '\\#';",
    ''
  ].join('\n'));
  fs.writeFileSync(jsFile, 'var value = 1\nconsole.log(value)\n');

  return {
    root,
    jsFile,
    tsFile
  };
}

test('ts config loads recommended typescript-eslint config and migrated rules', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...ts
    ]
  });

  const results = await eslint.lintFiles([fixture.tsFile, fixture.jsFile]);
  const ruleIds = results.flatMap((result) => result.messages.map((message) => message.ruleId));
  const config = await eslint.calculateConfigForFile(fixture.tsFile);

  assert.ok(ruleIds.includes('@stylistic/semi'));
  assert.ok(ruleIds.includes('no-var'));
  assert.ok(ruleIds.includes('semi'));
  assert.equal(ruleIds.includes('@typescript-eslint/no-explicit-any'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-empty-object-type'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-namespace'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-unsafe-function-type'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-wrapper-object-types'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-unused-expressions'), false);
  assert.equal(ruleIds.includes('@typescript-eslint/no-unused-vars'), false);
  assert.equal(ruleIds.includes('no-empty'), false);
  assert.equal(ruleIds.includes('no-useless-escape'), false);
  assert.deepEqual(config.rules['@typescript-eslint/consistent-type-imports'], [2]);
  assert.deepEqual(config.rules['@typescript-eslint/no-namespace'], [0]);
  assert.deepEqual(config.rules['@typescript-eslint/explicit-module-boundary-types'], [0]);
  assert.deepEqual(config.rules['import-x/named'], [0]);
  assert.equal(config.rules['polyv/explicit-module-boundary-types'][0] > 0, true);
  assert.equal(config.rules['polyv/explicit-module-boundary-types'][1], undefined);
  assert.equal(config.settings['import-x/extensions'].includes('.ts'), true);
  assert.equal(config.settings['import-x/extensions'].includes('.tsx'), true);
  assert.equal(config.settings['import-x/parsers']['@typescript-eslint/parser'].includes('.ts'), true);
  assert.equal(config.settings['import-x/resolver'].typescript, true);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('ts config requires hook functions to declare module boundary return types by default', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-ts-hook-functions-config-'));
  const sourceFile = path.join(root, 'src/hooks/use-demo.ts');
  fs.mkdirSync(path.dirname(sourceFile), { recursive: true });
  fs.writeFileSync(sourceFile, [
    'export function useDemo() {',
    '  return { value: 1 };',
    '}',
    'export function useDemoWithArg(value) {',
    '  return value;',
    '}',
    'export function createService() {',
    '  return { value: 1 };',
    '}',
    ''
  ].join('\n'));

  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...ts
    ]
  });

  const [result] = await eslint.lintFiles([sourceFile]);
  const config = await eslint.calculateConfigForFile(sourceFile);
  const boundaryMessages = result.messages.filter((message) => message.ruleId === 'polyv/explicit-module-boundary-types');

  assert.equal(config.rules['@typescript-eslint/explicit-module-boundary-types'][0], 0);
  assert.equal(config.rules['polyv/explicit-module-boundary-types'][0] > 0, true);
  assert.equal(
    boundaryMessages.some((message) => message.line === 1 && message.message === 'Missing return type on function.'),
    true
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 4 && message.message === 'Missing return type on function.'),
    true
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 4 && message.message === "Argument 'value' should be typed."),
    true
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 7 && message.message === 'Missing return type on function.'),
    true
  );

  fs.rmSync(root, { recursive: true, force: true });
});
