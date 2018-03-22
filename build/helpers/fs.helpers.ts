import * as fs from 'fs';
import * as path from 'path';

export function walkDirectory(directoryPath: string, visitFile: (filePath: string) => void) {
  const filePaths = fs
    .readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('node_modules') === false);

  for (const filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      walkDirectory(filePath, visitFile);
    } else {
      visitFile(filePath);
    }
  }
}

export function readFile(filePath: string) {
  return fs.readFileSync(filePath).toString();
}

export function readDirectory(directoryPath: string) {
  return fs.readdirSync(directoryPath);
}
