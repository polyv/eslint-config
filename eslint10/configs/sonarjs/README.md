# SonarJS 配置

`polyv.configs.sonarjs` 用于提供 `eslint-plugin-sonarjs` 的推荐规则和项目内覆盖规则。

## 使用方式

通常不需要单独引入该配置，`polyv.configs.common` 已经继承了 `polyv.configs.sonarjs`：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common
];
```

如果只需要 SonarJS 能力，也可以单独组合：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.sonarjs
];
```

也可以通过子路径单独引入：

```javascript
// eslint.config.mjs
import sonarjs from '@polyv/eslint-config/configs/sonarjs';

export default [
  ...sonarjs
];
```

## 配置内容

- 启用 `eslint-plugin-sonarjs` 的推荐配置。
- 集中维护复杂度、重复分支、重复字符串、无意义表达式、冗余跳转、嵌套 switch、未使用集合等 `sonarjs/*` 规则。
- 关闭部分容易和历史代码、示例配置、SDK 兼容代码产生误报或风格冲突的规则，例如 `sonarjs/elseif-without-else`、`sonarjs/no-clear-text-protocols`、`sonarjs/no-duplicate-string`、`sonarjs/no-hardcoded-ip`、`sonarjs/pseudo-random`、`sonarjs/redundant-type-aliases`、`sonarjs/slow-regex` 和 `sonarjs/todo-tag`。

## 注意事项

`configs.sonarjs` 不内联引入 `common`。接入完整预设时仍应显式组合 `polyv.configs.common`。
