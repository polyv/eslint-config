import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RuleTester } from 'eslint';
import rule from '../index.mjs';

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'polyv-eslint-rule-'));
  const src = path.join(root, 'src');
  const nested = path.join(src, 'nested');
  fs.mkdirSync(path.join(src, 'interface'), { recursive: true });
  fs.mkdirSync(nested, { recursive: true });
  fs.mkdirSync(path.join(src, 'utils'), { recursive: true });
  fs.writeFileSync(path.join(src, 'index.ts'), 'export const value = 1;\n');
  fs.writeFileSync(path.join(src, 'interface', 'index.ts'), 'export const value = 1;\n');
  fs.writeFileSync(path.join(src, 'utils', 'index.js'), 'module.exports = {};\n');
  fs.writeFileSync(path.join(src, 'plain.ts'), 'export const value = 1;\n');
  return {
    root,
    filename: path.join(src, 'main.ts'),
    nestedFilename: path.join(nested, 'main.ts'),
    commonjsFilename: path.join(src, 'main.cjs')
  };
}

test('no-relative-directory-index-imports', () => {
  const fixture = createFixture();
  const tester = new RuleTester({
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  });

  tester.run('no-relative-directory-index-imports', rule, {
    valid: [
      {
        code: "import value from './interface/index';",
        filename: fixture.filename
      },
      {
        code: "import value from './plain';",
        filename: fixture.filename
      },
      {
        code: "import value from 'external-package';",
        filename: fixture.filename
      },
      {
        code: "const utils = require('./utils/index');",
        filename: fixture.commonjsFilename,
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'commonjs'
        }
      }
    ],
    invalid: [
      {
        code: "import value from './interface';",
        output: "import value from './interface/index';",
        filename: fixture.filename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "import value from '.';",
        output: "import value from './index';",
        filename: fixture.filename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "import value from './';",
        output: "import value from './index';",
        filename: fixture.filename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "import value from '..';",
        output: "import value from '../index';",
        filename: fixture.nestedFilename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "export * from './interface';",
        output: "export * from './interface/index';",
        filename: fixture.filename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "const value = await import('./interface');",
        output: "const value = await import('./interface/index');",
        filename: fixture.filename,
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      },
      {
        code: "const utils = require('./utils');",
        output: "const utils = require('./utils/index');",
        filename: fixture.commonjsFilename,
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'commonjs'
        },
        errors: [{ messageId: 'noRelativeDirectoryIndexImports' }]
      }
    ]
  });

  fs.rmSync(fixture.root, { recursive: true, force: true });
});
