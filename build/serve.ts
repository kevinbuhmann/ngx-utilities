import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { execute } from './helpers/shell.helpers';
import { bail } from './helpers/utility.helpers';

const indexFilePath = './dist/app/index.html';
const serverBundleFilePath = './dist/server/main.js';
const serverEntryFilePath = './dist/server/server.js';

(async () => {
  clean();

  const ngBuildFn = () => execute('ng build --project ngx-utilities-app-client --watch');
  const ngServerBuildFn = () => execute('ng build --project ngx-utilities-app-server --watch');

  const buildServerFn = async () => {
    await waitForFiles([serverBundleFilePath]);
    return execute('webpack --config ./build/webpack/webpack.server.ts --progress --watch');
  };

  const runServerFn = async () => {
    await waitForFiles([indexFilePath, serverBundleFilePath, serverEntryFilePath]);
    return execute(`nodemon ${serverEntryFilePath}`);
  };

  await Promise.all([ngBuildFn(), ngServerBuildFn(), buildServerFn(), runServerFn()]);
})();

function clean() {
  console.log(`\n${chalk.gray('cleaning...')}`);

  try {
    rimraf.sync('./dist');
    fs.mkdirSync('./dist');
  } catch (e) {
    bail(`Failed to clean the './dist' folder. ${e.message}`);
  }
}

function waitForFiles(filePaths: string[]) {
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      const filesExist = filePaths.every(filePath => fs.existsSync(filePath));

      if (filesExist) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}
