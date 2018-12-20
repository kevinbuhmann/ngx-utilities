import * as Lint from 'tslint';
import * as ts from 'typescript';

import { SingleSourceFileLanguageServiceHost } from './single-file-language-service-host';

export function getRenameReplacementsInSingleFile(
  program: ts.Program,
  sourceFile: ts.SourceFile,
  node: ts.NamedDeclaration,
  expectedName: string
) {
  const languageService = getSingleSourceFileLanguageService(program, sourceFile);

  const replacements: Lint.Replacement[] = [];

  const renameInfo = languageService.getRenameInfo(sourceFile.fileName, node.name.getStart());

  if (renameInfo.canRename) {
    const renameLocations = languageService.findRenameLocations(sourceFile.fileName, node.name.getStart(), false, false);

    const uniqueFileNames = renameLocations
      .map(renameLocation => renameLocation.fileName)
      .filter((fileName, index, self) => self.indexOf(fileName) === index);

    if (uniqueFileNames.length === 1) {
      for (const renameLocation of renameLocations) {
        replacements.push(new Lint.Replacement(renameLocation.textSpan.start, renameLocation.textSpan.length, expectedName));
      }
    }
  }

  return replacements;
}

function getSingleSourceFileLanguageService(program: ts.Program, sourceFile: ts.SourceFile) {
  const languageServiceHost = new SingleSourceFileLanguageServiceHost(program, sourceFile);
  return ts.createLanguageService(languageServiceHost, ts.createDocumentRegistry());
}
