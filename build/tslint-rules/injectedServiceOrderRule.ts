import { getDecoratorName } from 'codelyzer/util/utils';
import * as Lint from 'tslint';
import { findImports, isParameterProperty, ImportKind } from 'tsutils';
import * as ts from 'typescript';

import { usesDependencyInjection } from './helpers/lint.helpers';

export class Rule extends Lint.Rules.AbstractRule {
  static FAILURE_STRING = 'The injected parameters should be listed in the same order as the imports.';
  static FAILURE_STRING_WITH_NON_PROPERTIES =
    'The injected parameters should be listed in the same order as the imports with non-properties listed first.';

  apply(sourceFile: ts.SourceFile) {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(context: Lint.WalkContext<void>) {
  const namedImports = findImports(context.sourceFile, ImportKind.ImportDeclaration)
    .map(importSource => importSource.parent as ts.ImportDeclaration)
    .filter(importDeclaration => !!importDeclaration.importClause && importDeclaration.importClause.namedBindings)
    .filter(importDeclaration => ts.isNamedImports(importDeclaration.importClause.namedBindings))
    .map(importDeclaration => importDeclaration.importClause.namedBindings as ts.NamedImports);

  ts.forEachChild(context.sourceFile, function visit(node) {
    if (ts.isConstructorDeclaration(node) && usesDependencyInjection(node.parent) && node.parameters.length > 1) {
      const orderedParameters = Array.from(node.parameters).sort((parameterA, parameterB) =>
        compareParameters(parameterA, parameterB, namedImports)
      );

      if (!node.parameters.every((parameter, i) => parameter === orderedParameters[i])) {
        const failureStart = node.parameters[0].getStart();
        const failureWidth = node.parameters[node.parameters.length - 1].getEnd() - failureStart;
        const failureString = node.parameters.every(parameter => isParameterProperty(parameter))
          ? Rule.FAILURE_STRING
          : Rule.FAILURE_STRING_WITH_NON_PROPERTIES;

        const fix = new Lint.Replacement(failureStart, failureWidth, getReplacementText(orderedParameters));
        context.addFailureAt(failureStart, failureWidth, failureString, fix);
      }
    }

    ts.forEachChild(node, visit);
  });
}

function compareParameters(parameterA: ts.ParameterDeclaration, parameterB: ts.ParameterDeclaration, namedImports: ts.NamedImports[]) {
  let sortRank: number;

  const isPropertyA = isParameterProperty(parameterA);
  const isPropertyB = isParameterProperty(parameterB);

  if (isPropertyA === isPropertyB) {
    const importNameA = getImportName(parameterA);
    const importIndexA = namedImports.findIndex(namedBindings =>
      namedBindings.elements.some(element => element.name.getText() === importNameA)
    );
    const importIndexAOrInfinity = importIndexA > -1 ? importIndexA : Infinity;

    const importNameB = getImportName(parameterB);
    const importIndexB = namedImports.findIndex(namedBindings =>
      namedBindings.elements.some(element => element.name.getText() === importNameB)
    );
    const importIndexBOrInfinity = importIndexB > -1 ? importIndexB : Infinity;

    sortRank = importIndexA === importIndexB ? importNameA.localeCompare(importNameB) : importIndexAOrInfinity - importIndexBOrInfinity;
  } else {
    sortRank = isPropertyA ? 1 : -1;
  }

  return sortRank;
}

function getImportName(parameter: ts.ParameterDeclaration) {
  const injectDecorator = parameter.decorators && parameter.decorators.find(decorator => getDecoratorName(decorator) === 'Inject');

  return injectDecorator && ts.isCallExpression(injectDecorator.expression)
    ? injectDecorator.expression.arguments[0].getText()
    : parameter.type
        .getText()
        .match(/^[^<]+/)
        .toString();
}

function getReplacementText(orderedParameters: ts.ParameterDeclaration[]) {
  const addComma = (parameter: ts.ParameterDeclaration) =>
    parameter
      .getFullText()
      .replace(
        /^(\s*)(.+?)(\s*)$/,
        (_, leadingWhitespace, code, trailingWhitespace) => `${leadingWhitespace}${code}, ${trailingWhitespace}`
      );

  return orderedParameters
    .map((parameter, i) => (i === orderedParameters.length - 1 ? parameter.getFullText() : addComma(parameter)))
    .join('')
    .split('\r\n')
    .map(line => line.replace(/\s+$/, ''))
    .join('\r\n')
    .replace(/^\s+/, '');
}
