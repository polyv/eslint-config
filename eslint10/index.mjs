import common from './configs/common/index.mjs';
import importx from './configs/importx/index.mjs';
import js from './configs/js/index.mjs';
import miniprogram from './configs/miniprogram/index.mjs';
import prettier from './configs/prettier/index.mjs';
import sonarjs from './configs/sonarjs/index.mjs';
import ts from './configs/ts/index.mjs';
import vue2 from './configs/vue2/index.mjs';
import plugin, { rules } from './plugin.mjs';

const configs = {
  common,
  importx,
  js,
  miniprogram,
  prettier,
  sonarjs,
  ts,
  vue2
};

export { configs, plugin };
export { rules };

export default {
  configs,
  plugin,
  rules
};
