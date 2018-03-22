import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { execute } from './helpers/shell.helpers';
import { bail } from './helpers/utility.helpers';

const serverFilePath = './dist/server/server.js';

(async () => {
  clean();

  const ngServe = execute('ng serve --proxy-config proxy.conf.json');
  const buildServer = execute('webpack --config ./build/webpack/webpack.server.ts --progress --watch');
  const runServer = waitForServerJsToExist().then(() => execute(`nodemon ${serverFilePath}`));

  await Promise.all([ngServe, buildServer, runServer]);
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

function waitForServerJsToExist() {
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      const fileExists = fs.existsSync(serverFilePath);

      if (fileExists) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}
