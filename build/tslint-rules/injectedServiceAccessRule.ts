import * as Lint from 'tslint';
import { hasModifier, isParameterProperty } from 'tsutils';
import * as ts from 'typescript';

import { usesDependencyInjection } from './helpers/lint.helpers';

export class Rule extends Lint.Rules.AbstractRule {
  static FAILURE_STRING = 'Injected parameters should be marked private.';

  apply(sourceFile: ts.SourceFile) {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(context: Lint.WalkContext<void>) {
  ts.forEachChild(context.sourceFile, function visit(node) {
    if (ts.isConstructorDeclaration(node) && usesDependencyInjection(node.parent) && node.parameters.length > 1) {
      for (const parameter of node.parameters) {
        if (isParameterProperty(parameter) && !hasModifier(parameter.modifiers, ts.SyntaxKind.PrivateKeyword)) {
          const fix = new Lint.Replacement(parameter.getStart(), 0, 'private ');
          context.addFailureAtNode(parameter, Rule.FAILURE_STRING, fix);
        }
      }
    }

    ts.forEachChild(node, visit);
  });
}
