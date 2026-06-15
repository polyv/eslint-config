---
name: polyv-eslint-config
description: 用于给 Polyv 前端消费项目接入或升级 @polyv/eslint-config 的 ESLint 10 flat config。每当用户要求“接入 @polyv/eslint-config”“升级 eslint 配置”“配置 eslint10”“统一 Polyv ESLint 规则”“Vue2 eslint 规则”“小程序 eslint 规则”“把 prettier 配置交给 eslint-config”或处理消费项目 eslint.config.mjs 时，都应使用本技能。
---

# 接入 @polyv/eslint-config

## 适用范围

使用本技能帮助消费项目接入 `@polyv/eslint-config` 的 ESLint 10 配置。它面向业务项目、SDK 项目、小程序项目和 TypeScript/JavaScript 混合项目，不用于维护 `eslint8/` 旧版 `.eslintrc` 配置。

默认目标是 `@polyv/eslint-config` 的 `eslint10/` 独立包，它使用 ESLint flat config，并按 `polyv.configs.*` 分层导出配置。

## 工作原则

- 先识别消费项目的语言类型、框架场景、包管理器和现有 lint/format 脚本，再修改。
- 接入预设配置时始终显式组合 `polyv.configs.common`。
- 纯 JavaScript 项目使用 `polyv.configs.js`。
- TypeScript 项目或 TypeScript + JavaScript 混合项目使用 `polyv.configs.ts`；不要再额外组合 `polyv.configs.js`，因为 `ts` 已经集成 `js`。
- Vue2 项目在语言配置后追加 `polyv.configs.vue2`；纯 JS Vue2 项目组合 `common + js + vue2`，TS 或 TS+JS Vue2 项目组合 `common + ts + vue2`。
- 微信小程序项目，以及会被微信小程序项目引入并需要兼容小程序运行环境的 SDK 或第三方包项目，都要额外组合 `polyv.configs.miniprogram`。
- 需要通过 ESLint 承接 Prettier 时，把 `polyv.configs.prettier` 放在配置数组最后。
- 如果用户要求编辑器保存代码时自动格式化、VS Code 保存格式化或团队统一编辑器格式化行为，先读取 `references/editor-save-format.md`。
- 不要为了接入配置顺手重构业务代码；只根据 lint 规则做必要的最小修复。
- 不要自动提交或推送，除非用户明确要求。

## 先盘点消费项目

在目标项目根目录执行：

```bash
git status --short
find . -maxdepth 2 -name package.json -not -path '*/node_modules/*'
```

判断包管理器：

- 有 `pnpm-lock.yaml` 或 `packageManager` 包含 `pnpm`：使用 pnpm。
- 有 `package-lock.json`：使用 npm。
- 有 `yarn.lock`：使用 yarn。

判断项目类型：

- 存在 `tsconfig.json`、`*.ts`、`*.tsx`：按 TypeScript 或 TS+JS 项目处理。
- 只存在 `*.js`、`*.mjs`、`*.cjs`、`*.jsx`：按纯 JavaScript 项目处理。
- 存在 `.vue` 文件、`vue` 2.x、`vue-template-compiler`、`@vue/cli-service`、`vue.config.js` 或旧配置继承 `for-vue2-js` / `plugin:vue/essential`：按 Vue2 项目叠加 `polyv.configs.vue2`。
- 存在 `project.config.json`、`app.json`、`miniprogram/`、`miniprogram_npm/` 或微信小程序构建脚本：按小程序项目叠加 `miniprogram` 配置。
- 项目本身不是小程序，但属于会被小程序消费的 SDK、请求库、工具库或第三方包，并且需要保证小程序兼容性：也叠加 `miniprogram` 配置。
- 存在 `.prettierrc`、`prettier.config.*`、`eslint-plugin-prettier` 或格式化脚本：检查是否要迁到共享 `prettier` 配置。

同时查看已有配置：

```bash
ls -a
find . -maxdepth 2 \( -name 'eslint.config.*' -o -name '.eslintrc*' -o -name 'prettier.config.*' -o -name '.prettierrc*' \)
```

如果项目已经有 ESLint 配置，不要直接覆盖。先读现有配置，保留项目特有 globals、parserOptions、ignores、overrides 和必要的本地规则。

## 安装依赖

消费项目至少需要直接声明：

