# 小程序配置

`polyv.configs.miniprogram` 用于微信小程序项目，重点处理小程序 npm 构建后的相对目录 `index` 解析问题。

## 使用方式

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.miniprogram
];
```

如果项目使用 TypeScript，请在消费项目自己的 ESLint 配置中先配置 TypeScript parser，再叠加 `polyv.configs.common` 和 `polyv.configs.miniprogram`。

## 配置内容

- 忽略微信小程序构建 npm 后生成的 `miniprogram_npm/` 目录。
- 注入小程序全局变量：`App`、`Component`、`Page`、`getApp`、`wx`。
- 关闭 `import-x/no-useless-path-segments`，避免它建议移除显式 `/index`，从而和小程序路径要求冲突。
- 开启 `polyv/no-relative-directory-index-imports`，禁止依赖相对目录的 `index` 文件兜底解析。
- 单元测试相关文件会关闭 `polyv/no-relative-directory-index-imports`，包括 `test/`、`tests/`、`__test__/`、`__tests__/` 目录，以及 `*.test.*`、`*.spec.*` 文件。

## 自定义规则

`polyv/no-relative-directory-index-imports` 用于禁止这类写法：

```javascript
// bad.js
import helper from './helper';
const utils = require('./utils');
```

应显式写成：

```javascript
// good.js
import helper from './helper/index';
const utils = require('./utils/index');
```

该规则同时处理 `./`、`.`、`../`、`..` 等目录入口写法。

## 注意事项

- `polyv` plugin 由 `polyv.configs.common` 统一注册。
- `configs.miniprogram` 不内联引入 `common`，消费项目必须显式组合 `polyv.configs.common`。
