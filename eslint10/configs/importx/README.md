# Import-X 配置

`polyv.configs.importx` 用于提供 `eslint-plugin-import-x` 的推荐规则和 Node resolver 配置。

## 使用方式

通常不需要单独引入该配置，`polyv.configs.common` 已经继承了 `polyv.configs.importx`：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common
];
```

如果只需要 import-x 能力，也可以单独组合：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.importx
];
```

也可以通过子路径单独引入：

```javascript
// eslint.config.mjs
import importx from '@polyv/eslint-config/configs/importx';

export default [
  ...importx
];
```

## 配置内容

- 启用 `eslint-plugin-import-x` 的 `flatConfigs.recommended`。
- 通过 `import-x/ignore` 忽略 `vite-plugin-dts`，避免该包 ESM/CJS 导出形态差异触发 import-x 误报。
- 配置 `import-x/resolver` 使用 node resolver。
- resolver 扩展名包含 `.js`、`.cjs`、`.mjs`、`.jsx`、`.ts`、`.tsx`、`.mts`、`.cts`、`.d.ts`。
- 集中维护导入导出规则，例如 `import-x/default`、`import-x/export`、`import-x/first`、`import-x/named`、`import-x/namespace`、`import-x/no-absolute-path`、`import-x/no-duplicates`、`import-x/no-named-as-default`、`import-x/no-named-default`、`import-x/no-unresolved` 和 `import-x/no-webpack-loader-syntax`。
- 针对本包自身的 `eslint.config.mjs` 关闭 `import-x/no-named-as-default-member`，避免默认导出访问 `configs` 时误报。

## 注意事项

ESLint 10 下的 import 能力按 `eslint-plugin-import-x` README 的写法接入，使用 `import { importX } from 'eslint-plugin-import-x'` 和 `import-x/...` 规则命名空间。
