import chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { execute } from './helpers/shell.helpers';
import { bail, parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  clean: true,
  lint: true,
  test: true,
  package: true,
  travis: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

const travisArg = options.travis ? '--travis' : '';
const progressArg = options.travis ? '--no-progress' : '--progress';

(async () => {
  if (options.clean) {
    clean();
  }

  if (options.lint) {
    await execute('ts-node ./build/lint.ts');
  }

  await execute(`ng build --project ngx-utilities-app-client --prod ${progressArg}`);
  await execute(`ng build --project ngx-utilities-app-server --prod ${progressArg}`);
  await execute(`webpack --config ./build/webpack/webpack.server.ts ${progressArg}`);

  if (options.test) {
    await execute(`ts-node ./build/test.ts ${travisArg}`);
  }

  if (options.package) {
    await execute('ts-node ./build/package.ts');
  }
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
