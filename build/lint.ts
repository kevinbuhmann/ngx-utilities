import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  prelint: true,
  prettier: true,
  sasslint: true,
  tslint: true,
  fix: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  if (options.prelint) {
    await execute('ts-node ./build/prelint.ts');
  }

  if (options.prettier) {
    await runFormatter('prettier --config ./prettier.json "./**/*.ts"', '--write', '--list-different', options.fix);
    await runFormatter('prettier --config ./prettier.json "./**/*.scss"', '--write', '--list-different', options.fix);
    await runFormatter('prettier --config ./prettier.json "./**/*.json"', '--write', '--list-different', options.fix);
    await runFormatter('prettier --config ./prettier.json "./**/*.yml"', '--write', '--list-different', options.fix);
  }

  if (options.sasslint) {
    await execute('sass-lint -v -q --max-warnings 0');
  }

  if (options.tslint) {
    await execute('tsc -p build/tslint-rules/tsconfig.json');
    await execute(`tslint --project ./tsconfig.json ${options.fix ? '--fix' : ''}`);
  }
})();

async function runFormatter(command: string, writeArg: string, listDifferentArg: string, fix: boolean) {
  if (fix) {
    do {
      await execute(`${command} ${writeArg}`);
    } while ((await execute(`${command} ${listDifferentArg}`, {}, false)).code !== 0);
  } else {
    await execute(`${command} ${listDifferentArg}`);
  }
}
