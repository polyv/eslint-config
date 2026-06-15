# 保利威前端工程 ESLint 通用配置

## 安装和使用

确保 Node.js 版本符合 **^20.10.0**（未测试其他版本的可用性），运行 npm 命令安装：

```bash
npm install @polyv/eslint-config --save-dev
```

在项目中创建 `.eslintrc.js`（一般在根目录下创建），根据工程的开发语言和框架配置 `extends` 字段：

```javascript
/* eslint-env node */

// 纯 JavaScript 工程的配置
module.exports = {
  root: true,
  extends: [
    './node_modules/@polyv/eslint-config/lib/for-js'
  ]
};
```

```javascript
/* eslint-env node */

// 纯 TypeScript 工程的配置
module.exports = {
  root: true,
  extends: [
    './node_modules/@polyv/eslint-config/lib/for-js',
    './node_modules/@polyv/eslint-config/lib/for-ts'
  ]
};
```

```javascript
/* eslint-env node */

// Vue.js 2.x 工程（JavaScript）的配置
module.exports = {
  root: true,
  extends: [
    './node_modules/@polyv/eslint-config/lib/for-vue2-js'
  ]
};
```

## 注意点

### 严格模式

部分规则在严格模式下（环境变量 `STRICT_LINT` 不为 `false` 时），告警级别为错误，其他情况为警告。这些规则包括：

- sonarjs/no-nested-template-literals
- @typescript-eslint/naming-convention
- vue/custom-event-name-casing
- vue/no-mutating-props
- vue/multi-word-component-names
- vue/attribute-hyphenation
- vue/v-on-event-hyphenation

### 生产环境构建的差异

部分规则在环境变量 `NODE_ENV` 为 `production` 时，告警级别为错误，其他情况下为警告。这些规则包括：

- no-debugger
- no-unused-vars
- no-constant-condition
- no-empty
- sonarjs/no-duplicate-string
- @typescript-eslint/no-unused-vars
- @typescript-eslint/explicit-module-boundary-types
