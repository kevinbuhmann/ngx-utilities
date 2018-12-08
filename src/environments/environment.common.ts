const node = typeof window === 'undefined';

export const commonEnvironment = {
  node,
  browser: node === false,
  production: false
};
