import { flatten } from 'lodash';
import * as path from 'path';
import * as Lint from 'tslint';
import { findImports, ImportKind } from 'tsutils';
import * as ts from 'typescript';

interface PathAliasMap {
  [absolutePath: string]: string;
}

export class Rule extends Lint.Rules.TypedRule {
  static FAILURE_STRING_FACTORY(expectedSourcePath: string) {
    return `Local import path should be changed to '${expectedSourcePath}'.`;
  }

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program) {
    return this.applyWithFunction(sourceFile, walk, undefined, program);
  }
}

function walk(context: Lint.WalkContext<void>, program: ts.Program) {
  const sourceFile = context.sourceFile;

  const basePath = path.resolve(program.getCurrentDirectory(), program.getCompilerOptions().baseUrl);
  const pathAliasMap = getPathAliasMap(program, basePath);

  for (const importSource of findImports(sourceFile, ImportKind.All)) {
    const isLocalFilePath = ts.isExternalModuleNameRelative(importSource.text);
    const aliasedPath = Object.keys(pathAliasMap).find(aliasPath => importSource.text.startsWith(pathAliasMap[aliasPath]));

    if (isLocalFilePath || aliasedPath) {
      const fileDirectory = path.normalize(path.dirname(sourceFile.fileName));
      const absoluteImportPath = aliasedPath
        ? path.resolve(basePath, importSource.text.replace(pathAliasMap[aliasedPath], aliasedPath))
        : path.resolve(fileDirectory, importSource.text);

      const expectedImportPath = getExpectedImportPath(pathAliasMap, fileDirectory, absoluteImportPath);

      if (importSource.text !== expectedImportPath) {
        const fix = new Lint.Replacement(importSource.getStart(), importSource.getWidth(), `'${expectedImportPath}'`);
        context.addFailureAtNode(importSource, Rule.FAILURE_STRING_FACTORY(expectedImportPath), fix);
      }
    }
  }
}

function getExpectedImportPath(pathAliasMap: PathAliasMap, fileDirectory: string, absoluteImportPath: string) {
  const aliasedPath = Object.keys(pathAliasMap).find(aliasPath => absoluteImportPath.startsWith(aliasPath));
  const aliasedPathIsOutsideFileDirectory = aliasedPath ? !fileDirectory.startsWith(aliasedPath) : undefined;
  const pathAlias = aliasedPath && aliasedPathIsOutsideFileDirectory ? pathAliasMap[aliasedPath] : undefined;

  const expectedImportPathNotNormalized = pathAlias
    ? absoluteImportPath.replace(aliasedPath, pathAlias)
    : `./${path.relative(fileDirectory, absoluteImportPath)}`;

  return expectedImportPathNotNormalized.replace(/\\/g, '/');
}

function getPathAliasMap(program: ts.Program, basePath: string) {
  const paths: { [key: string]: string[] } = program.getCompilerOptions().paths || {};

  const pathAliases = flatten(
    Object.keys(paths)
      .map(pathAlias => ({
        pathAlias: removeTrailingWildCardPath(pathAlias),
        absolutePaths: paths[pathAlias].map(relativePath => path.resolve(basePath, removeTrailingWildCardPath(relativePath)))
      }))
      .map(({ pathAlias, absolutePaths }) => absolutePaths.map(absolutePath => ({ pathAlias, absolutePath })))
  );

  return pathAliases.reduce<PathAliasMap>((pathAliasMap, pathAlias) => {
    pathAliasMap[pathAlias.absolutePath] = pathAlias.pathAlias;
    return pathAliasMap;
  }, {});
}

function removeTrailingWildCardPath(value: string) {
  return value.replace(/\/\*$/, '');
}
