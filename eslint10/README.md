# @polyv/eslint-config

这是面向 ESLint 10.x 的 flat config 配置包，包含通用插件配置、JavaScript 配置、TypeScript 配置、Vue2 补充配置和微信小程序专项配置。

## 安装

```bash
npm install @polyv/eslint-config eslint@^10 --save-dev
```

## 配置导航

- [通用配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/common/README.md)：必须显式组合的基础配置，包含通用忽略项、运行 ESLint 时消费项目目录内的 `.gitignore`、`polyv` plugin 注册，以及 `promise`、`sonarjs`、`import-x` 推荐规则。
- [Import-X 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/importx/README.md)：提供 `eslint-plugin-import-x` 推荐规则和 node resolver 设置，已被通用配置继承。
- [SonarJS 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/sonarjs/README.md)：提供 `eslint-plugin-sonarjs` 推荐规则和项目内覆盖规则，已被通用配置继承。
- [JavaScript 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/js/README.md)：纯 JavaScript 项目使用，需和 `polyv.configs.common` 一起组合。
- [TypeScript 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/ts/README.md)：TypeScript 或 TypeScript + JavaScript 混合项目使用，已集成 JavaScript 配置，需和 `polyv.configs.common` 一起组合。
- [Vue2 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/vue2/README.md)：Vue2 项目使用，提供 Vue2 SFC 解析、Vue2 essential 规则、ESLint 8 `for-vue2-js.js` 迁移规则和 Vue2 TypeScript 返回类型推导 settings。
- [小程序配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/miniprogram/README.md)：微信小程序项目使用，开启 `polyv/no-relative-directory-index-imports` 并处理小程序专项忽略。
- [Prettier 配置](https://github.com/polyv/eslint-config/blob/main/eslint10/configs/prettier/README.md)：接入 `eslint-plugin-prettier/recommended` 和共享 Prettier 选项，需要放在配置数组最后。

## 规则导航

- [explicit-module-boundary-types](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/explicit-module-boundary-types/README.md)：要求导出函数显式声明模块边界类型，同时允许通过 options 或 settings 放开特定命名的返回类型推导。
- [no-relative-directory-index-imports](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/no-relative-directory-index-imports/README.md)：禁止依赖相对目录的 `index` 文件兜底解析，避免微信小程序 npm 构建后的运行时解析失败。
- [no-vue-component-variable-name-conflict](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/no-vue-component-variable-name-conflict/README.md)：禁止 Vue `<script setup>` 中的组件导入名和 lower camel 本地声明产生命名冲突。

## 快速选择

纯 JavaScript 项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js
];
```

TypeScript 或 TypeScript + JavaScript 混合项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts
];
```

Vue2 JavaScript 项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js,
  ...polyv.configs.vue2
];
```

Vue2 TypeScript 项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.vue2
];
```

微信小程序项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.miniprogram
];
```

需要接入 Prettier 时，把 `polyv.configs.prettier` 放在最后：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js,
  ...polyv.configs.prettier
];
```

## 插件和规则

- `polyv.configs.common` 会默认注册 `polyv` plugin。如果已经引用了 `polyv.configs.common`，则无需额外注册该插件。
- 只需要单独使用自定义规则时，可以引入 `plugin` 或 `@polyv/eslint-config/plugin` 后手动注册。
- 当前自定义规则：
  - [polyv/explicit-module-boundary-types](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/explicit-module-boundary-types/README.md)：要求导出函数显式声明模块边界类型，同时允许指定函数或方法省略返回类型。
  - [polyv/no-relative-directory-index-imports](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/no-relative-directory-index-imports/README.md)：用于禁止依赖相对目录的 `index` 文件兜底解析。
  - [polyv/no-vue-component-variable-name-conflict](https://github.com/polyv/eslint-config/blob/main/eslint10/rules/no-vue-component-variable-name-conflict/README.md)：用于禁止 Vue `<script setup>` 中的组件导入名和 lower camel 本地声明产生命名冲突。

## Prettier 配置

消费项目如果需要单独给 Prettier 使用共享配置，可以引入：

```javascript
// prettier.config.mjs
import prettierConfig from '@polyv/eslint-config/prettier-config';

export default prettierConfig;
```
