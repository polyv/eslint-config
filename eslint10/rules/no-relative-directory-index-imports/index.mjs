import fs from 'node:fs';
import path from 'node:path';

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const indexExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

function isRelativeSpecifier(specifier) {
  return specifier === '.' || specifier === '..' || specifier.startsWith('./') || specifier.startsWith('../');
}

function hasExplicitIndex(specifier) {
  return /(?:^|\/)index$/.test(specifier);
}

function hasExplicitExtension(specifier) {
  return Boolean(path.posix.extname(specifier));
}

function hasMatchingFile(resolvedPath) {
  return fileExtensions.some((extension) => fs.existsSync(`${resolvedPath}${extension}`));
}

function hasDirectoryIndex(resolvedPath) {
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }

  return indexExtensions.some((extension) => fs.existsSync(path.join(resolvedPath, `index${extension}`)));
}

function getFilename(context) {
  return context.filename || context.getFilename?.();
}

function toExplicitIndexSpecifier(specifier) {
  if (specifier === '.') {
    return './index';
  }

  if (specifier === '..') {
    return '../index';
  }

  return specifier.endsWith('/') ? `${specifier}index` : `${specifier}/index`;
}

function shouldReport(context, specifier) {
  if (!isRelativeSpecifier(specifier) || hasExplicitIndex(specifier) || hasExplicitExtension(specifier)) {
    return false;
  }

  const filename = getFilename(context);
  if (!filename || filename === '<input>') {
    return false;
  }

  const resolvedPath = path.resolve(path.dirname(filename), specifier);
  return !hasMatchingFile(resolvedPath) && hasDirectoryIndex(resolvedPath);
}

function reportSpecifier(context, node, specifier) {
  if (!shouldReport(context, specifier)) {
    return;
  }

  context.report({
    node,
    messageId: 'noRelativeDirectoryIndexImports',
    data: {
      specifier,
      indexSpecifier: toExplicitIndexSpecifier(specifier)
    },
    fix(fixer) {
      if (!node.range || typeof node.value !== 'string') {
        return null;
      }

      const sourceCode = context.sourceCode || context.getSourceCode();
      const raw = sourceCode.getText(node);
      const quote = raw[0] === '"' ? '"' : "'";
      return fixer.replaceText(node, `${quote}${toExplicitIndexSpecifier(specifier)}${quote}`);
    }
  });
}

function checkLiteralSource(context, sourceNode) {
  if (sourceNode && sourceNode.type === 'Literal' && typeof sourceNode.value === 'string') {
    reportSpecifier(context, sourceNode, sourceNode.value);
  }
}

function checkCallExpression(context, node) {
  if (
    node.arguments.length !== 1 ||
    !node.arguments[0] ||
    node.arguments[0].type !== 'Literal' ||
    typeof node.arguments[0].value !== 'string'
  ) {
    return;
  }

  const isRequireCall = node.callee.type === 'Identifier' && node.callee.name === 'require';
  const isLegacyDynamicImport = node.callee.type === 'Import';
  if (!isRequireCall && !isLegacyDynamicImport) {
    return;
  }

  reportSpecifier(context, node.arguments[0], node.arguments[0].value);
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止依赖相对目录的 index 文件兜底解析，避免微信小程序 npm 构建后的运行时解析失败'
    },
    fixable: 'code',
    schema: [],
    messages: {
      noRelativeDirectoryIndexImports: '微信小程序 npm 构建后不保证把目录路径 "{{specifier}}" 解析到 "{{indexSpecifier}}"，请显式引入 "{{indexSpecifier}}"。'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        checkLiteralSource(context, node.source);
      },
      ExportAllDeclaration(node) {
        checkLiteralSource(context, node.source);
      },
      ExportNamedDeclaration(node) {
        checkLiteralSource(context, node.source);
      },
      ImportExpression(node) {
        checkLiteralSource(context, node.source);
      },
      CallExpression(node) {
        checkCallExpression(context, node);
      }
    };
  }
};