- `@polyv/eslint-config`
- `eslint`

如果项目是 TypeScript 项目，并且项目还没有直接声明 `typescript`，需要按项目实际情况确认是否补充；`@polyv/eslint-config` 把 `typescript` 作为 optional peer。

不要在消费项目里重复安装这些由共享包提供的依赖，除非项目确实直接使用它们：

- `eslint-plugin-import-x`
- `eslint-plugin-promise`
- `eslint-plugin-sonarjs`
- `eslint-plugin-prettier`
- `eslint-config-prettier`
- `eslint-plugin-vue`
- `vue-eslint-parser`
- `eslint-import-resolver-typescript`

安装命令示例：

```bash
pnpm add -D @polyv/eslint-config eslint@^10
npm install -D @polyv/eslint-config eslint@^10
yarn add -D @polyv/eslint-config eslint@^10
```

如果用户指定版本，使用用户指定版本。没有指定版本时，优先按消费项目 registry 查询 `@polyv/eslint-config` 最新版本：

```bash
npm view @polyv/eslint-config version
```

## 编写 eslint.config.mjs

### 纯 JavaScript 项目

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js
];
```

### TypeScript 或 TS+JS 项目

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts
];
```

### Vue2 项目

Vue2 纯 JavaScript 项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js,
  ...polyv.configs.vue2
];
```

Vue2 TypeScript 或 TS+JS 项目：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.vue2
];
```

`polyv.configs.vue2` 已支持 `.vue` 中的普通 `<script>`、`<script lang="ts">` 和 `<script setup lang="ts">`。旧配置里的 `parser: 'vue-eslint-parser'`、`parserOptions.extraFileExtensions: ['.vue']`、`plugin:vue/essential` 和 `for-vue2-js` 语义不需要在消费项目重复写。

### 微信小程序或兼容小程序的 SDK 项目

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.miniprogram
];
```

如果小程序项目，或兼容小程序的 SDK/第三方包项目是纯 JavaScript，把 `polyv.configs.ts` 换成 `polyv.configs.js`。

### 接入 Prettier

如果希望由 ESLint 承接格式检查和自动格式化，把 `polyv.configs.prettier` 放在最后：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.prettier
];
```

`polyv.configs.prettier` 已经接入 `eslint-plugin-prettier/recommended`，并内置共享 Prettier 选项：

```javascript
// prettier options
{
  useTabs: false,
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSameLine: false,
  arrowParens: 'avoid',
  quoteProps: 'as-needed',
  singleAttributePerLine: true
}
```

它会设置 `usePrettierrc: false`，所以如果消费项目只通过 ESLint 承接 Prettier，不需要再单独维护 `prettier.config.mjs`。如果项目仍通过 Prettier CLI、脚手架或编辑器扩展执行格式化，则继续提供 `prettier.config.mjs` 给这些工具读取。

### 继续使用 Prettier 格式化

如果消费项目依旧采用 Prettier CLI、Prettier 脚手架或 Prettier 编辑器扩展格式化代码，仍然可以组合 `polyv.configs.prettier`。因为 `polyv.configs.prettier` 内部也是引用 `@polyv/eslint-config/prettier-config`，它可以让 ESLint 用同一份 Prettier 选项报告格式差异。

这种模式下：

- `eslint.config.mjs` 仍可把 `polyv.configs.prettier` 放在最后。
- 不要额外配置一份本地 `prettier/prettier` 规则。
- 使用 `@polyv/eslint-config/prettier-config` 给 Prettier CLI 或编辑器提供共享格式选项。
- `lint` 执行 ESLint，并可通过 `polyv.configs.prettier` 检查格式差异。
- `format` 和 `format:check` 可以继续执行 Prettier。

配置示例：

```javascript
// prettier.config.mjs
import prettierConfig from '@polyv/eslint-config/prettier-config';

export default prettierConfig;
```

脚本示例：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

如果希望 `format` 和 `format:check` 也统一走 ESLint，再把脚本切成 `eslint . --fix` / `eslint .`。如果项目明确不希望 ESLint 报告 Prettier 格式差异，才不组合 `polyv.configs.prettier`，只保留 `prettier.config.mjs`。

## 配置分层说明

`polyv.configs.common`：

