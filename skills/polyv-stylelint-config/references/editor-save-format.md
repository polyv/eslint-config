# 编辑器保存时自动格式化样式

当用户要求“保存时自动格式化”“VS Code 保存自动修复”“编辑器自动格式化样式”时，除了配置 `stylelint.config.mjs` 和 `package.json` 脚本，还要处理工作区编辑器设置。

## 工作原则

- 先读取项目现有 `.vscode/settings.json` 和 `.vscode/extensions.json`，合并配置而不是覆盖。
- 推荐让 VS Code 保存时运行 Stylelint fix。`@polyv/stylelint-config` 已通过 `stylelint-prettier` 接入 Prettier，所以 CSS、SCSS 和 Vue SFC style block 的格式修复应由 Stylelint 统一承接。
- 如果项目继续使用 Prettier 扩展格式化 JSON、Markdown 等非样式文件，可以保留 Prettier 扩展，但不要把 Prettier 设为 CSS、SCSS、Vue 样式格式化入口。
- 如果项目已经配置 ESLint 保存修复，不要替换现有项，只追加 Stylelint。

## VS Code settings

轻量配置可以在 `.vscode/settings.json` 中加入：

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  },
  "stylelint.validate": [
    "css",
    "scss",
    "vue"
  ],
  "css.validate": false,
  "scss.validate": false
}
```

如果项目已经配置 ESLint 保存修复，合并 `editor.codeActionsOnSave`：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  }
}
```

如果项目需要保留 Prettier 扩展处理非样式文件，可以按语言限定：

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

## VS Code extensions

推荐在 `.vscode/extensions.json` 中加入 Stylelint 扩展：

```json
{
  "recommendations": [
    "stylelint.vscode-stylelint"
  ]
}
```

如果项目已有 `recommendations`，只追加 `stylelint.vscode-stylelint`，不要删除已有扩展推荐。

## 验证

保存配置完成后，运行 `lint:style` 或项目现有 lint 命令，确认 CLI 和编辑器使用同一套规则。若保存时没有触发修复，优先检查：

- 项目是否已安装 `stylelint`、`prettier` 和 `@polyv/stylelint-config`。
- `stylelint.config.mjs` 是否能被 Stylelint CLI 正常加载。
- VS Code 是否安装并启用 `stylelint.vscode-stylelint`。
- `stylelint.validate` 是否包含当前文件语言，例如 `css`、`scss` 或 `vue`。
