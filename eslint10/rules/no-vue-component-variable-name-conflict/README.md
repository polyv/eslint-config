# no-vue-component-variable-name-conflict

`polyv/no-vue-component-variable-name-conflict` 用于禁止 Vue `<script setup>` 中的组件导入名和 lower camel 本地声明产生命名冲突。

## 适用场景

在 `<script setup>` 中，Vue 组件导入名通常会在模板里自动暴露。例如 `MemberType` 会对应模板里的 `<member-type>`。

如果同一个 `<script setup>` 又声明了 `memberType` 变量、函数或类，模板和 ESLint 的变量使用标记容易把 `<member-type>` 关联到 `memberType`，从而导致真正的组件导入 `MemberType` 被判断为未使用。

## 使用方式

如果已经组合 `polyv.configs.common`，`polyv` plugin 会自动注册：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  {
    rules: {
      'polyv/no-vue-component-variable-name-conflict': 'error'
    }
  }
];
```

Vue2 项目通常直接组合 `polyv.configs.vue2`，该配置会默认启用本规则：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts,
  ...polyv.configs.vue2
];
```

## 错误示例

```vue
<!-- bad.vue -->
<template>
  <member-type v-model="memberType" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MemberType from './components/member-type.vue';

const memberType = ref('online');
</script>
```

## 正确示例

```vue
<!-- good.vue -->
<template>
  <member-type v-model="currentMemberType" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MemberType from './components/member-type.vue';

const currentMemberType = ref('online');
</script>
```

## 检查范围

该规则只检查 `.vue` 文件中的 `<script setup>`：

- 收集模板里的 kebab-case 标签，例如 `<member-type>`。
- 收集 `<script setup>` 中 PascalCase 组件导入，例如 `MemberType`。
- 把组件名转换为 kebab-case 标签名和 lower camel 变量名，例如 `MemberType` 对应 `<member-type>` 和 `memberType`。
- 检查 `<script setup>` 中同名 lower camel 的变量、函数或类声明。

## 自动修复

该规则不提供自动修复。变量改名会影响业务语义和引用范围，应由开发者按提示手动调整为更明确的名称，例如 `currentMemberType`。