- 通用 ignores。
- 递归读取运行 ESLint 时消费项目目录内的 `.gitignore`，让未提交到 git 的产物文件也进入 ESLint 忽略范围。
- 扫描 `.gitignore` 时会跳过 `.git`、`node_modules`、`dest`、`dist`、`.dist`、`coverage` 等目录，避免递归依赖和构建产物。
- 注册 `polyv` plugin。
- 继承 `polyv.configs.importx`。
- 继承 `polyv.configs.sonarjs`。
- 启用 `eslint-plugin-promise` 推荐配置。

`polyv.configs.importx`：

- 使用 `eslint-plugin-import-x`。
- 配置 node resolver 扩展名：`.js`、`.cjs`、`.mjs`、`.jsx`、`.ts`、`.tsx`、`.mts`、`.cts`、`.d.ts`。
- 通过 `import-x/ignore` 忽略 `vite-plugin-dts`，避免该包 ESM/CJS 导出形态差异触发 import-x 误报。
- 维护所有 `import-x/*` 规则。

`polyv.configs.sonarjs`：

- 使用 `eslint-plugin-sonarjs` 推荐配置。
- 维护所有 `sonarjs/*` 覆盖规则。

`polyv.configs.js`：

- 纯 JavaScript 配置。
- 包含 `@eslint/js` 推荐配置。
- 不注册 common 已提供的插件。
- 不维护 `import-x/*` 或 `sonarjs/*` 规则。

`polyv.configs.ts`：

- 适用于 TS 或 TS+JS 混合项目。
- 已集成 `polyv.configs.js`。
- 包含 `typescript-eslint` 推荐配置。
- 包含 `importX.flatConfigs.typescript`，补充 TS 扩展名、`@typescript-eslint/parser` 映射和 TypeScript resolver，并关闭 TS 场景下容易误报的 `import-x/named`。
- 包含 `@typescript-eslint/consistent-type-imports: error`。

`polyv.configs.vue2`：

- 适用于 Vue2 JS、Vue2 TS 或 Vue2 TS+JS 项目。
- 已启用 `eslint-plugin-vue` 的 `flat/vue2-essential`。
- 支持 `.vue`、`<script lang="ts">` 和 `<script setup lang="ts">`。
- 迁移 ESLint 8 `for-vue2-js.js` 中的 Vue2 规则，并补充 live-watch-sdk 本地规则：`vue/component-name-in-template-casing` 和 `vue/enforce-style-attribute`。
- 为 `polyv/explicit-module-boundary-types` 提供 Vue2 settings，允许 `useXxx` hook 以及 `xxxProp(s)` / `xxxEmit(s)` 方法省略返回类型。

`polyv.configs.miniprogram`：

- 小程序专项配置。
- 开启 `polyv/no-relative-directory-index-imports`。
- 关闭 `import-x/no-useless-path-segments`，避免和显式 `/index` 要求冲突。
- 测试文件中关闭 `polyv/no-relative-directory-index-imports`。

`polyv.configs.prettier`：

- 接入 `eslint-plugin-prettier/recommended`。
- 复用 `@polyv/eslint-config/prettier-config`。
- 必须放在配置数组最后。

## 处理旧配置

如果消费项目已有 `.eslintrc*`：

1. 优先迁移到 `eslint.config.mjs`。
2. 保留项目特有 globals、ignore、parserOptions、env 语义。
3. 删除或停用旧 `.eslintrc*`，避免双配置并存。

如果旧配置继承 `@polyv/eslint-config/lib/for-vue2-js`、`@vue/standard` 或 `plugin:vue/essential`：

1. 按项目语言组合 `polyv.configs.js` 或 `polyv.configs.ts`。
2. 在语言配置后追加 `polyv.configs.vue2`。
3. 不要重复迁移 `vue-eslint-parser`、`extraFileExtensions: ['.vue']`、`plugin:vue/essential`、`vue/component-name-in-template-casing` 或 `vue/enforce-style-attribute`，这些已经由 `polyv.configs.vue2` 承接。
4. 只保留共享配置未覆盖且项目确实需要的本地 Vue 规则。

如果消费项目已有 `eslint-plugin-prettier/recommended`：

1. 改成 `...polyv.configs.prettier`。
2. 移除消费项目不再直接使用的 `eslint-plugin-prettier` 和 `eslint-config-prettier` 直接依赖。
3. 如果原本有 `prettier.config.*`，确认是否改用 `@polyv/eslint-config/prettier-config` 或完全交给 ESLint。

