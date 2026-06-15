import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import { importX } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import jsConfig from '../js/index.mjs';
import { devWarnProdError } from '../../utils.mjs';

const tsFiles = ['**/*.{ts,tsx}'];
const importXTypeScriptConfig = {
  name: importX.flatConfigs.typescript.name,
  settings: importX.flatConfigs.typescript.settings,
  rules: importX.flatConfigs.typescript.rules
};

export default [
  ...jsConfig,
  ...tseslint.configs.recommended,
  // 启用 import-x 的 TypeScript 配置，补充 TS parser、TS 扩展名和 TypeScript resolver 设置。
  importXTypeScriptConfig,
  {
    files: tsFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // 关闭核心分号规则，交给 @stylistic 版本处理。
      semi: 'off',
      // 要求语句结尾必须使用分号。
      '@stylistic/semi': ['error', 'always'],

      // 关闭核心缩进规则，交给 @stylistic 版本处理。
      indent: 'off',
      // 要求使用 2 个空格缩进，switch case 多缩进一级。
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1
      }],

      // 关闭核心逗号空格规则，交给 @stylistic 版本处理。
      'comma-spacing': 'off',
      // 要求逗号后有空格、逗号前没有空格。
      '@stylistic/comma-spacing': ['error'],

      // 关闭核心尾逗号规则，交给 @stylistic 版本处理。
      'comma-dangle': 'off',
      // 只允许多行结构使用尾逗号，单行结构不允许。
      '@stylistic/comma-dangle': ['error', 'only-multiline'],

      // 关闭核心使用前定义规则，交给 TypeScript 版本处理。
      'no-use-before-define': 'off',
      // 禁止变量在定义前使用，但允许函数和类提前使用。
      '@typescript-eslint/no-use-before-define': ['error', {
        functions: false,
        classes: false,
        variables: true
      }],

      // 关闭核心未使用变量规则，交给 TypeScript 版本处理。
      'no-unused-vars': 'off',
      // 未使用变量给出警告，检查全部变量，允许对象 rest 兄弟属性和 _ 前缀变量不触发告警。
      '@typescript-eslint/no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
        varsIgnorePattern: '^_'
      }],

      // 关闭核心循环内函数规则，交给 TypeScript 版本处理。
      'no-loop-func': 'off',
      // 禁止在循环中定义可能捕获循环变量的函数。
      '@typescript-eslint/no-loop-func': 'error',

      // 关闭核心函数括号前空格规则，交给 @stylistic 版本处理。
      'space-before-function-paren': 'off',
      // 约束函数括号前空格：普通函数不留空格，async 箭头函数留空格。
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],

      // 允许使用 any。
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许使用空对象类型，兼容历史类型声明中的 {} 写法。
      '@typescript-eslint/no-empty-object-type': 'off',
      // 允许使用 Function 类型，兼容历史函数类型声明。
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // 允许使用 String、Number、Boolean、Object 等包装对象类型，兼容历史类型声明。
      '@typescript-eslint/no-wrapper-object-types': 'off',
      // 允许空函数。
      '@typescript-eslint/no-empty-function': 'off',
      // 允许空接口。
      '@typescript-eslint/no-empty-interface': 'off',
      // 允许 TypeScript namespace，兼容历史声明合并或 SDK 类型组织方式。
      '@typescript-eslint/no-namespace': 'off',
      // 禁止无用表达式，但允许短路和三元表达式承载调用逻辑。
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true
      }],
      // 要求类型注解冒号前无空格、冒号后有空格。
      '@stylistic/type-annotation-spacing': ['error', {
        after: true,
        before: false
      }],
      // 要求箭头前后都有空格。
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true
      }],
      // 要求仅作为类型使用的导入使用 import type，保持类型和值导入边界清晰。
      '@typescript-eslint/consistent-type-imports': 'error',
      // 关闭原模块边界类型规则，交给 polyv 包装版本读取 settings 并处理返回类型推导。
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // 要求模块边界显式声明类型；具体场景可通过 settings 放开特定命名的返回类型推导。
      'polyv/explicit-module-boundary-types': devWarnProdError,
      // 要求 enum 名称和 enum 成员名称使用 PascalCase。
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE']
      }, {
        selector: 'enum',
        format: ['PascalCase']
      }],
      // 允许使用 CommonJS require。
      '@typescript-eslint/no-var-requires': 'off',
      // 禁止对数组使用 for-in，避免遍历到索引或继承属性。
      '@typescript-eslint/no-for-in-array': 'off',
      // 禁止空代码块，但允许空 catch 用于吞掉可忽略异常。
      'no-empty': ['error', {
        allowEmptyCatch: true
      }],
      // 允许历史字符串或正则里保留冗余转义。
      'no-useless-escape': 'off',
      // 允许变量赋值后未再被读取，避免历史代码中的中间赋值触发新规则。
      'no-useless-assignment': 'off',
    }
  }
];
