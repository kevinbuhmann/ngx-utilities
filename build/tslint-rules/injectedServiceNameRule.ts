import { getDecoratorName } from 'codelyzer/util/utils';
import * as Lint from 'tslint';
import * as ts from 'typescript';

import { getRenameReplacementsInSingleFile } from './helpers/language-service.helpers';
import { usesDependencyInjection } from './helpers/lint.helpers';

export class Rule extends Lint.Rules.TypedRule {
  static FAILURE_STRING_FACTORY(parameterName: string, expectedParameterName: string) {
    return `The injected '${parameterName}' parameter should be named '${expectedParameterName}' to match the injected service.`;
  }

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program) {
    return this.applyWithFunction(sourceFile, walk, undefined, program);
  }
}

function walk(context: Lint.WalkContext<void>, program: ts.Program) {
  ts.forEachChild(context.sourceFile, function visit(node) {
    if (ts.isConstructorDeclaration(node) && usesDependencyInjection(node.parent)) {
      for (const parameter of node.parameters) {
        const parameterName = parameter.name.getText();
        const expectedParameterName = getExpectedParameterName(parameter);

        if (parameterName !== expectedParameterName) {
          const fix = getRenameReplacementsInSingleFile(program, context.sourceFile, parameter, expectedParameterName);
          context.addFailureAtNode(parameter.name, Rule.FAILURE_STRING_FACTORY(parameterName, expectedParameterName), fix);
        }
      }
    }

    ts.forEachChild(node, visit);
  });
}

function getExpectedParameterName(node: ts.ParameterDeclaration) {
  let serviceName: string;

  const injectDecorator = node.decorators && node.decorators.find(decorator => getDecoratorName(decorator) === 'Inject');

  if (injectDecorator && ts.isCallExpression(injectDecorator.expression)) {
    serviceName = injectDecorator.expression.arguments[0]
      .getText()
      .split('_')
      .map(word => `${word[0]}${word.substr(1).toLowerCase()}`)
      .join('');
  } else {
    serviceName = node.type
      .getText()
      .match(/^[^<]+/)
      .toString();
  }

  return `${serviceName[0].toLowerCase()}${serviceName.substr(1)}`;
}
