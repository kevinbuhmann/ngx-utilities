// tslint:disable-next-line:import-blacklist (cannot use 'lodash-es/*' in ts-node)
import { flatten, groupBy, orderBy } from 'lodash';
import { EOL } from 'os';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.TypedRule {
  static FAILURE_STRING = 'Import statements should be grouped properly.';
  static FAILURE_STRING_STATEMENT_WITHIN_IMPORTS = 'The imports should not contain any other statements.';

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program) {
    return this.applyWithFunction(sourceFile, walk, undefined, program);
  }
}

enum ImportType {
  SideEffect,
  ExternalPackage,
  PathAlias,
  LocalPath
}

function walk(context: Lint.WalkContext<void>, program: ts.Program) {
  const sourceFile = context.sourceFile;

  const pathAliasPatterns = Object.keys(program.getCompilerOptions().paths || {}).map(
    pathAlias => new RegExp(`^${pathAlias.replace(/\*/g, '.*')}`)
  );

  const statementsWithinImports = checkForStatementsWithinImports(context);
  const importGroups = getImportGroups(sourceFile);

  const imports = flatten(importGroups);

  if (imports.length > 0) {
    const importsStart = imports[0].getFullStart();
    const importsEnd = imports[imports.length - 1].getEnd();
    const importsLength = importsEnd - importsStart;

    const actualImportsSourceText = sourceFile.getFullText().substr(importsStart, importsLength);

    const groupedImports = groupBy(imports, importDeclaration => getImportType(importDeclaration, pathAliasPatterns));
    const desiredImportsSourceText = Object.values(ImportType)
      .filter(importType => groupedImports[importType] !== undefined)
      .map(importType =>
        orderImports(groupedImports[importType], pathAliasPatterns)
          .map(importDeclaration => importDeclaration.getFullText().trim())
          .join(`${EOL}`)
      )
      .join(`${EOL}${EOL}`);

    if (actualImportsSourceText !== desiredImportsSourceText) {
      const fix = statementsWithinImports ? undefined : new Lint.Replacement(importsStart, importsLength, desiredImportsSourceText);
      context.addFailureAt(importsStart, importsLength, Rule.FAILURE_STRING, fix);
    }
  }
}

function checkForStatementsWithinImports(context: Lint.WalkContext<void>) {
  let statementsWithinImports = false;

  const sourceFile = context.sourceFile;

  let firstImportDeclaration: ts.ImportDeclaration;
  let lastImportDeclaration: ts.ImportDeclaration;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      if (firstImportDeclaration === undefined) {
        firstImportDeclaration = statement;
      }

      lastImportDeclaration = statement;
    }
  }

  if (firstImportDeclaration && lastImportDeclaration) {
    const importsStart = firstImportDeclaration.getStart();
    const importsEnd = lastImportDeclaration.getEnd();

    for (const statement of sourceFile.statements) {
      const statementStart = statement.getStart();

      if (!ts.isImportDeclaration(statement) && statementStart > importsStart && statementStart < importsEnd) {
        statementsWithinImports = true;
        context.addFailureAtNode(statement, Rule.FAILURE_STRING_STATEMENT_WITHIN_IMPORTS);
      }
    }
  }

  return statementsWithinImports;
}

function orderImports(importDeclarations: ts.ImportDeclaration[], pathAliasPatterns: RegExp[]) {
  const shouldOrder = importDeclarations.every(
    importDeclaration => getImportType(importDeclaration, pathAliasPatterns) !== ImportType.SideEffect
  );

  return shouldOrder
    ? orderBy(importDeclarations, importDeclaration => getImportSource(importDeclaration).toLowerCase())
    : importDeclarations;
}

function getImportGroups(sourceFile: ts.SourceFile) {
  const importGroups: ts.ImportDeclaration[][] = [[]];

  for (const statement of sourceFile.statements) {
    const hasLeadingBlankLine = /\r?\n\r?\n/.test(sourceFile.text.slice(statement.getFullStart(), statement.getStart(sourceFile)));

    if (hasLeadingBlankLine || !ts.isImportDeclaration(statement)) {
      endImportGroup();
    }

    if (ts.isImportDeclaration(statement)) {
      getCurrentImportGroup().push(statement);
    }
  }

  return importGroups.filter(importGroup => importGroup.length > 0);

  function endImportGroup() {
    importGroups.push([]);
  }

  function getCurrentImportGroup() {
    return importGroups[importGroups.length - 1];
  }
}

function getImportType(importDeclaration: ts.ImportDeclaration, pathAliasPatterns: RegExp[]) {
  const source = getImportSource(importDeclaration);

  if (importDeclaration.importClause === undefined) {
    return ImportType.SideEffect;
  } else if (ts.isExternalModuleNameRelative(source)) {
    return ImportType.LocalPath;
  } else if (pathAliasPatterns.some(pathAliasPattern => pathAliasPattern.test(source))) {
    return ImportType.PathAlias;
  } else {
    return ImportType.ExternalPackage;
  }
}

function getImportSource(importDeclaration: ts.ImportDeclaration) {
  return ts.isStringLiteral(importDeclaration.moduleSpecifier) ? importDeclaration.moduleSpecifier.text : '';
}
