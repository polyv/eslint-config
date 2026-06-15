# TypeScript 配置

`polyv.configs.ts` 用于 TypeScript 项目或 TypeScript + JavaScript 混合项目。它已经集成 `polyv.configs.js`，因此混合项目不需要再额外引入 `polyv.configs.js`。

## 使用方式

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts
];
```

## 配置内容

- 集成 `polyv.configs.js`，覆盖 JavaScript 文件。
- 启用 `typescript-eslint` 的 `tseslint.configs.recommended`。
- 复用 `importX.flatConfigs.typescript` 的 TypeScript 处理，补充 TS 扩展名、`@typescript-eslint/parser` 映射和 TypeScript resolver，并关闭 TS 场景下容易误报的 `import-x/named`。
- 配置 TypeScript 文件范围：`**/*.{ts,tsx}`。
- 注入 browser 和 node 全局变量。
- 使用 `@stylistic` 承接 ESLint 10 生态中已经移除的 TypeScript 格式类规则，例如分号、缩进、逗号空格、尾逗号、函数括号前空格和类型注解空格。
- 迁移 ESLint 8 `for-ts.js` 中仍适用的 TypeScript 规则。
- 不使用 `STRICT_LINT` 分支，相关规则统一按当前配置写死。

## 关键规则

- `@typescript-eslint/no-unused-vars`：未使用变量给出 `warn`，检查全部变量，允许 `_` 前缀变量和参数，允许对象 rest 兄弟属性。
- `@typescript-eslint/no-explicit-any`：关闭 `any` 限制，兼容历史代码。
- `@typescript-eslint/no-empty-object-type`：关闭空对象类型限制，兼容历史 `{}` 类型写法。
- `@typescript-eslint/no-namespace`：关闭 namespace 限制，兼容历史声明合并或 SDK 类型组织方式。
- `@typescript-eslint/no-unused-expressions`：禁止无用表达式，但允许短路表达式和三元表达式承载调用逻辑。
- `polyv/explicit-module-boundary-types`：基于 `@typescript-eslint/explicit-module-boundary-types` 封装，按环境使用 `devWarnProdError`，生产环境为 `error`，其他环境为 `warn`；默认要求导出函数声明返回类型，具体场景可通过 settings 放开特定命名的返回类型推导。
- `no-empty`：禁止空代码块，但允许空 `catch`。
- `no-useless-escape`：关闭无意义转义检查，兼容历史字符串和正则写法。

## 注意事项

- `configs.ts` 不注册 `polyv`、`import-x`、`promise` 或 `sonarjs` 插件。
- 接入时必须显式组合 `polyv.configs.common`。
- Vue2 项目需要允许 `useXxx`、`xxxProp(s)` / `xxxEmit(s)` 省略返回类型时，在 `configs.ts` 后面继续组合 `polyv.configs.vue2`。
