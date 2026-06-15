/**
 * TypeScript 工程的附加验证规则。
 */

const {
  devWarnProdError,
  strictErrorOtherwiseWarn
} = require('./util');

module.exports = {
  overrides: [{
    files: ['*.ts', '*.tsx'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript'
    ],
    rules: {
      semi: 'off',
      '@typescript-eslint/semi': ['error', 'always'],

      indent: 'off',
      '@typescript-eslint/indent': ['error', 2, {
        SwitchCase: 1
      }],

      'comma-spacing': 'off',
      '@typescript-eslint/comma-spacing': ['error'],

      'comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': ['error', 'only-multiline'],

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', {
        functions: false,
        classes: false,
        variables: true
      }],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [devWarnProdError, {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'none'
      }],

      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'error',

      'space-before-function-paren': 'off',
      '@typescript-eslint/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/type-annotation-spacing': ['error', {
        after: true,
        before: false,
        overrides: {
          arrow: {
            before: true,
            after: true
          }
        }
      }],
      '@typescript-eslint/explicit-module-boundary-types': devWarnProdError,
      '@typescript-eslint/naming-convention': [strictErrorOtherwiseWarn, {
        selector: 'enumMember',
        format: ['PascalCase']
      }, {
        selector: 'enum',
        format: ['PascalCase']
      }],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-for-in-array': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    }
  }]
};
