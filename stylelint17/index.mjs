import { fileURLToPath } from 'node:url';

const extendsConfig = [
  'stylelint-config-standard-scss',
  'stylelint-config-standard-vue/scss',
  'stylelint-config-recess-order'
];

const plugins = [
  'stylelint-prettier',
  '@stylistic/stylelint-plugin'
];

const ignoreFiles = [
  '**/dist/**',
  '**/node_modules/**',
  '**/*.svg'
];

const rules = {
  // 限制 alpha 透明度使用小数写法，例如 rgba(0, 0, 0, 0.6)。
  'alpha-value-notation': 'number',
  // 限制带透明度的颜色函数使用 rgba()/hsla() 这类 alpha 别名，允许 rgba(#1d2129, 0.6)。
  'color-function-alias-notation': 'with-alpha',
  // 限制颜色函数使用逗号分隔的 legacy 写法，例如 rgb(0, 0, 0)。
  'color-function-notation': 'legacy',
  // 限制废弃属性值关键字，但特意允许 word-break: break-word 的兼容写法。
  'declaration-property-value-keyword-no-deprecated': [
    true,
    {
      ignoreKeywords: ['break-word']
    }
  ],
  // 自定义属性声明前禁止空行：CSS 变量声明需要紧凑排列，避免变量块中被空行切散。
  'custom-property-empty-line-before': 'never',
  // 限制 url() 参数必须加引号；单引号写法按项目约定保留，Stylelint core 不区分单双引号。
  'function-url-quotes': 'always',
  // 多行函数参数列表中，每个逗号后必须换行。
  '@stylistic/function-comma-newline-after': 'always-multi-line',
  // 多行函数参数列表中，逗号前禁止换行。
  '@stylistic/function-comma-newline-before': 'never-multi-line',
  // 单行函数参数列表中，逗号后必须保留一个空格。
  '@stylistic/function-comma-space-after': 'always-single-line',
  // 函数参数逗号前禁止出现空格。
  '@stylistic/function-comma-space-before': 'never',
  // 函数参数内部不允许出现空行。
  '@stylistic/function-max-empty-lines': 0,
  // 多行函数括号内部必须换行。
  '@stylistic/function-parentheses-newline-inside': 'always-multi-line',
  // 单行函数括号内侧禁止空格。
  '@stylistic/function-parentheses-space-inside': 'never-single-line',
  // 零长度值禁止带单位：0px、0em、0rem 等必须写成 0，减少无意义单位。
  'length-zero-no-unit': true,
  // 数字禁止保留无意义的尾随 0。
  '@stylistic/number-no-trailing-zeros': true,
  // 通过 Stylelint 运行 Prettier，并约束 CSS/SCSS 字符串使用单引号。
  'prettier/prettier': [
    true,
    {
      singleQuote: true
    }
  ],
  // 字符串必须使用单引号。
  '@stylistic/string-quotes': 'single',
  // 多行值列表中，每个逗号后必须换行。
  '@stylistic/value-list-comma-newline-after': 'always-multi-line',
  // 多行值列表中，逗号前禁止换行。
  '@stylistic/value-list-comma-newline-before': 'never-multi-line',
  // 单行值列表中，逗号后必须保留一个空格。
  '@stylistic/value-list-comma-space-after': 'always-single-line',
  // 值列表逗号前禁止出现空格。
  '@stylistic/value-list-comma-space-before': 'never',
  // 值列表内部最多允许 1 个连续空行。
  '@stylistic/value-list-max-empty-lines': 1,
  // 属性名必须小写。
  '@stylistic/property-case': 'lower',
  // !important 后面禁止空格。
  '@stylistic/declaration-bang-space-after': 'never',
  // !important 前面必须有一个空格。
  '@stylistic/declaration-bang-space-before': 'always',
  // 多行声明块中，分号后必须换行。
  '@stylistic/declaration-block-semicolon-newline-after': 'always-multi-line',
  // 多行声明块中，分号前禁止换行。
  '@stylistic/declaration-block-semicolon-newline-before': 'never-multi-line',
  // 单行声明中，冒号后必须保留一个空格。
  '@stylistic/declaration-colon-space-after': 'always-single-line',
  // 声明冒号前禁止空格。
  '@stylistic/declaration-colon-space-before': 'never',
  // 多行代码块左大括号后必须换行。
  '@stylistic/block-opening-brace-newline-after': 'always-multi-line',
  // 左大括号前必须有一个空格。
  '@stylistic/block-opening-brace-space-before': 'always',
  // 单行代码块左大括号后必须有一个空格。
  '@stylistic/block-opening-brace-space-after': 'always-single-line',
  // 右大括号前禁止空行。
  '@stylistic/block-closing-brace-empty-line-before': 'never',
  // 右大括号后必须换行；SCSS 的 @if、@else 连接语法例外。
  '@stylistic/block-closing-brace-newline-after': [
    'always',
    {
      ignoreAtRules: ['if', 'else']
    }
  ],
  // 多行代码块右大括号前必须换行。
  '@stylistic/block-closing-brace-newline-before': 'always-multi-line',
  // 单行代码块右大括号前必须有一个空格。
  '@stylistic/block-closing-brace-space-before': 'always-single-line',
  // 限制 class selector 使用项目 BEM 风格，兼容业务枚举后缀，例如 --ProductClick。
  'selector-class-pattern': [
    '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(?:(?:__|--)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*$',
    {
      message: 'Expected class selector to match project BEM style'
    }
  ],
  // 后代选择器组合符必须使用普通空格。
  '@stylistic/selector-descendant-combinator-no-non-space': true,
  // 伪类名称必须小写。
  '@stylistic/selector-pseudo-class-case': 'lower',
  // 伪类括号内侧禁止空格。
  '@stylistic/selector-pseudo-class-parentheses-space-inside': 'never',
  // 伪元素名称必须小写。
  '@stylistic/selector-pseudo-element-case': 'lower',
  // 属性选择器方括号内侧禁止空格。
  '@stylistic/selector-attribute-brackets-space-inside': 'never',
  // 属性选择器操作符后禁止空格。
  '@stylistic/selector-attribute-operator-space-after': 'never',
  // 属性选择器操作符前禁止空格。
  '@stylistic/selector-attribute-operator-space-before': 'never',
  // 多行选择器列表中，每个逗号后必须换行。
  '@stylistic/selector-list-comma-newline-after': 'always-multi-line',
  // 多行选择器列表中，逗号前禁止换行。
  '@stylistic/selector-list-comma-newline-before': 'never-multi-line',
  // 单行选择器列表中，逗号后必须有一个空格。
  '@stylistic/selector-list-comma-space-after': 'always-single-line',
  // 选择器列表逗号前禁止空格。
  '@stylistic/selector-list-comma-space-before': 'never',
  // 媒体特性冒号后必须有一个空格。
  '@stylistic/media-feature-colon-space-after': 'always',
  // 媒体特性冒号前禁止空格。
  '@stylistic/media-feature-colon-space-before': 'never',
  // 媒体特性名称必须小写。
  '@stylistic/media-feature-name-case': 'lower',
  // 媒体特性括号内侧禁止空格。
  '@stylistic/media-feature-parentheses-space-inside': 'never',
  // 媒体范围操作符后必须有空格。
  '@stylistic/media-feature-range-operator-space-after': 'always',
  // 媒体范围操作符前必须有空格。
  '@stylistic/media-feature-range-operator-space-before': 'always',
  // 多行媒体查询列表中，每个逗号后必须换行。
  '@stylistic/media-query-list-comma-newline-after': 'always-multi-line',
  // 多行媒体查询列表中，逗号前禁止换行。
  '@stylistic/media-query-list-comma-newline-before': 'never-multi-line',
  // 单行媒体查询列表中，逗号后必须有一个空格。
  '@stylistic/media-query-list-comma-space-after': 'always-single-line',
  // 媒体查询列表逗号前禁止空格。
  '@stylistic/media-query-list-comma-space-before': 'never',
  // at-rule 名称必须小写。
  '@stylistic/at-rule-name-case': 'lower',
  // 单行 at-rule 名称后必须有一个空格。
  '@stylistic/at-rule-name-space-after': 'always-single-line',
  // at-rule 分号后必须换行。
  '@stylistic/at-rule-semicolon-newline-after': 'always',
  // at-rule 分号前禁止空格。
  '@stylistic/at-rule-semicolon-space-before': 'never',
  // 缩进统一为 2 个空格。
  '@stylistic/indentation': 2,
  // 连续空行最多允许 2 行。
  '@stylistic/max-empty-lines': 2,
  // 禁止行尾空白字符。
  '@stylistic/no-eol-whitespace': true,
  // 限制 SCSS 变量使用 kebab-case，并兼容项目里 $--xxx 形式的变量。
  'scss/dollar-variable-pattern': [
    '^(-{0,2}[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
    {
      message: 'Expected $ variable to be kebab-case'
    }
  ],
  // CSS 值关键字必须小写：例如 block、none、solid、currentcolor，禁止 BLOCK、None 等写法。
  'value-keyword-case': 'lower',
  // 允许 SCSS @extend 直接继承 class selector。
  'scss/at-extend-no-missing-placeholder': null,
  // 限制 @use/@import 引入 SCSS 文件时必须带 .scss 扩展名。
  'scss/load-partial-extension': 'always'
};

function resolveImport(specifier) {
  return fileURLToPath(import.meta.resolve(specifier));
}

const resolvedExtendsConfig = extendsConfig.map(configName => resolveImport(configName));
const resolvedPlugins = plugins.map(pluginName => resolveImport(pluginName));

function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function defineConfig(userConfig = {}) {
  const {
    extends: userExtends,
    ignoreFiles: userIgnoreFiles,
    plugins: userPlugins,
    rules: userRules,
    ...restConfig
  } = userConfig;

  return {
    ...restConfig,
    extends: [
      ...resolvedExtendsConfig,
      ...toArray(userExtends)
    ],
    plugins: [
      ...resolvedPlugins,
      ...toArray(userPlugins)
    ],
    ignoreFiles: [
      ...ignoreFiles,
      ...toArray(userIgnoreFiles)
    ],
    rules: {
      ...rules,
      ...userRules
    }
  };
}

const config = {
  extends: extendsConfig,
  plugins,
  ignoreFiles,
  rules
};

export {
  config,
  defineConfig,
  extendsConfig,
  ignoreFiles,
  plugins,
  resolvedExtendsConfig,
  resolvedPlugins,
  rules
};

export default config;
