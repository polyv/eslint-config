/**
 * JavaScript 验证规则（基础规则）。
 */

const {
  devWarnProdError,
  strictErrorOtherwiseWarn
} = require('./util');

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: [
    'promise'
  ],
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:import/recommended',
    'plugin:sonarjs/recommended'
  ],
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'operator-linebreak': ['error', 'after', {
      overrides: {
        '?': 'before',
        ':': 'before'
      }
    }],
    'comma-dangle': ['error', 'only-multiline'],
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'wrap-iife': ['error', 'inside'],
    'no-confusing-arrow': 'error',
    'padded-blocks': 'off',

    camelcase: 'error',
    'no-debugger': devWarnProdError,
    'no-unused-vars': [devWarnProdError, {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      caughtErrors: 'none'
    }],
    'no-use-before-define': ['error', {
      functions: false,
      classes: false,
      variables: true
    }],
    'no-loop-func': 'error',
    'no-script-url': 'error',
    'no-new': 'off',
    'no-constant-condition': devWarnProdError,
    'no-empty': [devWarnProdError, { allowEmptyCatch: true }],
    'no-lonely-if': 'off',
    'no-var': 'error',
    'no-template-curly-in-string': 'off',
    'prefer-promise-reject-errors': 'error',

    'import/no-unresolved': 'off',
    'import/no-duplicates': 'error',

    'promise/prefer-await-to-then': 'warn',

    'sonarjs/cognitive-complexity': ['error', 20],
    'sonarjs/no-duplicate-string': [devWarnProdError, { threshold: 5 }],
    'sonarjs/prefer-single-boolean-return': 'off',
    'sonarjs/no-collection-size-mischeck': 'off',
    'sonarjs/no-nested-template-literals': strictErrorOtherwiseWarn
  }
};
