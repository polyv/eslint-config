import { test } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import rule from '../index.mjs';

test('explicit-module-boundary-types allows configured return inference only', () => {
  const tester = new RuleTester({
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  });

  tester.run('explicit-module-boundary-types', rule, {
    valid: [
      {
        code: [
          'export function useDemo() {',
          '  return { value: 1 };',
          '}'
        ].join('\n'),
        options: [{
          allowHookReturnTypeInference: true
        }]
      },
      {
        code: [
          'export const useDemo = () => {',
          '  return { value: 1 };',
          '};'
        ].join('\n'),
        settings: {
          'polyv/explicit-module-boundary-types': {
            allowHookReturnTypeInference: true
          }
        }
      },
      {
        code: [
          'export function createService(): { value: number } {',
          '  return { value: 1 };',
          '}'
        ].join('\n')
      },
      {
        code: [
          'export function buttonProp() {',
          '  return { type: String };',
          '}',
          'export const buttonProps = () => {',
          '  return { type: String };',
          '};',
          'export default {',
          '  buttonEmit() {',
          "    return ['confirm'];",
          '  },',
          '  buttonEmits() {',
          "    return ['cancel'];",
          '  }',
          '};'
        ].join('\n'),
        options: [{
          allowedReturnTypeInferencePatterns: [
            '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
          ]
        }]
      },
      {
        code: [
          'export function dialogProps() {',
          '  return { visible: Boolean };',
          '}'
        ].join('\n'),
        settings: {
          'polyv/explicit-module-boundary-types': {
            allowedReturnTypeInferencePatterns: [
              '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
            ]
          }
        }
      }
    ],
    invalid: [
      {
        code: [
          'export function createService() {',
          '  return { value: 1 };',
          '}'
        ].join('\n'),
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        code: [
          'export function useDemo(value) {',
          '  return value;',
          '}'
        ].join('\n'),
        options: [{
          allowHookReturnTypeInference: true
        }],
        errors: [{ messageId: 'missingArgType' }]
      },
      {
        code: [
          'export function useDemo() {',
          '  return { value: 1 };',
          '}'
        ].join('\n'),
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        code: [
          'export function buttonProps() {',
          '  return { type: String };',
          '}'
        ].join('\n'),
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        code: [
          'export function buttonProps(value) {',
          '  return { type: value };',
          '}'
        ].join('\n'),
        options: [{
          allowedReturnTypeInferencePatterns: [
            '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
          ]
        }],
        errors: [{ messageId: 'missingArgType' }]
      }
    ]
  });
});
