import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { readDirectory } from './helpers/fs.helpers';
import { execute } from './helpers/shell.helpers';
import { bail, parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  clean: true
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  if (options.clean) {
    clean();
  }

  for (const lib of readDirectory('./src/lib')) {
    await execute(`ng-packagr -p ./src/lib/${lib}/ng-package.json`);
  }
})();

function clean() {
  console.log(`\n${chalk.gray('cleaning...')}`);

  try {
    rimraf.sync('./dist/lib');
    fs.mkdirSync('./dist/lib');
  } catch (e) {
    bail(`Failed to clean the './dist/lib' folder. ${e.message}`);
  }
}
