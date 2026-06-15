import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettierConfig from '../../prettier-config.mjs';

export const prettierOptions = prettierConfig;

export default [
  // 启用 prettier 推荐配置，注册 prettier 插件并关闭与 prettier 冲突的格式类规则。
  eslintPluginPrettierRecommended,
  {
    rules: {
      // 复用共享 Prettier 选项，避免消费项目单独维护 prettier.config.mjs。
      'prettier/prettier': ['error', prettierOptions, {
        usePrettierrc: false
      }]
    }
  }
];
