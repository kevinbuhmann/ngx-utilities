import chalk from 'chalk';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import * as path from 'path';

import { bail } from './utility.helpers';

export interface ExecuteResult {
  command: string;
  stdout: string;
  stderr: string;
  error?: any;
  code?: number;
  signal?: string;
}

export function execute(command: string, options?: SpawnOptions, bailOnError = true) {
  const spawnOptions: SpawnOptions = {
    stdio: 'inherit',
    shell: true,
    ...options,
    env: makeChildProcessEnv(options && options.env ? options.env : {})
  };

  return promisifyProcess(command, () => spawn(command, [], spawnOptions), bailOnError);
}

function promisifyProcess(command: string, childProcessFn: () => ChildProcess, bailOnError: boolean) {
  return new Promise<ExecuteResult>(resolve => {
    console.log(`\n${chalk.gray(`> ${command}`)}`);

    const result: ExecuteResult = { command, stdout: '', stderr: '' };

    let done = false;

    const handleResult = (error: Error, code?: number, signal?: string) => {
      if (done === false) {
        result.error = error;
        result.code = code;
        result.signal = signal;

        if (bailOnError && (error || code !== 0)) {
          bail(error ? JSON.stringify(result.error) : `'${command}' exited with code ${code}.`);
        } else {
          resolve(result);
        }

        done = true;
      }
    };

    const childProcess = childProcessFn();

    if (childProcess.stdout) {
      childProcess.stdout.on('data', data => {
        result.stdout += data.toString();
      });
    }

    if (childProcess.stderr) {
      childProcess.stderr.on('data', data => {
        result.stderr += data.toString();
      });
    }

    childProcess.on('error', error => {
      handleResult(error);
    });
    childProcess.on('exit', (code, signal) => {
      handleResult(undefined, code, signal);
    });
  });
}

function makeChildProcessEnv(environment: { [key: string]: string }) {
  const env = { ...process.env, ...environment };

  const pathKey = getPathKey();
  const paths = [...process.env[pathKey].split(path.delimiter), path.resolve('./node_modules/.bin')];
  env[pathKey] = paths.join(path.delimiter);

  return env;
}

export function getPathKey() {
  let pathKey = 'PATH';

  for (const key of Object.keys(process.env)) {
    if (key.toLowerCase() === 'path') {
      pathKey = key;
    }
  }

  return pathKey;
}
