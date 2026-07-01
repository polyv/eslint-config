# @polyv/stylelint-config

这是面向 Stylelint 17.x 的共享配置包，从 `chat-sdk-v2` 当前使用的 `stylelint.config.mjs` 抽离而来，覆盖 SCSS、Vue SFC、属性排序、Prettier 和 Polyv 项目常用样式约定。

## 安装

```bash
npm install @polyv/stylelint-config stylelint@^17 prettier@^3 --save-dev
```

pnpm / yarn 项目按对应包管理器安装：

```bash
pnpm add -D @polyv/stylelint-config stylelint@^17 prettier@^3
yarn add -D @polyv/stylelint-config stylelint@^17 prettier@^3
```

## 使用

在消费项目根目录创建或替换 `stylelint.config.mjs`：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig();
```

如果项目只需要覆盖个别规则：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig({
  rules: {
    'selector-class-pattern': null
  }
});
```

如果项目需要追加本地忽略项：

```javascript
import { defineConfig } from '@polyv/stylelint-config';

export default defineConfig({
  ignoreFiles: ['**/custom-output/**']
});
```

`defineConfig()` 会返回完整 Stylelint 配置，并让 `ignoreFiles` 在消费项目根目录下解析。它内部会把共享包依赖的 config 和 plugin 解析成绝对路径，避免 pnpm 项目必须直接安装 `stylelint-config-standard-scss`、`stylelint-prettier`、`@stylistic/stylelint-plugin` 等共享包内部依赖。

## 兼容用法

仍然兼容 Stylelint 共享配置的直接 `extends` 写法：

```javascript
export default {
  extends: ['@polyv/stylelint-config']
};
```

如果在兼容写法里配置 `ignoreFiles`，注意 `ignoreFiles` 会覆盖继承配置里的默认值，需要显式复用共享包导出的默认忽略项：

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

推荐脚本：

```json
{
  "scripts": {
    "lint:style": "stylelint \"**/*.{css,scss,vue}\" --allow-empty-input",
    "lint:style:fix": "stylelint \"**/*.{css,scss,vue}\" --fix --allow-empty-input"
  }
}
```

## 配置内容

- 继承 `stylelint-config-standard-scss`、`stylelint-config-standard-vue/scss` 和 `stylelint-config-recess-order`。
- 接入 `stylelint-prettier` 和 `@stylistic/stylelint-plugin`。
- 默认忽略 `dist`、`node_modules` 和 `svg` 文件。
- 保留 `chat-sdk-v2` 已验证的颜色函数、字符串、逗号、括号、选择器、媒体查询、SCSS 变量、属性排序和 Prettier 规则。

## 发布校验

```bash
npm test
npm run lint
npm pack --dry-run --json
```
