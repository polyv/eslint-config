# 编辑器保存时自动格式化

当用户要求“保存代码时自动格式化”“VS Code 保存自动格式化”“编辑器自动修复格式”时，除了配置 `eslint.config.mjs` 和 `package.json` 脚本，还要处理工作区编辑器设置。

## 推荐方案：保存时运行 ESLint fix

`@polyv/eslint-config` 的 `polyv.configs.prettier` 已经通过 `eslint-plugin-prettier/recommended` 把 Prettier 纳入 ESLint。为了让命令行、CI 和编辑器使用同一套规则，推荐让编辑器保存时执行 ESLint 自动修复，而不是直接调用 Prettier 扩展。

轻量配置可以只启用保存时 ESLint fix，在消费项目添加或合并 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

如果希望保存时由 ESLint 同时承担 JS/TS 文件的 formatter 和 fixAll，可以使用更完整的工作区配置：

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.format.enable": true,
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[vue]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

这类配置适合已经接入 `polyv.configs.prettier` 的项目：JS/TS/Vue 保存时走 ESLint formatter，格式规则仍来自共享 Prettier 配置。`source.fixAll.eslint` 的字符串值按项目现有 VS Code / ESLint 扩展版本选择；新项目优先沿用当前仓库已验证的 `"always"`，如果项目已有 `"explicit"`，不要为了统一样式强行替换。

如果项目使用的 VS Code 版本或 ESLint 扩展版本较旧，`source.fixAll.eslint` 可能仍使用布尔值：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

如果是 monorepo 或嵌套包项目，补充工作目录识别；如果已经使用上面的完整配置，则不需要重复添加：

```json
{
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ]
}
```

## 推荐扩展

在消费项目添加或合并 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

如果项目完全不使用 Prettier 扩展处理 JSON、Markdown 或其他非 JS/TS 文件，可以只推荐 `dbaeumer.vscode-eslint`。如果保留 Prettier 扩展，建议只把它设置给 JSON、JSONC、Markdown 等非 ESLint 主入口文件：

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

这种分工下，JS/TS 通过 ESLint 读取 `polyv.configs.prettier`，JSON/Markdown 通过 Prettier 扩展读取 `prettier.config.mjs`。如果项目没有给 Prettier CLI 或扩展提供 `prettier.config.mjs`，就不要把 Prettier 扩展设为默认格式化入口。

## 如果项目继续用 Prettier 扩展或 Prettier CLI 格式化

继续用 Prettier 扩展或 Prettier CLI 做格式化时，仍然可以组合 `polyv.configs.prettier`。`polyv.configs.prettier` 和 `@polyv/eslint-config/prettier-config` 使用的是同一份共享格式选项，所以 ESLint 报告的格式差异和 Prettier 实际格式化结果应该一致。

先判断项目希望哪个工具作为格式化入口：

- 希望保存时由 ESLint 统一处理：使用 `source.fixAll.eslint`，`format` / `format:check` 可使用 `eslint . --fix` / `eslint .`。
- 希望继续由 Prettier 扩展、Prettier CLI 或脚手架处理格式化：保留 Prettier 入口，同时让 Prettier 读取共享配置。
- 只有项目明确不希望 ESLint 报告 Prettier 格式差异时，才不组合 `polyv.configs.prettier`。

保留 Prettier 扩展时，添加 `prettier.config.mjs`：

```javascript
// prettier.config.mjs
import prettierConfig from '@polyv/eslint-config/prettier-config';

export default prettierConfig;
```

并在 `.vscode/settings.json` 中要求存在 Prettier 配置：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.requireConfig": true
}
```

这种模式下，`package.json` 脚本继续使用 Prettier：

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

如果同时需要 ESLint 修复非格式类问题，可以保留：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

这种模式下要提醒用户：Prettier 扩展或 Prettier CLI 负责格式化，ESLint 仍可通过 `polyv.configs.prettier` 报告格式差异；两者必须使用同一份 `@polyv/eslint-config/prettier-config`，避免保存时和 lint 时格式结果不一致。

## 同步 package.json 脚本

如果保存时自动格式化改成 ESLint fix，脚本也要保持一致：

```json
{
  "scripts": {
    "format": "eslint . --fix",
    "format:check": "eslint ."
  }
}
```

如果原来的 `format:check` 是 `prettier --check .`、框架脚手架包装的 Prettier 检查命令，或其他只检查格式不跑 ESLint 的命令，接入 `polyv.configs.prettier` 后可以按项目偏好选择：

- 希望格式检查统一走 ESLint：改成等价的 `eslint` 命令。
- 希望继续用 Prettier CLI 或脚手架检查格式：保留原命令，但要让 Prettier 读取 `@polyv/eslint-config/prettier-config`。

## 合并已有设置时的注意点

- 不要直接覆盖已有 `.vscode/settings.json`；先读取并合并项目已有设置。
- 如果项目已经有 `editor.defaultFormatter`，确认它是否只针对某些语言生效，避免误删项目需要的局部配置。
- 如果项目已有 `[javascript]`、`[typescript]` 等语言级 formatter，优先保留项目语义；需要切到 ESLint formatter 时，只改 JS/TS 相关语言，不要影响 JSON、Markdown 等文件。
- 如果项目有 Vue、React、Node 子包等不同工作目录，优先使用 `eslint.workingDirectories` 或项目已有工作区配置。
- 不要为了保存格式化删除项目仍在使用的 Prettier 配置；只有在确认 `polyv.configs.prettier` 已承接格式规则后再收敛。

## 验证

完成后至少执行：

```bash
node -c eslint.config.mjs
git diff --check
npm run lint
```

根据项目包管理器把 `npm run lint` 替换成 `pnpm lint`、`pnpm run lint` 或 `yarn lint`。如果修改了 `format` 或 `format:check`，也执行对应脚本。
