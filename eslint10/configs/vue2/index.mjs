import globals from 'globals';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

const vueFiles = ['*.vue', '**/*.vue'];
const vue2ReturnTypeInferencePatterns = [
  '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
];

export default [
  // 启用 Vue2 essential 规则和 vue-eslint-parser，承接 ESLint 8 的 plugin:vue/essential。
  ...vue.configs['flat/vue2-essential'],
  {
    files: vueFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        parser: {
          js: tseslint.parser,
          ts: tseslint.parser,
          '<template>': tseslint.parser
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        vueFeatures: {
          filter: true,
          interpolationAsNonHTML: true,
          styleCSSVariableInjection: true
        }
      }
    }
  },
  {
    settings: {
      // 为 polyv/explicit-module-boundary-types 提供 Vue2 props/emits 工厂方法命名约定。
      'polyv/explicit-module-boundary-types': {
        allowHookReturnTypeInference: true,
        allowedReturnTypeInferencePatterns: vue2ReturnTypeInferencePatterns
      }
    },
    rules: {
      // 要求 template 使用 2 个空格缩进。
      'vue/html-indent': ['error', 2],
      // 约束 HTML、SVG、MathML 和组件标签的自闭合写法。
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      // 允许 v-html，兼容历史富文本渲染场景。
      'vue/no-v-html': 'off',
      // 限制单行元素最多 3 个属性，多行元素每行 1 个属性。
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1
      }],
      // 允许单行 HTML 元素内容和标签写在同一行。
      'vue/singleline-html-element-content-newline': 'off',
      // 要求自定义事件名称使用 kebab-case。
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      // 禁止直接修改 props。
      'vue/no-mutating-props': 'error',
      // 要求组件名使用多个单词，但允许入口组件常用命名。
      'vue/multi-word-component-names': ['error', {
        ignores: ['index', 'Index', 'default', 'Default']
      }],
      // 要求模板中的 attribute 使用连字符命名。
      'vue/attribute-hyphenation': ['error', 'always'],
      // 要求 v-on 监听的自定义事件使用连字符命名。
      'vue/v-on-event-hyphenation': ['error', 'always'],
      // 要求模板中已注册组件使用 kebab-case 标签名。
      'vue/component-name-in-template-casing': ['error', 'kebab-case', {
        registeredComponentsOnly: true,
        ignores: []
      }],
      // 约束 style 标签属性，允许普通 style 写法，违规时给出警告。
      'vue/enforce-style-attribute': ['warn', {
        allow: ['plain']
      }],
      // 禁止 Vue 组件导入名和同名 lower camel 本地变量冲突，避免模板组件被误识别为变量。
      'polyv/no-vue-component-variable-name-conflict': 'error'
    }
  }
];
