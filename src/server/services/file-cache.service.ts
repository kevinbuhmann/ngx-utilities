import * as fs from 'fs';
import * as path from 'path';

export class FileCacheService {
  readonly cache: { [filePath: string]: string } = {};

  getFile(filePath: string, throwIfMissing = true) {
    filePath = path.resolve(filePath);

    let contents: string;

    if (this.cache[filePath]) {
      contents = this.cache[filePath];
    } else if (fs.existsSync(filePath)) {
      contents = fs.readFileSync(filePath).toString();
      this.cache[filePath] = contents;
    } else if (throwIfMissing) {
      throw new Error(`${filePath} not found.`);
    }

    return contents;
  }
}
