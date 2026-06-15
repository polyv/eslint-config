/**
 * Vue.js 工程的验证规则。
 */

const { strictErrorOtherwiseWarn } = require('./util');
const jsConfig = require('./for-js');

module.exports = Object.assign({}, jsConfig, {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ...jsConfig.parserOptions
  },
  extends: [
    ...jsConfig.extends,
    '@vue/standard',
    'plugin:vue/essential'
  ],
  rules: {
    ...jsConfig.rules,
    'vue/html-indent': ['error', 2],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/no-v-html': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/custom-event-name-casing': [strictErrorOtherwiseWarn, 'kebab-case'],
    'vue/no-mutating-props': strictErrorOtherwiseWarn,
    'vue/multi-word-component-names': [strictErrorOtherwiseWarn, {
      ignores: ['index', 'Index', 'default', 'Default']
    }],
    'vue/attribute-hyphenation': [strictErrorOtherwiseWarn, 'always'],
    'vue/v-on-event-hyphenation': [strictErrorOtherwiseWarn, 'always']
  }
});
