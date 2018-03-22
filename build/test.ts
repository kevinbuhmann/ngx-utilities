import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  travis: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

const travisKarmaArgs = options.travis ? '--no-progress --browser=ChromeNoSandbox' : '';
const travisProtractorArgs = options.travis ? '--no-progress --config=protractor-ci.conf.js' : '';

(async () => {
  await execute(`ng test --no-watch --code-coverage --sourcemaps ${travisKarmaArgs}`);
  await execute(`ng e2e --aot ${travisProtractorArgs}`);
})();
