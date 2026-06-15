import js from '@eslint/js';
import globals from 'globals';
import { devWarnProdError } from '../../utils.mjs';

const jsFiles = ['**/*.{js,cjs,mjs,jsx}'];

export default [
  js.configs.recommended,
  {
    files: jsFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // 要求语句结尾必须使用分号。
      semi: ['error', 'always'],
      // 约束函数括号前空格：普通函数不留空格，async 箭头函数留空格。
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      // 要求操作符换行时放在行尾，但三元表达式的问号和冒号放在行首。
      'operator-linebreak': ['error', 'after', {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }],
      // 只允许多行结构使用尾逗号，单行结构不允许。
      'comma-dangle': ['error', 'only-multiline'],
      // 禁止行尾空格，但允许注释中保留尾随空格。
      'no-trailing-spaces': ['error', {
        ignoreComments: true
      }],
      // 限制连续空行最多 2 行。
      'no-multiple-empty-lines': ['error', {
        max: 2
      }],
      // 要求立即执行函数的调用括号包在函数表达式内部。
      'wrap-iife': ['error', 'inside'],
      // 禁止可能与比较运算混淆的箭头函数写法。
      'no-confusing-arrow': 'error',
      // 允许代码块内出现首尾空行。
      'padded-blocks': 'off',

      // 要求标识符使用驼峰命名。
      camelcase: 'error',
      // 禁止 debugger；生产环境报错，其他环境警告。
      'no-debugger': devWarnProdError,
      // 检查未使用变量；生产环境报错，其他环境警告。
      'no-unused-vars': [devWarnProdError, {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'none'
      }],
      // 允许变量赋值后未再被读取，避免历史代码中的中间赋值触发新规则。
      'no-useless-assignment': 'off',
      // 禁止变量在定义前使用，但允许函数和类提前使用。
      'no-use-before-define': ['error', {
        functions: false,
        classes: false,
        variables: true
      }],
      // 禁止在循环中定义可能捕获循环变量的函数。
      'no-loop-func': 'error',
      // 禁止使用 javascript: URL。
      'no-script-url': 'error',
      // 允许只实例化对象而不保存返回值。
      'no-new': 'off',
      // 禁止常量条件；生产环境报错，其他环境警告。
      'no-constant-condition': devWarnProdError,
      // 禁止空代码块，但允许空 catch。
      'no-empty': [devWarnProdError, {
        allowEmptyCatch: true
      }],
      // 允许 else 中只有一个 if。
      'no-lonely-if': 'off',
      // 禁止 var，统一使用 let 或 const。
      'no-var': 'error',
      // 允许普通字符串里出现类似模板字符串占位符的文本。
      'no-template-curly-in-string': 'off',
      // 要求 Promise reject 使用 Error 对象。
      'prefer-promise-reject-errors': 'error',

      // 检查 Promise 构造函数参数命名。
      'promise/param-names': 'error',
      // 建议使用 async/await 替代 then 链。
      'promise/prefer-await-to-then': 'warn',
    }
  },
  {
    files: ['**/*.{cjs}'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
