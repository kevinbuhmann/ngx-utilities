import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { execute } from './helpers/shell.helpers';
import { bail } from './helpers/utility.helpers';

const indexFilePath = './dist/app/index.html';
const serverFilePath = './dist/server/server.js';

(async () => {
  clean();

  const ngBuild = execute('ng build --watch');
  const buildServer = execute('webpack --config ./build/webpack/webpack.server.ts --progress --watch');
  const runServer = waitForServerToBeReady().then(() => execute(`nodemon ${serverFilePath}`));

  await Promise.all([ngBuild, buildServer, runServer]);
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

function waitForServerToBeReady() {
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      const filesExist = [indexFilePath, serverFilePath].every(filePath => fs.existsSync(filePath));

      if (filesExist) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}
