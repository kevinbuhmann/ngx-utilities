import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { isDirectory, readDirectory } from './helpers/fs.helpers';
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

  for (const project of readDirectory('./projects')) {
    if (isDirectory(`./projects/${project}`)) {
      await execute(`ng build @ngx-utilities/${project}`);
    }
  }
})();

function clean() {
  console.log(`\n${chalk.gray('cleaning...')}`);

  try {
    rimraf.sync('./dist/projects');
    fs.mkdirSync('./dist/projects');
  } catch (e) {
    bail(`Failed to clean the './dist/projects' folder. ${e.message}`);
  }
}
