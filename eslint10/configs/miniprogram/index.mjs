const sourceFilePattern = '**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}';

export const unitTestFilePatterns = [
  '**/__tests__/**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
  '**/__test__/**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
  '**/tests/**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
  '**/test/**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
  '**/*.test.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
  '**/*.spec.{js,cjs,mjs,jsx,ts,tsx,mts,cts}'
];

export const miniprogramGlobals = {
  App: 'readonly',
  Component: 'readonly',
  Page: 'readonly',
  getApp: 'readonly',
  wx: 'readonly'
};

export default [
  {
    ignores: [
      'miniprogram_npm/**',
      '**/miniprogram_npm/**'
    ]
  },
  {
    files: [sourceFilePattern],
    languageOptions: {
      globals: miniprogramGlobals
    },
    rules: {
      // 小程序 npm 构建需要显式 index，引入该配置时关闭会建议移除 index 的 import 规则。
      'import-x/no-useless-path-segments': 'off',
      // 禁止依赖相对目录的 index 兜底解析，避免小程序 npm 构建后路径解析失败。
      'polyv/no-relative-directory-index-imports': 'error'
    }
  },
  {
    files: unitTestFilePatterns,
    rules: {
      // 单元测试文件不进入小程序 npm 产物，允许使用目录 index 简写。
      'polyv/no-relative-directory-index-imports': 'off'
    }
  }
];
