# Vue2 配置

`polyv.configs.vue2` 用于 Vue2 项目中的补充规则配置，包含 Vue2 SFC 解析、Vue2 essential 规则、从 ESLint 8 `for-vue2-js.js` 迁移的 Vue 规则，以及 Vue2 TypeScript 场景的返回类型推导 settings。

## 使用方式

Vue2 JavaScript 项目放在 `polyv.configs.js` 后面：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.js,
  ...polyv.configs.vue2
];
```

Vue2 TypeScript 项目放在 `polyv.configs.ts` 后面：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.vue2
];
```

## 配置内容

- 启用 `eslint-plugin-vue` 的 `flat/vue2-essential`，承接 ESLint 8 的 `plugin:vue/essential`。
- 为 `.vue` 文件配置 `vue-eslint-parser` 和 `typescript-eslint` parser，支持普通 `<script>`、`<script lang="ts">` 和 `<script setup lang="ts">`。
- 为 `.vue` 文件注入 browser、node 和 jest 全局变量。
- 从 ESLint 8 `for-vue2-js.js` 和 live-watch-sdk 本地 `.eslintrc.js` 迁移 Vue 规则，包括模板缩进、自闭合标签、属性换行、自定义事件命名、props 修改限制、组件名限制、attribute 连字符命名、v-on 事件连字符命名、模板组件名大小写和 style 属性限制。
- 提供 `settings['polyv/explicit-module-boundary-types']`，不覆盖 `polyv.configs.ts` 中的规则配置。
- 通过 settings 允许 `useXxx` hook 函数省略返回类型。
- 通过 settings 允许 `xxxProp`、`xxxProps`、`xxxEmit`、`xxxEmits` 这类 Vue2 props/emits 工厂方法省略返回类型。
- 仍然要求普通导出函数声明返回类型。
- 仍然检查参数类型，不会因为函数名匹配就放开参数类型。
- 启用 `polyv/no-vue-component-variable-name-conflict`，避免 `<script setup>` 中组件导入名和 lower camel 本地声明冲突。

## 关键规则

- `vue/html-indent`：要求 template 使用 2 个空格缩进。
- `vue/html-self-closing`：要求 void HTML 标签和组件使用自闭合，普通 HTML 标签不使用自闭合。
- `vue/no-v-html`：关闭 `v-html` 限制，兼容历史富文本渲染场景。
- `vue/max-attributes-per-line`：单行元素最多 3 个属性，多行元素每行 1 个属性。
- `vue/custom-event-name-casing`：要求自定义事件名称使用 `kebab-case`。
- `vue/no-mutating-props`：禁止直接修改 props。
- `vue/multi-word-component-names`：要求组件名使用多个单词，但允许 `index`、`Index`、`default`、`Default`。
- `vue/attribute-hyphenation`：要求模板中的 attribute 使用连字符命名。
- `vue/v-on-event-hyphenation`：要求 `v-on` 监听的自定义事件使用连字符命名。
- `vue/component-name-in-template-casing`：要求模板中已注册组件使用 `kebab-case` 标签名。
- `vue/enforce-style-attribute`：约束 `<style>` 标签属性，允许普通 `<style>`，违规时给出警告。
- `polyv/no-vue-component-variable-name-conflict`：禁止 Vue `<script setup>` 中的组件导入名和 lower camel 本地声明产生命名冲突。

## 示例

```typescript
// good.ts
export function dialogProps() {
  return {
    visible: Boolean
  };
}

export function dialogEmits() {
  return ['confirm', 'cancel'];
}
```

```typescript
// bad.ts
export function createDialog() {
  return {
    visible: Boolean
  };
}
```

## 注意事项

`configs.vue2` 不内联引入 `common`、`js` 或 `ts`。接入完整预设时仍应显式组合 `polyv.configs.common`，并按项目语言选择 `polyv.configs.js` 或 `polyv.configs.ts`。
