import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';
import defaultConfig, {
  config,
  defineConfig,
  extendsConfig,
  ignoreFiles,
  plugins,
  resolvedExtendsConfig,
  resolvedPlugins,
  rules
} from '../index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('exports the shared stylelint config shape', () => {
  assert.equal(defaultConfig, config);
  assert.deepEqual(config.extends, extendsConfig);
  assert.deepEqual(config.plugins, plugins);
  assert.deepEqual(config.ignoreFiles, ignoreFiles);
  assert.equal(config.rules, rules);
  assert.ok(config.extends.includes('stylelint-config-standard-scss'));
  assert.ok(config.extends.includes('stylelint-config-standard-vue/scss'));
  assert.ok(config.extends.includes('stylelint-config-recess-order'));
  assert.ok(config.plugins.includes('stylelint-prettier'));
  assert.ok(config.plugins.includes('@stylistic/stylelint-plugin'));
});

test('defineConfig returns a complete config with resolved internals', () => {
  const definedConfig = defineConfig();

  assert.deepEqual(definedConfig.extends, resolvedExtendsConfig);
  assert.deepEqual(definedConfig.plugins, resolvedPlugins);
  assert.deepEqual(definedConfig.ignoreFiles, ignoreFiles);
  assert.deepEqual(definedConfig.rules, rules);
  assert.ok(definedConfig.extends.every(item => path.isAbsolute(item)));
  assert.ok(definedConfig.plugins.every(item => path.isAbsolute(item)));
});

test('defineConfig merges consumer overrides after shared defaults', () => {
  const definedConfig = defineConfig({
    ignoreFiles: ['**/custom-output/**'],
    rules: {
      'selector-class-pattern': null
    }
  });

  assert.deepEqual(definedConfig.ignoreFiles, [
    ...ignoreFiles,
    '**/custom-output/**'
  ]);
  assert.equal(definedConfig.rules['selector-class-pattern'], null);
  assert.equal(definedConfig.rules['color-function-notation'], 'legacy');
});

test('lints valid scss and vue fixtures', async () => {
  const result = await stylelint.lint({
    files: [
      path.join(__dirname, 'fixtures/valid.scss'),
      path.join(__dirname, 'fixtures/valid.vue')
    ],
    config
  });

  assert.equal(result.errored, false);
  assert.equal(result.results.flatMap(item => item.warnings).length, 0);
});

test('supports defineConfig usage from consumer config', async () => {
  const result = await stylelint.lint({
    code: '.chat-panel {\n  color: rgba(0, 0, 0, 0.6);\n}\n',
    codeFilename: 'sample.scss',
    config: defineConfig()
  });

  assert.equal(result.errored, false);
  assert.equal(result.results.flatMap(item => item.warnings).length, 0);
});

test('defineConfig ignoreFiles are resolved from the consumer cwd', async () => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-stylelint-define-config-')));
  const previousCwd = process.cwd();

  fs.mkdirSync(path.join(root, 'demo', 'dist'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'demo', 'dist', 'bad.scss'), '.BadSelector { color: rgb(0 0 0 / 60%); }\n');
  fs.writeFileSync(path.join(root, 'src', 'valid.scss'), '.chat-panel {\n  color: rgba(0, 0, 0, 0.6);\n}\n');

  try {
    process.chdir(root);

    const result = await stylelint.lint({
      files: ['**/*.scss'],
      config: defineConfig()
    });

    assert.equal(result.errored, false);
    assert.deepEqual(result.results.flatMap(item => item.warnings), []);
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('supports direct extends usage from consumer config', async () => {
  const result = await stylelint.lint({
    code: '.chat-panel {\n  color: rgba(0, 0, 0, 0.6);\n}\n',
    codeFilename: 'sample.scss',
    config: {
      extends: ['@polyv/stylelint-config']
    }
  });

  assert.equal(result.errored, false);
  assert.equal(result.results.flatMap(item => item.warnings).length, 0);
});

test('reports rules from the shared config', async () => {
  const result = await stylelint.lint({
    code: [
      '.BadSelector {',
      '  color: rgb(0 0 0 / 60%);',
      '}',
      ''
    ].join('\n'),
    codeFilename: 'bad.scss',
    config
  });
  const ruleNames = result.results.flatMap(item => item.warnings.map(warning => warning.rule));

  assert.equal(result.errored, true);
  assert.ok(ruleNames.includes('selector-class-pattern'));
  assert.ok(ruleNames.includes('color-function-notation'));
});
