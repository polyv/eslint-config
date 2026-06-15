function getFilename(context) {
  return context.filename || context.getFilename?.();
}

function isVueFile(context) {
  return getFilename(context)?.endsWith('.vue') === true;
}

function getSourceCode(context) {
  return context.sourceCode || context.getSourceCode();
}

function getParserServices(context) {
  return getSourceCode(context).parserServices || context.parserServices;
}

function getAttributeName(attribute) {
  return attribute?.key?.name ?? null;
}

function isScriptSetupElement(node) {
  return (
    node.type === 'VElement' &&
    node.name === 'script' &&
    node.startTag?.attributes?.some((attribute) => getAttributeName(attribute) === 'setup')
  );
}

function getScriptSetupRanges(context) {
  const services = getParserServices(context);
  const fragment = services?.getDocumentFragment?.();

  if (!fragment?.children) {
    return [];
  }

  return fragment.children
    .filter(isScriptSetupElement)
    .map((node) => [
      node.startTag.range[1],
      node.endTag?.range?.[0] ?? node.range[1]
    ]);
}

function isInRanges(node, ranges) {
  if (!node?.range) {
    return false;
  }

  return ranges.some(([start, end]) => node.range[0] >= start && node.range[1] <= end);
}

function isKebabCaseTagName(tagName) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/.test(tagName);
}

function isComponentLocalName(name) {
  return /^[A-Z]/.test(name);
}

function toKebabCase(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function toLowerCamelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function toSuggestName(componentName) {
  return `current${componentName}`;
}

function getImportLocalNames(node) {
  return node.specifiers
    .map((specifier) => specifier.local?.name)
    .filter((name) => typeof name === 'string' && isComponentLocalName(name));
}

function addLocalDeclaration(localDeclarations, name, node) {
  if (!name || localDeclarations.has(name)) {
    return;
  }

  localDeclarations.set(name, node);
}

function collectPatternIdentifiers(pattern, identifiers) {
  if (!pattern) {
    return;
  }

  if (pattern.type === 'Identifier') {
    identifiers.push(pattern);
    return;
  }

  if (pattern.type === 'RestElement') {
    collectPatternIdentifiers(pattern.argument, identifiers);
    return;
  }

  if (pattern.type === 'AssignmentPattern') {
    collectPatternIdentifiers(pattern.left, identifiers);
    return;
  }

  if (pattern.type === 'ArrayPattern') {
    pattern.elements.forEach((element) => collectPatternIdentifiers(element, identifiers));
    return;
  }

  if (pattern.type === 'ObjectPattern') {
    pattern.properties.forEach((property) => {
      if (property.type === 'Property') {
        collectPatternIdentifiers(property.value, identifiers);
        return;
      }

      collectPatternIdentifiers(property.argument, identifiers);
    });
  }
}

function getDeclarationIdentifierNodes(node) {
  if (
    (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') &&
    node.id?.type === 'Identifier'
  ) {
    return [node.id];
  }

  if (node.type !== 'VariableDeclarator') {
    return [];
  }

  const identifiers = [];
  collectPatternIdentifiers(node.id, identifiers);
  return identifiers;
}

function isRootTemplateElement(node) {
  return (node.rawName || node.name) === 'template' && node.parent?.type === 'VDocumentFragment';
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止 Vue script setup 中的组件导入名和 lower camel 本地声明产生命名冲突'
    },
    schema: [],
    messages: {
      componentVariableNameConflict:
        '变量 "{{variableName}}" 与组件 "{{componentName}}" 的模板标签 "<{{tagName}}>" 命名冲突，可能导致模板把该标签识别为变量而不是组件。请将变量改成更明确的名称，例如 "{{suggestName}}"。'
    }
  },
  create(context) {
    if (!isVueFile(context)) {
      return {};
    }

    const services = getParserServices(context);
    if (!services?.defineTemplateBodyVisitor) {
      return {};
    }

    const scriptSetupRanges = getScriptSetupRanges(context);
    if (scriptSetupRanges.length === 0) {
      return {};
    }

    const templateTags = new Set();
    const componentImports = new Map();
    const localDeclarations = new Map();
    let hasReported = false;

    function reportConflicts() {
      if (hasReported) {
        return;
      }

      hasReported = true;

      componentImports.forEach((component) => {
        const localDeclaration = localDeclarations.get(component.variableName);
        if (!templateTags.has(component.tagName) || !localDeclaration) {
          return;
        }

        context.report({
          node: localDeclaration,
          messageId: 'componentVariableNameConflict',
          data: component
        });
      });
    }

    return services.defineTemplateBodyVisitor(
      {
        VElement(node) {
          const tagName = node.rawName || node.name;
          if (typeof tagName === 'string' && isKebabCaseTagName(tagName)) {
            templateTags.add(tagName);
          }
        },
        'VElement:exit'(node) {
          if (isRootTemplateElement(node)) {
            reportConflicts();
          }
        }
      },
      {
        ImportDeclaration(node) {
          if (!isInRanges(node, scriptSetupRanges)) {
            return;
          }

          getImportLocalNames(node).forEach((componentName) => {
            const tagName = toKebabCase(componentName);
            componentImports.set(componentName, {
              componentName,
              tagName,
              variableName: toLowerCamelCase(componentName),
              suggestName: toSuggestName(componentName)
            });
          });
        },
        VariableDeclarator(node) {
          if (!isInRanges(node, scriptSetupRanges)) {
            return;
          }

          getDeclarationIdentifierNodes(node).forEach((identifier) => {
            addLocalDeclaration(localDeclarations, identifier.name, identifier);
          });
        },
        FunctionDeclaration(node) {
          if (!isInRanges(node, scriptSetupRanges)) {
            return;
          }

          getDeclarationIdentifierNodes(node).forEach((identifier) => {
            addLocalDeclaration(localDeclarations, identifier.name, identifier);
          });
        },
        ClassDeclaration(node) {
          if (!isInRanges(node, scriptSetupRanges)) {
            return;
          }

          getDeclarationIdentifierNodes(node).forEach((identifier) => {
            addLocalDeclaration(localDeclarations, identifier.name, identifier);
          });
        }
      }
    );
  }
};
