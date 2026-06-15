/** @type {import('prettier').Config} */
const prettierConfig = {
  useTabs: false,
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSameLine: false,
  arrowParens: 'avoid',
  quoteProps: 'as-needed',
  singleAttributePerLine: true
};

export default prettierConfig;
