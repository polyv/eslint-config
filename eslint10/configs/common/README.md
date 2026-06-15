# 通用配置

`polyv.configs.common` 是接入本包预设配置时必须显式组合的基础配置。

## 使用方式

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common
];
```

也可以通过子路径单独引入：

```javascript
// eslint.config.mjs
import common from '@polyv/eslint-config/configs/common';

export default [
  ...common
];
```

## 配置内容

- 配置通用忽略项：`node_modules/`、`dest/`、`dist/`、`.dist/`、`coverage/`、`pnpm-lock.yaml`、`package-lock.json`。
- 会递归读取运行 ESLint 时消费项目目录内的 `.gitignore`，让不提交到 git 的产物文件也进入 ESLint 忽略范围；扫描时会跳过 `.git`、`node_modules`、`dest`、`dist`、`.dist`、`coverage`。
- 默认注册 `polyv` plugin；如果已经引用 `polyv.configs.common`，消费项目无需额外注册该插件。
- 继承 [Import-X 配置](../importx/README.md)，启用 `eslint-plugin-import-x` 推荐规则和 node resolver。
- 启用 `eslint-plugin-promise` 的 `flat/recommended` 配置。
- 继承 [SonarJS 配置](../sonarjs/README.md)，启用 `eslint-plugin-sonarjs` 推荐规则和项目内覆盖规则。

## 规则命名

导入相关规则使用 `import-x/...` 命名空间，例如：

```javascript
// eslint.config.mjs
{
  rules: {
    'import-x/no-duplicates': 'error'
  }
}
```

## 插件用法

如果没有使用 `polyv.configs.common`，但需要单独启用 Polyv 自定义规则，可以手动注册插件：

```javascript
// eslint.config.mjs
import { plugin as polyvPlugin } from '@polyv/eslint-config';

export default [
  {
    plugins: {
      polyv: polyvPlugin
    },
    rules: {
      'polyv/explicit-module-boundary-types': 'error',
      'polyv/no-relative-directory-index-imports': 'error'
    }
  }
];
```

也可以从子路径单独引入 plugin：

```javascript
// eslint.config.mjs
import polyvPlugin from '@polyv/eslint-config/plugin';

export default [
  {
    plugins: {
      polyv: polyvPlugin
    },
    rules: {
      'polyv/explicit-module-boundary-types': 'error',
      'polyv/no-relative-directory-index-imports': 'error'
    }
  }
];
```
