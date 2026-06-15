import { test } from 'node:test';
import path from 'node:path';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import rule from '../index.mjs';

const vueFilename = path.join(process.cwd(), 'src/DemoCard.vue');

function createVueCode(scriptLines) {
  return [
    '<template>',
    '  <member-type v-model="memberType" />',
    '</template>',
    '',
    '<script setup lang="ts">',
    ...scriptLines,
    '</script>',
    ''
  ].join('\n');
}

function createNestedTemplateVueCode(scriptLines) {
  return [
    '<template>',
    '  <pwc-input>',
    '    <template #prefix>',
    '      <chat-icon-search />',
    '    </template>',
    '  </pwc-input>',
    '  <member-type v-model="memberType" />',
    '</template>',
    '',
    '<script setup lang="ts">',
    ...scriptLines,
    '</script>',
    ''
  ].join('\n');
}

test('no-vue-component-variable-name-conflict', () => {
  const tester = new RuleTester({
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  });

  tester.run('no-vue-component-variable-name-conflict', rule, {
    valid: [
      {
        filename: vueFilename,
        code: createVueCode([
          "import MemberType from './components/member-type.vue';",
          "const value = ref('online');"
        ])
      },
      {
        filename: vueFilename,
        code: createVueCode([
          "import MemberType from './components/member-type.vue';",
          "const currentMemberType = ref('online');"
        ])
      },
      {
        filename: path.join(process.cwd(), 'src/plain.ts'),
        code: [
          "import MemberType from './components/member-type.vue';",
          "const memberType = ref('online');"
        ].join('\n')
      }
    ],
    invalid: [
      {
        filename: vueFilename,
        code: createNestedTemplateVueCode([
          "import ChatIconSearch from './components/chat-icon-search.vue';",
          "import MemberType from './components/member-type.vue';",
          "const memberType = ref('online');"
        ]),
        errors: [{
          messageId: 'componentVariableNameConflict',
          data: {
            variableName: 'memberType',
            componentName: 'MemberType',
            tagName: 'member-type',
            suggestName: 'currentMemberType'
          }
        }]
      },
      {
        filename: path.join(process.cwd(), 'src/FooCard.vue'),
        code: [
          '<template>',
          '  <foo-bar />',
          '</template>',
          '',
          '<script setup lang="ts">',
          "import FooBar from './components/foo-bar.vue';",
          'function fooBar() {}',
          '</script>',
          ''
        ].join('\n'),
        errors: [{
          messageId: 'componentVariableNameConflict',
          data: {
            variableName: 'fooBar',
            componentName: 'FooBar',
            tagName: 'foo-bar',
            suggestName: 'currentFooBar'
          }
        }]
      }
    ]
  });
});
