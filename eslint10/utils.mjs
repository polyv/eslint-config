export const devWarnProdError = process.env.NODE_ENV === 'production'
  ? 'error'
  : 'warn';