如果消费项目已有本地 `prettier/prettier` 规则：

- 如果规则只是共享格式选项，删除本地覆盖，改用 `polyv.configs.prettier`。
- 如果项目确实要覆盖格式选项，把覆盖配置放在 `polyv.configs.prettier` 后面。

如果消费项目已有 `format:check`，并且它是由 Prettier 脚手架或 Prettier CLI 执行，例如 `prettier --check .`：

- 如果项目希望 `format:check` 也统一由 ESLint 执行，把它改成 `eslint .`。
- 对应的 `format` 或 `format:fix` 也可改成通过 ESLint 自动修复，例如 `eslint . --fix`。
- 如果项目继续用 Prettier CLI 给格式化脚本、编辑器或其他流程使用，保留 `prettier --write` / `prettier --check` 也可以，但要确认它读取的是 `@polyv/eslint-config/prettier-config`，避免 ESLint 和 Prettier 使用两套格式规则。

## package.json 脚本建议

按项目既有脚本风格添加或调整：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "eslint . --fix",
    "format:check": "eslint ."
  }
}
```

如果项目已有更精确的 lint 范围，例如 `src/**/*.{js,ts}`，优先保留项目范围。不要为了接入共享配置把脚本改成过宽范围，除非用户明确要求。

如果原来的 `format:check` 是 `prettier --check`、框架脚手架包装的 Prettier 检查命令，或只检查格式不跑 ESLint 的命令，接入 `polyv.configs.prettier` 后可以按项目偏好选择：

- 希望格式检查统一走 ESLint：改成等价的 `eslint` 命令。
- 希望继续用 Prettier CLI 或脚手架检查格式：保留原命令，但要让 Prettier 读取 `@polyv/eslint-config/prettier-config`。

## 常见修复

启用 `@typescript-eslint/consistent-type-imports` 后，纯类型导入应改成：

```typescript
// src/example.ts
import type { Foo } from './types';
```

混合导入中只作为类型使用的成员可改成 inline type：

```typescript
// src/example.ts
import { createClient, type ClientOptions } from './client';
```

启用小程序规则后，相对目录入口要显式写 `index`：

```javascript
// bad.js
import helper from './helper';
```

```javascript
// good.js
import helper from './helper/index';
```

启用 Vue2 规则后，模板中的已注册组件名使用 `kebab-case`：

```vue
<!-- bad.vue -->
<template>
  <DemoChild />
</template>
```

```vue
<!-- good.vue -->
<template>
  <demo-child />
</template>
```

## 验证

完成接入后，优先执行：

```bash
node -c eslint.config.mjs
git diff --check
```

再按项目包管理器执行：

```bash
pnpm lint
pnpm run lint
npm run lint
yarn lint
```

如果接入了 Prettier：

```bash
pnpm run format:check
npm run format:check
yarn format:check
```

如果接入了 Vue2 配置，至少确认 `.vue` 文件能被 ESLint 解析；项目有代表性组件时优先跑包含 `.vue` 的 lint 范围。必要时用项目等价命令检查某个组件的最终配置：

```bash
npx eslint --print-config path/to/component.vue
```

如果 lint 失败：

1. 先区分是共享规则暴露出的真实问题、项目已有问题，还是配置迁移问题。
2. 对自动修复安全的格式问题优先运行 `eslint . --fix` 或项目等价脚本。
3. 对类型导入、相对目录 index、小程序路径等规则，按规则语义修代码，不要用本地 override 压掉。
4. 如果必须关闭某条规则，说明原因并把关闭范围收窄到具体文件或目录。

## 完成时汇报

最终回复用中文简洁说明：

- 判断项目是 JS、TS/TS+JS、小程序还是组合场景。
- 安装或升级了哪些依赖，使用了哪个包管理器。
- `eslint.config.mjs` 采用了哪些 `polyv.configs.*`。
- 是否处理了 Prettier 配置，以及是否保留 `prettier.config.mjs`。
- 修改了哪些脚本。
- 跑过哪些验证命令，是否存在失败、警告或未验证项。

## References

- `references/editor-save-format.md`：当用户要求保存代码时自动格式化、VS Code 工作区设置或编辑器格式化接入时读取。
