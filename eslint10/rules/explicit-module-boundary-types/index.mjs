import tseslint from 'typescript-eslint';

const baseRule = tseslint.plugin.rules['explicit-module-boundary-types'];
const baseOptionsSchema = baseRule.meta.schema[0];
const settingsKey = 'polyv/explicit-module-boundary-types';

function getKeyName(key) {
  if (!key) {
    return null;
  }

  if (key.type === 'Identifier') {
    return key.name;
  }

  if (key.type === 'Literal' && typeof key.value === 'string') {
    return key.value;
  }

  return null;
}

function getFunctionName(node) {
  if (node.id?.type === 'Identifier') {
    return node.id.name;
  }

  const parent = node.parent;
  if (!parent) {
    return null;
  }

  if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
    return parent.id.name;
  }

  if (
    parent.type === 'MethodDefinition' ||
    parent.type === 'Property' ||
    parent.type === 'PropertyDefinition' ||
    parent.type === 'AccessorProperty' ||
    parent.type === 'TSAbstractMethodDefinition'
  ) {
    return getKeyName(parent.key);
  }

  return null;
}

function isHookName(name) {
  return /^use[A-Z0-9]/.test(name);
}

function createAllowedReturnTypeInferencePatterns(patterns = []) {
  return patterns.map((pattern) => new RegExp(pattern));
}

function getAllowedReturnTypeInferencePatterns(...patternGroups) {
  return patternGroups.flatMap((patterns) => (
    Array.isArray(patterns)
      ? patterns.filter((pattern) => typeof pattern === 'string')
      : []
  ));
}

function getRuleSettings(context) {
  const settings = context.settings?.[settingsKey];
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return {};
  }

  return settings;
}

function isAllowedReturnTypeInferenceName(name, patterns) {
  return patterns.some((pattern) => pattern.test(name));
}

function shouldIgnoreMissingReturnType(descriptor, options) {
  if (descriptor?.messageId !== 'missingReturnType') {
    return false;
  }

  const functionName = getFunctionName(descriptor.node);
  if (!functionName) {
    return false;
  }

  return (
    (options.allowHookReturnTypeInference && isHookName(functionName)) ||
    isAllowedReturnTypeInferenceName(functionName, options.allowedReturnTypeInferencePatterns)
  );
}

function createBaseContext(context, baseOptions, options) {
  const baseContext = Object.create(context);

  Object.defineProperties(baseContext, {
    options: {
      value: [baseOptions]
    },
    report: {
      value(descriptor, ...args) {
        if (args.length === 0 && shouldIgnoreMissingReturnType(descriptor, options)) {
          return;
        }

        return context.report(descriptor, ...args);
      }
    }
  });

  return baseContext;
}

export default {
  ...baseRule,
  meta: {
    ...baseRule.meta,
    docs: {
      ...baseRule.meta.docs,
      description: '要求导出函数显式声明模块边界类型，并允许指定函数或方法省略返回类型'
    },
    schema: [{
      ...baseOptionsSchema,
      properties: {
        ...baseOptionsSchema.properties,
        allowHookReturnTypeInference: {
          type: 'boolean',
          description: '是否允许 useXxx hook 函数省略模块边界返回类型。'
        },
        allowedReturnTypeInferencePatterns: {
          type: 'array',
          description: '允许省略模块边界返回类型的函数或方法名正则列表。',
          items: {
            type: 'string'
          }
        }
      }
    }]
  },
  defaultOptions: [{
    ...baseRule.defaultOptions[0],
    allowHookReturnTypeInference: false,
    allowedReturnTypeInferencePatterns: []
  }],
  create(context) {
    const settings = getRuleSettings(context);
    const ruleOptions = context.options[0] ?? {};
    const options = {
      ...baseRule.defaultOptions[0],
      allowHookReturnTypeInference: false,
      ...settings,
      ...ruleOptions,
      allowedReturnTypeInferencePatterns: getAllowedReturnTypeInferencePatterns(
        settings.allowedReturnTypeInferencePatterns,
        ruleOptions.allowedReturnTypeInferencePatterns
      )
    };
    const {
      allowHookReturnTypeInference,
      allowedReturnTypeInferencePatterns,
      ...baseOptions
    } = options;

    return baseRule.create(createBaseContext(context, baseOptions, {
      allowHookReturnTypeInference,
      allowedReturnTypeInferencePatterns: createAllowedReturnTypeInferencePatterns(allowedReturnTypeInferencePatterns)
    }));
  }
};
