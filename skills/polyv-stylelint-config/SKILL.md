---
name: polyv-stylelint-config
description: 用于给 Polyv 前端消费项目接入或升级 @polyv/stylelint-config 的 Stylelint 17 共享配置。每当用户要求“接入 @polyv/stylelint-config”“配置 stylelint17”“迁移 stylelint.config.mjs”“统一样式 lint 规则”“SCSS/Vue 样式检查”“lint:style 脚本”“VS Code 保存自动格式化/修复样式”或处理消费项目 Stylelint、Prettier 样式格式化时，都应使用本技能。
---

# 接入 @polyv/stylelint-config

## 适用范围

使用本技能帮助消费项目接入 `@polyv/stylelint-config` 的 Stylelint 17 配置。它面向 Polyv 业务项目、SDK 项目、Vue 项目和 SCSS 项目，默认目标是本仓库 `stylelint17/` 独立包。

## 工作原则

- 先识别消费项目的包管理器、现有 Stylelint 配置、样式文件类型和 lint 脚本，再修改。
- 默认使用 `@polyv/stylelint-config` 承接 SCSS、Vue SFC、属性排序、Prettier 和项目样式约定。
- 如果消费项目已经有 `stylelint.config.*`，不要直接覆盖；先读现有配置，保留项目特有 `ignoreFiles`、`customSyntax`、本地规则和必要 overrides。
- 如果用户要求编辑器保存时自动格式化或自动修复样式文件，先读取 `references/editor-save-format.md`，再同步处理 `.vscode/settings.json` 和 `.vscode/extensions.json`。
- 不要在消费项目里重复安装共享包已经提供的 Stylelint 插件和 config，除非项目代码或本地配置直接引用它们。
- 不要为了接入配置顺手重构样式代码；只根据 Stylelint 报错做必要的最小修复。
- 不要自动提交或推送，除非用户明确要求。

## 先盘点消费项目

在目标项目根目录执行：

```bash
git status --short
find . -maxdepth 2 -name package.json -not -path '*/node_modules/*'
find . -maxdepth 3 \( -name 'stylelint.config.*' -o -name '.stylelintrc*' \)
```

判断包管理器：

- 有 `pnpm-lock.yaml` 或 `packageManager` 包含 `pnpm`：使用 pnpm。
- 有 `package-lock.json`：使用 npm。
- 有 `yarn.lock`：使用 yarn。

判断样式场景：

- 存在 `*.scss`、`sass`、`stylelint-config-standard-scss` 或 SCSS import：按 SCSS 项目处理。
- 存在 `.vue` 文件、`stylelint-config-standard-vue` 或 `<style lang="scss">`：按 Vue SFC 项目处理。
- 存在 `prettier`、`stylelint-prettier`、`.prettierrc`、`prettier.config.*` 或格式化脚本：检查是否由共享 Stylelint 配置承接样式格式化。
- 存在旧的项目内规则，先和 `@polyv/stylelint-config` 对比；只有项目特有差异才保留在消费项目。

## 安装依赖

消费项目至少需要直接声明：

- `@polyv/stylelint-config`
- `stylelint`
- `prettier`

不要在消费项目里重复安装这些由共享包提供的依赖，除非项目确实直接使用它们：

- `@stylistic/stylelint-plugin`
- `stylelint-config-recess-order`
- `stylelint-config-standard-scss`
- `stylelint-config-standard-vue`
- `stylelint-order`
- `stylelint-prettier`

安装命令示例：

```bash
pnpm add -D @polyv/stylelint-config stylelint@^17 prettier@^3
npm install -D @polyv/stylelint-config stylelint@^17 prettier@^3
yarn add -D @polyv/stylelint-config stylelint@^17 prettier@^3
```

如果用户指定版本，使用用户指定版本。没有指定版本时，优先按消费项目 registry 查询 `@polyv/stylelint-config` 最新版本：

```bash
npm view @polyv/stylelint-config version
```

## 编写 stylelint.config.mjs

推荐配置：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig();
```

需要覆盖个别项目规则时：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig({
  rules: {
    'selector-class-pattern': null
  }
});
```

需要追加项目特有忽略项时：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig({
  ignoreFiles: ['**/custom-output/**']
});
```

`defineConfig()` 会返回完整 Stylelint 配置，默认 `ignoreFiles` 为 `['**/dist/**', '**/node_modules/**', '**/*.svg']`，并让这些相对 glob 在消费项目根目录下解析。它内部会把共享包依赖的 config 和 plugin 解析成绝对路径，避免 pnpm 项目必须直接安装共享包内部依赖。

兼容直接 `extends` 写法。如果项目仍使用直接 `extends` 并配置 `ignoreFiles`，必须显式复用共享包导出的默认忽略项：

```javascript
import { ignoreFiles } from '@polyv/stylelint-config';

export default {
  extends: ['@polyv/stylelint-config'],
  ignoreFiles: [
    ...ignoreFiles,
    '**/custom-output/**'
  ]
};
```

只在项目确实需要时追加覆盖；不要把共享包里的完整规则复制回消费项目。

## package.json 脚本

推荐脚本：

```json
{
  "scripts": {
    "lint:style": "stylelint \"**/*.{css,scss,vue}\" --allow-empty-input",
    "lint:style:fix": "stylelint \"**/*.{css,scss,vue}\" --fix --allow-empty-input"
  }
}
```

如果项目已有 `lint`、`lint:fix`、`format` 或 `format:check`，按项目原有脚本组合方式最小改动。例如已有 `lint` 聚合 ESLint 和 Stylelint 时，保持聚合入口不变，只替换或补齐 `lint:style`。

## 编辑器保存时自动格式化

当用户要求“保存时自动格式化”“VS Code 保存自动修复”“编辑器自动格式化样式”时，先读取 `references/editor-save-format.md`，再按消费项目已有 `.vscode` 配置合并。

## 迁移旧配置

- 旧配置已经继承 `stylelint-config-standard-scss`、`stylelint-config-standard-vue/scss` 或 `stylelint-config-recess-order` 时，可以由共享包统一承接。
- 旧配置已经启用 `stylelint-prettier` 时，通常不需要在消费项目重复声明 `plugins` 和 `prettier/prettier`。
- 旧配置有额外 `ignoreFiles` 时，优先迁移为 `defineConfig({ ignoreFiles: [...] })`；如果继续使用直接 `extends`，必须显式复用导出的默认 `ignoreFiles`。
- 旧配置有业务专属选择器、全局变量或第三方样式兼容规则时，保留为消费项目覆盖。
- 迁移完成后，用 Stylelint 实际跑一次，再按报错做最小修复。

## 验证

按项目包管理器运行安装、lint 和必要的格式化检查：

```bash
pnpm lint:style
pnpm lint:style:fix
```

如果项目没有独立 `lint:style`，使用项目已有的 `lint` 或 `format:check`。接入共享配置包自身时，在 `stylelint17/` 下运行：

```bash
npm test
npm run lint
npm pack --dry-run --json
```
