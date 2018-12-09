import { runServer } from './helpers/server.helpers';
import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  travis: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

const travisKarmaArgs = options.travis ? '--no-progress --browsers=ChromeNoSandbox' : '';
const travisProtractorArgs = options.travis ? '--protractor-config=e2e/protractor-ci.conf.js' : '';

(async () => {
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);

  await execute(`ng test --no-watch --code-coverage --source-map ${travisKarmaArgs}`);

  const serverProcess = runServer(async () => {
    await execute(`ng e2e ${travisProtractorArgs}`);

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
