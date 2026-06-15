# no-relative-directory-index-imports

`polyv/no-relative-directory-index-imports` 用于禁止依赖相对目录的 `index` 文件兜底解析。

## 适用场景

微信小程序 npm 构建后，不保证把相对目录路径自动解析到该目录下的 `index` 文件。业务代码如果写成 `./helper`、`.`、`..` 这类目录入口，构建后可能出现运行时路径解析失败。

## 使用方式

如果已经组合 `polyv.configs.common`，`polyv` plugin 会自动注册：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  {
    rules: {
      'polyv/no-relative-directory-index-imports': 'error'
    }
  }
];
```

小程序项目通常直接使用 `polyv.configs.miniprogram`：

```javascript
// eslint.config.mjs
import polyv from '@polyv/eslint-config';

export default [
  ...polyv.configs.common,
  ...polyv.configs.miniprogram
];
```

## 错误示例

```javascript
// bad.js
import helper from './helper';
import current from '.';
import parent from '..';
const utils = require('./utils');
```

## 正确示例

```javascript
// good.js
import helper from './helper/index';
import current from './index';
import parent from '../index';
const utils = require('./utils/index');
```

## 自动修复

该规则支持自动修复，会把相对目录入口补成显式 `index` 路径。

例如：

```javascript
// bad.js
import helper from './helper';
```

会修复为：

```javascript
// good.js
import helper from './helper/index';
```

## 检查范围

该规则会检查：

- `import ... from '...'`
- `export ... from '...'`
- `export * from '...'`
- `import('...')`
- `require('...')`

该规则不会处理已经带扩展名的路径，也不会处理已经显式写出 `index` 的路径。
