import fs from 'node:fs';
import path from 'node:path';

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const indexExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const settingsKey = 'polyv/no-relative-directory-index-imports';

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

function getCwd(context) {
  return context.cwd || process.cwd();
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function normalizeGlobPattern(pattern) {
  const normalizedPattern = normalizePath(pattern);
  return normalizedPattern.startsWith('./') ? normalizedPattern.slice(2) : normalizedPattern;
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function findClosingBrace(pattern, start) {
  for (let index = start + 1; index < pattern.length; index += 1) {
    if (pattern[index] === '}') {
      return index;
    }
  }

  return -1;
}

function globToRegExp(pattern) {
  const normalizedPattern = normalizeGlobPattern(pattern);
  let source = '^';
  let index = 0;

  while (index < normalizedPattern.length) {
    const char = normalizedPattern[index];

    if (char === '*') {
      if (normalizedPattern[index + 1] === '*') {
        if (normalizedPattern[index + 2] === '/') {
          source += '(?:.*\\/)?';
          index += 3;
        } else {
          source += '.*';
          index += 2;
        }
      } else {
        source += '[^/]*';
        index += 1;
      }
      continue;
    }

    if (char === '?') {
      source += '[^/]';
      index += 1;
      continue;
    }

    if (char === '{') {
      const closingBraceIndex = findClosingBrace(normalizedPattern, index);
      if (closingBraceIndex !== -1) {
        const choices = normalizedPattern
          .slice(index + 1, closingBraceIndex)
          .split(',')
          .map((choice) => escapeRegExp(choice));
        source += `(?:${choices.join('|')})`;
        index = closingBraceIndex + 1;
        continue;
      }
    }

    source += escapeRegExp(char);
    index += 1;
  }

  return new RegExp(`${source}$`);
}

function isRegExp(value) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !isRegExp(value);
}

function toArray(value) {
  if (typeof value === 'undefined') {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getRuleSettings(context) {
  const settings = context.settings?.[settingsKey];
  if (!isPlainObject(settings)) {
    return {};
  }

  return settings;
}

function createIgnoreMatcher(pattern) {
  if (typeof pattern === 'string') {
    const matcher = globToRegExp(pattern);
    return (candidatePaths) => candidatePaths.some((candidatePath) => matcher.test(candidatePath));
  }

  if (isRegExp(pattern)) {
    const matcher = new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, ''));
    return (candidatePaths) => candidatePaths.some((candidatePath) => matcher.test(candidatePath));
  }

  return null;
}

function getIgnoreMatchers(context) {
  const settings = getRuleSettings(context);
  const ruleOptions = context.options[0] ?? {};
  return [
    ...toArray(settings.ignore),
    ...toArray(ruleOptions.ignore)
  ]
    .map(createIgnoreMatcher)
    .filter(Boolean);
}

function getCandidatePaths(context) {
  const filename = getFilename(context);
  if (!filename || filename === '<input>') {
    return [];
  }

  const cwd = getCwd(context);
  const absolutePath = path.isAbsolute(filename) ? filename : path.resolve(cwd, filename);
  const normalizedFilename = normalizePath(filename);
  const normalizedAbsolutePath = normalizePath(absolutePath);
  const normalizedRelativePath = normalizePath(path.relative(cwd, absolutePath));
  const basename = path.posix.basename(normalizedAbsolutePath);

  return Array.from(new Set([
    normalizedFilename,
    normalizedAbsolutePath,
    normalizedRelativePath,
    basename
  ]));
}

function shouldIgnoreFile(context, ignoreMatchers) {
  if (ignoreMatchers.length === 0) {
    return false;
  }

  const candidatePaths = getCandidatePaths(context);
  return candidatePaths.length > 0 && ignoreMatchers.some((matcher) => matcher(candidatePaths));
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
    schema: [{
      type: 'object',
      additionalProperties: false,
      properties: {
        ignore: {}
      }
    }],
    messages: {
      noRelativeDirectoryIndexImports: '微信小程序 npm 构建后不保证把目录路径 "{{specifier}}" 解析到 "{{indexSpecifier}}"，请显式引入 "{{indexSpecifier}}"。'
    }
  },
  create(context) {
    if (shouldIgnoreFile(context, getIgnoreMatchers(context))) {
      return {};
    }

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
