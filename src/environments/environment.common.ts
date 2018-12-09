const node = typeof window === 'undefined';
const serverPort = node ? process.env.PORT || 4300 : undefined;
const appUrl = node ? process.env.APP_URL || `http://localhost:${serverPort}` : '';

export const commonEnvironment = {
  node,
  browser: node === false,
  production: false,
  serverPort,
  appUrl
};
