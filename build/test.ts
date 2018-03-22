import { runServer } from './helpers/server.helpers';
import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  travis: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

const travisKarmaArgs = options.travis ? '--no-progress --browser=ChromeNoSandbox' : '';
const travisProtractorArgs = options.travis ? '--no-progress --config=protractor-ci.conf.js' : '';

(async () => {
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);

  await execute(`ng test --no-watch --code-coverage --sourcemaps ${travisKarmaArgs}`);

  await execute('webpack --config ./build/webpack/webpack.server.ts --progress');

  const serverProcess = runServer(async () => {
    await execute(`ng e2e --aot --proxy-config proxy.conf.json ${travisProtractorArgs}`);

    exit();
  });

  function exit(code = 0) {
    serverProcess.kill();
    process.exit(code);
  }

  function handleError(error: any) {
    console.error();
    console.error(`Fatal Error: ${error.stack || error.toString()}`);

    exit(1);
  }
})();
