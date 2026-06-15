# Prettier 配置

`polyv.configs.prettier` 用于接入 `eslint-plugin-prettier/recommended`，并内置 Polyv 共享 Prettier 选项。

## 使用方式

Prettier 配置应放在配置数组最后，确保它能关闭前面配置中和 Prettier 冲突的格式类规则：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js,
  ...polyv.configs.prettier
];
```

也可以通过子路径单独引入：

```javascript
// eslint.config.mjs
import prettier from '@polyv/eslint-config/configs/prettier';

export default [
  ...prettier
];
```

## 配置内容

- 复用根级 [prettier-config.mjs](../../prettier-config.mjs) 中的共享 Prettier 配置。
- 引入 `eslint-plugin-prettier/recommended`。
- 注册 `prettier` plugin。
- 开启 `prettier/prettier` 规则，并设置 `usePrettierrc: false`，避免消费项目必须单独维护 `prettier.config.mjs`。
- 继承 `eslint-config-prettier`，关闭和 Prettier 冲突的格式类 ESLint 规则。
- 内置共享 Prettier 选项：`useTabs: false`、`printWidth: 120`、`tabWidth: 2`、`singleQuote: true`、`semi: true`、`trailingComma: 'all'`、`bracketSameLine: false`、`arrowParens: 'avoid'`、`quoteProps: 'as-needed'`、`singleAttributePerLine: true`。

## 注意事项

`configs.prettier` 不内联引入 `common`。接入完整预设时仍应显式组合 `polyv.configs.common`，并把 `polyv.configs.prettier` 放在最后。

如果消费项目需要覆盖共享格式选项，可以在 `polyv.configs.prettier` 后追加自己的 `prettier/prettier` 规则配置。

如果消费项目需要单独给 Prettier CLI 或编辑器使用共享配置，可以在项目里的 `prettier.config.mjs` 中写：

```javascript
// prettier.config.mjs
import prettierConfig from '@polyv/eslint-config/prettier-config';

export default prettierConfig;
```
