import { importX } from 'eslint-plugin-import-x';

export default [
  // 启用 import-x 推荐规则，检查导入导出正确性和常见导入问题。
  importX.flatConfigs.recommended,
  {
    settings: {
      // import-x/ignore 匹配的是解析后的路径；vite-plugin-dts 已覆盖该包的 ESM/CJS 导出形态差异，避免 import-x 产生误报。
      'import-x/ignore': ['vite-plugin-dts'],
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx', '.mts', '.cts', '.d.ts']
        }
      }
    },
    rules: {
      // 检查默认导入是否真实存在。
      'import-x/default': 'error',
      // 检查导出语句是否有效。
      'import-x/export': 'error',
      // 要求 import 语句放在文件顶部。
      'import-x/first': 'error',
      // 检查具名导入是否真实存在。
      'import-x/named': 'error',
      // 检查命名空间导入后的成员访问是否真实存在。
      'import-x/namespace': 'error',
      // 禁止使用绝对路径导入。
      'import-x/no-absolute-path': ['error', {
        esmodule: true,
        commonjs: true,
        amd: false
      }],
      // 禁止重复导入同一个模块。
      'import-x/no-duplicates': 'error',
      // 警告容易和默认导入混淆的具名导出命名。
      'import-x/no-named-as-default': 'warn',
      // 禁止用具名方式导入 default。
      'import-x/no-named-default': 'error',
      // 当前项目不检查路径解析，避免别名和构建工具路径误报。
      'import-x/no-unresolved': 'off',
      // 禁止在导入路径中使用 webpack loader 语法。
      'import-x/no-webpack-loader-syntax': 'error'
    }
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      // 本包自检配置通过默认导出访问 configs，关闭 import-x 的默认成员误报。
      'import-x/no-named-as-default-member': 'off'
    }
  }
];
