exports.devWarnProdError = process.env.NODE_ENV === 'production'
  ? 'error'
  : 'warn';

exports.strictErrorOtherwiseWarn = process.env.STRICT_LINT !== 'false'
  ? 'error'
  : 'warn';
