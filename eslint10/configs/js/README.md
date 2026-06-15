# JavaScript 配置

`polyv.configs.js` 用于纯 JavaScript 项目。它包含 `@eslint/js` 的推荐配置，并迁移 ESLint 8 `for-js.js` 中仍适用于 ESLint 10 的规则语义。

## 使用方式

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js
];
```

纯 JavaScript 项目使用 `configs.js`；TypeScript 或 TypeScript + JavaScript 混合项目应使用 `configs.ts`，因为 `configs.ts` 已经集成 `configs.js`。

## 配置内容

- 启用 `@eslint/js` 的 `js.configs.recommended`。
- 配置 JavaScript 文件范围：`**/*.{js,cjs,mjs,jsx}`。
- 注入 browser 和 node 全局变量。
- 迁移基础代码风格规则，例如分号、函数括号前空格、操作符换行、尾逗号、空行和尾随空格。
- 迁移基础质量规则，例如 `no-debugger`、`no-unused-vars`、`no-use-before-define`、`no-var`、`no-empty`。
- 迁移 `promise` 相关规则；相关插件由 `polyv.configs.common` 统一提供。
- `import-x` 相关规则统一放在 `polyv.configs.importx` 中，并由 `polyv.configs.common` 继承。
- `sonarjs` 相关规则统一放在 `polyv.configs.sonarjs` 中，并由 `polyv.configs.common` 继承。

## 注意事项

- `configs.js` 不注册 `polyv`、`import-x`、`promise` 或 `sonarjs` 插件，也不维护 `import-x/*` 或 `sonarjs/*` 规则。
- 接入时必须显式组合 `polyv.configs.common`，否则 `import-x/*`、`promise/*`、`sonarjs/*` 规则无法加载。
- `.cjs` 文件会被设置为 `sourceType: 'commonjs'`。
