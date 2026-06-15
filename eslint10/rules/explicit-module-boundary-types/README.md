# explicit-module-boundary-types

`polyv/explicit-module-boundary-types` 基于 `@typescript-eslint/explicit-module-boundary-types` 封装，用于要求导出函数显式声明模块边界类型，同时允许指定函数或方法省略返回类型。

## 适用场景

Hook 函数经常返回组合对象、响应式引用或多个工具方法。强制写返回类型容易让声明变得冗长，并且可能削弱 TypeScript 对组合返回值的推导体验。

该规则只放开匹配函数或方法的返回类型要求，不会放开参数类型要求，也不会放开未匹配函数的返回类型要求。

## 使用方式

如果已经组合 `polyv.configs.common`，`polyv` plugin 会自动注册：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  {
    rules: {
      'polyv/explicit-module-boundary-types': ['error', {
        allowHookReturnTypeInference: true,
        allowedReturnTypeInferencePatterns: [
          '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
        ]
      }]
    }
  }
];
```

TypeScript 项目通常直接使用 `polyv.configs.ts`：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.ts
];
```

## 错误示例

```typescript
// bad.ts
export function createService() {
  return { value: 1 };
}
```

## 正确示例

```typescript
// good.ts
export function createService(): { value: number } {
  return { value: 1 };
}

export function useDemo() {
  return { value: 1 };
}
```

## 返回类型推导

当 `allowHookReturnTypeInference` 为 `true` 时，函数名符合 `useXxx` 会被视为 hook 函数并允许省略返回类型，例如：

- `useDemo`
- `useUserInfo`
- `use2dCanvas`

也可以通过 `allowedReturnTypeInferencePatterns` 配置允许省略返回类型的函数或方法名正则，例如：

```javascript
// eslint.config.mjs
{
  rules: {
    'polyv/explicit-module-boundary-types': ['error', {
      allowedReturnTypeInferencePatterns: [
        '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
      ]
    }]
  }
}
```

场景配置也可以通过 settings 注入同名配置；settings 会和规则 options 合并：

```javascript
// eslint.config.mjs
{
  settings: {
    'polyv/explicit-module-boundary-types': {
      allowedReturnTypeInferencePatterns: [
        '^[A-Za-z_$][\\w$]*(?:Props?|Emits?)$'
      ]
    }
  }
}
```

该规则不会根据文件路径放开整个文件，因此 `hooks/` 目录里的普通导出函数仍然需要声明返回类型。

## 规则选项

该规则继承 `@typescript-eslint/explicit-module-boundary-types` 的原有选项，并额外支持：

- `allowHookReturnTypeInference`：是否允许 `useXxx` hook 函数省略模块边界返回类型，默认值为 `false`。
- `allowedReturnTypeInferencePatterns`：允许省略模块边界返回类型的函数或方法名正则列表，默认值为 `[]`。

## Settings

该规则会读取 `settings['polyv/explicit-module-boundary-types']`，目前支持：

- `allowHookReturnTypeInference`
- `allowedReturnTypeInferencePatterns`

当 settings 和规则 options 都配置了 `allowedReturnTypeInferencePatterns` 时，两者会合并生效。

## 自动修复

该规则不提供自动修复。返回类型需要根据实际 API 边界手动补充。
