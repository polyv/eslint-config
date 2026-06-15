# polyv-eslint-config

用于给消费项目接入 `@polyv/eslint-config` 的 ESLint 10 flat config。

## 通过 Git 地址安装

Git 地址：

```text
https://git-internal.polyv.net/frontend/eslint-config.git
```

Skill 路径：

```text
skills/polyv-eslint-config
```

如果安装器支持 Git URL + path，使用上面的 Git 地址和 Skill 路径安装。

通用本地安装方式：

```bash
git clone https://git-internal.polyv.net/frontend/eslint-config.git
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R eslint-config/skills/polyv-eslint-config "${CODEX_HOME:-$HOME/.codex}/skills/polyv-eslint-config"
```

## 适用任务

- 给业务项目接入 `@polyv/eslint-config`
- 迁移到 ESLint 10 flat config
- 给 JS / TS / Vue2 / 小程序项目，以及兼容小程序的 SDK/第三方包项目组合 `polyv.configs.*`
- 迁移旧版 `for-vue2-js`、`plugin:vue/essential` 或 Vue2 `.vue` 解析配置到 `polyv.configs.vue2`
- 接入 `configs.common` 时同步纳入消费项目内多级 `.gitignore` 的忽略规则
- 使用共享 `configs.prettier` 或 `prettier-config`
- 项目继续使用 Prettier CLI/扩展格式化时，也可以组合 `configs.prettier`，并复用共享 `prettier-config`
- 根据共享规则修复 lint 报错
- 配置编辑器保存代码时自动格式化，参考 `references/editor-save-format.md`
