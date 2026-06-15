import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import common from '../../common/index.mjs';
import ts from '../../ts/index.mjs';
import vue2 from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-vue2-config-'));
  const sourceFile = path.join(root, 'src/options.ts');
  const vueFile = path.join(root, 'src/DemoCard.vue');
  const scriptSetupFile = path.join(root, 'src/SetupCard.vue');
  fs.mkdirSync(path.dirname(sourceFile), { recursive: true });
  fs.writeFileSync(sourceFile, [
    'export function dialogProp() {',
    '  return { type: String };',
    '}',
    'export function dialogProps() {',
    '  return { visible: Boolean };',
    '}',
    'export function dialogEmit(value) {',
    '  return value;',
    '}',
    'export function dialogEmits() {',
    "  return ['confirm'];",
    '}',
    'export function useDialog() {',
    '  return { visible: true };',
    '}',
    'export function createDialog() {',
    '  return { visible: Boolean };',
    '}',
    ''
  ].join('\n'));
  fs.writeFileSync(vueFile, [
    '<template>',
    '  <demo-child',
    '    foo-bar="value"',
    '    @my-event="noop"',
    '  />',
    '</template>',
    '',
    '<script lang="ts">',
    'export default {',
    "  name: 'DemoCard',",
    '  methods: {',
    '    noop(): void {}',
    '  }',
    '};',
    '</script>',
    ''
  ].join('\n'));
  fs.writeFileSync(scriptSetupFile, [
    '<template>',
    '  <demo-child',
    '    :value="count"',
    '    @confirm="handleConfirm"',
    '  />',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { ref } from 'vue';",
    'const count = ref<number>(1);',
    'function handleConfirm(value: number): void {',
    '  count.value = value;',
    '}',
    '</script>',
    '',
    '<style>',
    '.demo-card {',
    '  display: block;',
    '}',
    '</style>',
    ''
  ].join('\n'));

  return {
    root,
    sourceFile,
    scriptSetupFile,
    vueFile
  };
}

test('vue2 config allows props and emits helpers to infer return types', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...ts,
      ...vue2
    ]
  });

  const [result] = await eslint.lintFiles([fixture.sourceFile]);
  const config = await eslint.calculateConfigForFile(fixture.sourceFile);
  const boundaryMessages = result.messages.filter((message) => message.ruleId === 'polyv/explicit-module-boundary-types');

  assert.deepEqual(
    config.settings['polyv/explicit-module-boundary-types'].allowedReturnTypeInferencePatterns,
    ['^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$']
  );
  assert.equal(config.settings['polyv/explicit-module-boundary-types'].allowHookReturnTypeInference, true);
  assert.equal(config.rules['polyv/explicit-module-boundary-types'][1], undefined);
  assert.equal(
    boundaryMessages.some((message) => message.line === 1 && message.message === 'Missing return type on function.'),
    false
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 4 && message.message === 'Missing return type on function.'),
    false
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 7 && message.message === 'Missing return type on function.'),
    false
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 7 && message.message === "Argument 'value' should be typed."),
    true
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 10 && message.message === 'Missing return type on function.'),
    false
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 13 && message.message === 'Missing return type on function.'),
    false
  );
  assert.equal(
    boundaryMessages.some((message) => message.line === 16 && message.message === 'Missing return type on function.'),
    true
  );

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('vue2 config loads vue2 essential and migrated vue rules', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...ts,
      ...vue2
    ]
  });

  const [result] = await eslint.lintFiles([fixture.vueFile]);
  const config = await eslint.calculateConfigForFile(fixture.vueFile);

  assert.equal(result.errorCount, 0);
  assert.deepEqual(config.rules['vue/no-multiple-template-root'], [2]);
  assert.deepEqual(config.rules['vue/html-indent'], [2, 2]);
  assert.deepEqual(config.rules['vue/html-self-closing'], [2, {
    html: {
      void: 'always',
      normal: 'never',
      component: 'always'
    },
    svg: 'always',
    math: 'always'
  }]);
  assert.deepEqual(config.rules['vue/no-v-html'], [0]);
  assert.deepEqual(config.rules['vue/max-attributes-per-line'], [2, {
    singleline: 3,
    multiline: 1
  }]);
  assert.deepEqual(config.rules['vue/singleline-html-element-content-newline'], [0]);
  assert.deepEqual(config.rules['vue/custom-event-name-casing'], [2, 'kebab-case']);
  assert.deepEqual(config.rules['vue/no-mutating-props'], [2]);
  assert.deepEqual(config.rules['vue/multi-word-component-names'], [2, {
    ignores: ['index', 'Index', 'default', 'Default']
  }]);
  assert.deepEqual(config.rules['vue/attribute-hyphenation'], [2, 'always']);
  assert.deepEqual(config.rules['vue/v-on-event-hyphenation'], [2, 'always']);
  assert.deepEqual(config.rules['vue/component-name-in-template-casing'], [2, 'kebab-case', {
    registeredComponentsOnly: true,
    ignores: []
  }]);
  assert.deepEqual(config.rules['vue/enforce-style-attribute'], [1, {
    allow: ['plain']
  }]);
  assert.deepEqual(config.rules['polyv/no-vue-component-variable-name-conflict'], [2]);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});

test('vue2 config parses vue script setup with lang ts', async () => {
  const fixture = createFixture();
  const eslint = new ESLint({
    cwd: fixture.root,
    overrideConfigFile: true,
    overrideConfig: [
      ...common,
      ...ts,
      ...vue2
    ]
  });

  const [result] = await eslint.lintFiles([fixture.scriptSetupFile]);
  const config = await eslint.calculateConfigForFile(fixture.scriptSetupFile);

  assert.equal(result.errorCount, 0);
  assert.equal(result.fatalErrorCount, 0);
  assert.equal(config.languageOptions.globals.window, false);
  assert.equal(config.languageOptions.globals.process, false);
  assert.equal(config.languageOptions.globals.describe, false);
  assert.equal(config.languageOptions.globals.expect, false);
  assert.equal(config.languageOptions.parserOptions.extraFileExtensions.includes('.vue'), true);
  assert.equal(config.languageOptions.parserOptions.vueFeatures.filter, true);

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
