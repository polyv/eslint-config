# AGENTS.md

## 项目定位

本仓库维护保利威前端共享 ESLint 配置包。主要维护对象是 `eslint10/`，它是独立发布的 ESLint 10 flat config 包，包名为 `@polyv/eslint-config`。

`eslint8/` 是旧版 ESLint 8 `.eslintrc` 体系兼容包。除非用户明确要求迁移或修复旧包，否则不要把 ESLint 10 的设计同步回 `eslint8/`。

## 目录职责

- `eslint8/`：旧版 ESLint 8 配置包，保持 CommonJS 和 `.eslintrc` 体系。
- `eslint10/`：新版 ESLint 10 配置包，保持 ESM 和 flat config 体系。
- `skills/polyv-eslint-config/`：面向消费项目接入 `@polyv/eslint-config` 的可分发 Agent Skill。
- `AGENTS.md`：本仓库的代理协作约定，只写稳定边界和维护规则。

## 常用命令

- 安装 ESLint 8 依赖：`cd eslint8 && npm install`
- 安装 ESLint 10 依赖：`cd eslint10 && npm install`
- 校验 ESLint 8：`cd eslint8 && npx eslint .`
- 打印 ESLint 8 JS 配置：`cd eslint8 && npx eslint --print-config ./lib/for-js.js`
- 校验 ESLint 10：`cd eslint10 && npm run lint`
- 测试 ESLint 10：`cd eslint10 && npm test`
- 检查 ESLint 10 发布清单：`cd eslint10 && npm pack --dry-run --json`

ESLint 8 没有专门测试套件。改动规则、parser、依赖、导出或 README 示例后，至少做有针对性的 lint、测试或配置加载校验。

## 通用维护规则

- 保持变更聚焦，不做无关重构，不回退用户已有改动。
- 不要无故修改 `eslint10/package.json` 的版本号。
- 修改依赖时使用对应包管理器生成锁文件，不手改 lockfile。
- `eslint8/lib/*.js` 保持 CommonJS。
- `eslint10/*.mjs`、`eslint10/configs/*/index.mjs`、`eslint10/rules/*/index.mjs` 保持 ESM。
- 使用分号和两个空格缩进。
- `skills/*/SKILL.md` 用中文维护；`skills/*/README.md` 说明 Git 地址安装方式。

## ESLint 10 结构约定

- `configs/common` 是消费方必须显式组合的基础层，负责通用 ignores、消费项目 `.gitignore` 递归忽略、注册 `polyv` 插件，并继承 `importx`、`sonarjs`、`promise` 推荐配置。
- `configs/js` 只负责纯 JavaScript 规则，包含 `@eslint/js` recommended；不要注册 `common` 已提供的插件，也不要维护 `import-x/*` 或 `sonarjs/*` 规则。
- `configs/ts` 负责 TypeScript 或 TS+JS 项目，必须集成 `configs/js`，并包含 `typescript-eslint` recommended 和 TypeScript 场景的 `import-x` 处理。
- `configs/vue2` 是 Vue2 补充层，放在 `js` 或 `ts` 后面组合；它支持 `.vue`、`<script lang="ts">` 和 `<script setup lang="ts">`，并通过 settings 给 Vue2 场景放开指定返回类型推导。
- `configs/miniprogram` 只保留小程序专项 ignores 和规则；不要复用 `common`，也不要注册 `polyv` 插件。
- `configs/importx` 统一维护 `eslint-plugin-import-x` 推荐配置、resolver 和 `import-x/*` 规则。
- `configs/sonarjs` 统一维护 `eslint-plugin-sonarjs` 推荐配置和 `sonarjs/*` 覆盖规则。
- `configs/prettier` 复用 `prettier-config.mjs`，接入 `eslint-plugin-prettier/recommended`，消费方使用时应放在配置数组最后。
- `plugin.mjs` 是所有 `polyv/*` 自定义规则的统一入口；插件注册由 `configs/common` 负责。

消费方接入约定：必须显式组合 `polyv.configs.common`；纯 JS 用 `js`，TS 或 TS+JS 用 `ts`，Vue2 在语言层后追加 `vue2`，小程序或兼容小程序的 SDK 追加 `miniprogram`。

## 规则和文档约定

- 每个 config 使用 `eslint10/configs/<name>/index.mjs` 和 `README.md` 成对维护。
- 每条自定义规则使用 `eslint10/rules/<rule>/index.mjs` 和 `README.md` 成对维护。
- `eslint10/configs/*/index.mjs` 中每条规则都要保留简短中文注释，说明规则作用、关闭 core 规则的原因，或说明特定文件范围内关闭的原因。
- `eslint10/README.md` 只保留整体导航、组合示例和插件用法；具体规则说明放到对应目录 README。
- 新增 `polyv/*` 规则时，同步更新 `plugin.mjs`、`package.json` exports、规则 README、相关 config README 和必要测试。

当前自定义规则：

- `polyv/explicit-module-boundary-types`：基于 `@typescript-eslint/explicit-module-boundary-types`，允许通过 options 或 settings 放开指定函数返回类型推导，参数类型检查仍保留。
- `polyv/no-relative-directory-index-imports`：禁止依赖相对目录 `index` 兜底解析，主要服务小程序运行环境。
- `polyv/no-vue-component-variable-name-conflict`：禁止 Vue `<script setup>` 中组件导入名和 lower camel 本地声明产生命名冲突，`vue2` 默认启用。

## 测试和发布约定

- ESLint 10 测试文件放在对应目标目录的 `__tests__/` 下：config 测试放 `eslint10/configs/<name>/__tests__/`，规则测试放 `eslint10/rules/<rule>/__tests__/`。
- `npm test` 使用 `node --test`，当前能自动发现嵌套 `__tests__`。
- `eslint10/configs/.npmignore` 和 `eslint10/rules/.npmignore` 用于避免 `__tests__` 被 `files` 白名单带进发布包；修改发布内容后用 `npm pack --dry-run --json` 验证。
- 如果修改 `configs/common` 的 `.gitignore` 扫描逻辑，注意跳过 `.git`、`node_modules`、`dest`、`dist`、`.dist`、`coverage` 等目录，避免递归依赖和构建产物。

## 兼容性边界

- 不要混用 `eslint8/` 和 `eslint10/` 的配置体系。
- 新增其他 ESLint 大版本包时，应放在同级独立目录，不要混进现有包。
- 如果之后添加嵌套 `AGENTS.md`，距离被编辑代码最近的文件提供最具体说明。
