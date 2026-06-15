import sonarjsPlugin from 'eslint-plugin-sonarjs';

export default [
  // 启用 sonarjs 推荐规则，检查复杂度、重复代码和常见逻辑问题。
  sonarjsPlugin.configs.recommended,
  {
    rules: {
      // 限制函数认知复杂度，避免过多分支和嵌套。
      'sonarjs/cognitive-complexity': ['error', 20],
      // 关闭 elseif 必须带 else 的限制。
      'sonarjs/elseif-without-else': 'off',
      // 限制 switch 分支数量。
      'sonarjs/max-switch-cases': 'error',
      // 禁止所有条件分支代码完全相同。
      'sonarjs/no-all-duplicated-branches': 'error',
      // 禁止可以合并的嵌套 if。
      'sonarjs/no-collapsible-if': 'error',
      // 关闭注释代码检查，避免示例代码或兼容性注释误报。
      'sonarjs/no-commented-code': 'off',
      // 关闭明文协议检查，允许历史配置或示例中保留 http 等协议字符串。
      'sonarjs/no-clear-text-protocols': 'off',
      // 关闭集合长度误判检查，避免现有代码误报。
      'sonarjs/no-collection-size-mischeck': 'off',
      // 关闭重复字符串检查，避免业务常量、文案和接口路径产生大量误报。
      'sonarjs/no-duplicate-string': 'off',
      // 禁止不同分支出现重复代码块。
      'sonarjs/no-duplicated-branches': 'error',
      // 禁止刚赋值的元素被立即覆盖。
      'sonarjs/no-element-overwrite': 'error',
      // 禁止对明显为空的集合做无意义操作。
      'sonarjs/no-empty-collection': 'error',
      // 禁止调用函数时传入多余参数。
      'sonarjs/no-extra-arguments': 'error',
      // 禁止无意义或永远同值的表达式。
      'sonarjs/no-gratuitous-expressions': 'error',
      // 关闭硬编码 IP 检查，允许本地开发、内网地址或示例配置。
      'sonarjs/no-hardcoded-ip': 'off',
      // 禁止多个条件分支使用相同判断。
      'sonarjs/no-identical-conditions': 'error',
      // 禁止表达式两边完全相同。
      'sonarjs/no-identical-expressions': 'error',
      // 禁止多个函数实现完全相同。
      'sonarjs/no-identical-functions': 'error',
      // 禁止忽略应该使用的返回值。
      'sonarjs/no-ignored-return': 'error',
      // 关闭忽略异常检查，允许业务代码显式吞掉可忽略异常。
      'sonarjs/no-ignored-exceptions': 'off',
      // 关闭不变返回值检查，避免简单分支适配代码误报。
      'sonarjs/no-invariant-returns': 'off',
      // 关闭反向布尔判断检查。
      'sonarjs/no-inverted-boolean-check': 'off',
      // 禁止嵌套 switch。
      'sonarjs/no-nested-switch': 'error',
      // 禁止嵌套模板字符串。
      'sonarjs/no-nested-template-literals': 'error',
      // 禁止冗余布尔表达式。
      'sonarjs/no-redundant-boolean': 'error',
      // 禁止多余的 return、break 或 continue。
      'sonarjs/no-redundant-jump': 'error',
      // 关闭冗余类型别名检查，避免历史类型抽象或导出别名误报。
      'sonarjs/redundant-type-aliases': 'off',
      // 禁止同一行写复杂条件逻辑。
      'sonarjs/no-same-line-conditional': 'error',
      // 禁止过小的 switch。
      'sonarjs/no-small-switch': 'error',
      // 禁止创建或修改后没有实际使用的集合。
      'sonarjs/no-unused-collection': 'error',
      // 禁止使用没有返回值的函数调用结果。
      'sonarjs/no-use-of-empty-return-value': 'error',
      // 禁止只重新抛出异常的无意义 catch。
      'sonarjs/no-useless-catch': 'error',
      // 关闭从 PATH 查找系统命令的检查，避免 Node 工具脚本场景误报。
      'sonarjs/no-os-command-from-path': 'off',
      // 检查疑似写错的操作符组合。
      'sonarjs/non-existent-operator': 'error',
      // 建议直接返回表达式而不是先赋值再返回。
      'sonarjs/prefer-immediate-return': 'error',
      // 建议使用对象字面量。
      'sonarjs/prefer-object-literal': 'error',
      // 关闭单一布尔返回简化建议。
      'sonarjs/prefer-single-boolean-return': 'off',
      // 关闭伪随机数检查，允许非安全场景使用 Math.random 等实现。
      'sonarjs/pseudo-random': 'off',
      // 关闭慢正则检查，避免复杂兼容正则误报。
      'sonarjs/slow-regex': 'off',
      // 关闭待办标签检查，允许历史注释或临时事项保留。
      'sonarjs/todo-tag': 'off',
      // for 循环没有初始化或更新逻辑时建议改成 while。
      'sonarjs/prefer-while': 'error'
    }
  }
];
