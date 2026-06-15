import explicitModuleBoundaryTypes from './rules/explicit-module-boundary-types/index.mjs';
import noRelativeDirectoryIndexImports from './rules/no-relative-directory-index-imports/index.mjs';
import noVueComponentVariableNameConflict from './rules/no-vue-component-variable-name-conflict/index.mjs';

const plugin = {
  meta: {
    name: '@polyv/eslint-config'
  },
  rules: {
    'explicit-module-boundary-types': explicitModuleBoundaryTypes,
    'no-relative-directory-index-imports': noRelativeDirectoryIndexImports,
    'no-vue-component-variable-name-conflict': noVueComponentVariableNameConflict
  }
};

export const rules = plugin.rules;
export default plugin;
