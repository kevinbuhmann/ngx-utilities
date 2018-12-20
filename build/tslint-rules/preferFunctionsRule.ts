import * as ngc from '@angular/compiler';
import { NgWalker } from 'codelyzer/angular/ngWalker';
import { RecursiveAngularExpressionVisitor } from 'codelyzer/angular/templates/recursiveAngularExpressionVisitor';
import * as Lint from 'tslint';
import { hasModifier } from 'tsutils';
import * as ts from 'typescript';

import { getInheritedMethods, isComponentClass } from './helpers/lint.helpers';

export class Rule extends Lint.Rules.TypedRule {
  static FAILURE_STRING = "This method does not reference 'this'. Use a function instead.";

  static options: Lint.IOptions;

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program) {
    Rule.options = this.getOptions();

    return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
  }
}

function walk(context: Lint.WalkContext<void>, typeChecker: ts.TypeChecker) {
  ts.forEachChild(context.sourceFile, function visit(node) {
    if (ts.isClassDeclaration(node) && !hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
      const inheritedMethods = getInheritedMethods(node, typeChecker, true).map(method => method.name.getText());
      const methodsUsedInTemplate = isComponentClass(node) ? getEventHandlersFromTemplate(node) : undefined;
      const excludedMethods = [...inheritedMethods, ...methodsUsedInTemplate];

      const concreteInstanceMethods = node.members.filter(member => isConcreteInstanceMethod(member)) as ts.MethodDeclaration[];

      for (const method of concreteInstanceMethods) {
        if (!excludedMethods.includes(method.name.getText()) && !method.decorators && !methodReferencesThis(method)) {
          context.addFailureAtNode(method.name, Rule.FAILURE_STRING);
        }
      }
    }

    ts.forEachChild(node, visit);
  });
}

function isConcreteInstanceMethod(member: ts.ClassElement) {
  return (
    ts.isMethodDeclaration(member) &&
    !hasModifier(member.modifiers, ts.SyntaxKind.ProtectedKeyword) &&
    !hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword) &&
    !hasModifier(member.modifiers, ts.SyntaxKind.AbstractKeyword) &&
    member.body !== undefined
  );
}

function getEventHandlersFromTemplate(node: ts.ClassDeclaration) {
  const result: string[] = [];

  const eventHandlerCollector = class extends RecursiveAngularExpressionVisitor {
    visitMethodCall(expressionNode: ngc.MethodCall, context: any) {
      if (expressionNode.receiver instanceof ngc.ImplicitReceiver) {
        result.push(expressionNode.name);
      }

      super.visitMethodCall(expressionNode, context);
    }
  };

  const ngWalker = new NgWalker(node.getSourceFile(), Rule.options, { expressionVisitorCtrl: eventHandlerCollector });

  ngWalker.visitClassDeclaration(node);

  return result;
}

function methodReferencesThis(method: ts.MethodDeclaration) {
  let result = false;

  ts.forEachChild(method, function visit(node) {
    if (node.kind === ts.SyntaxKind.ThisKeyword) {
      result = true;
    }

    ts.forEachChild(node, visit);
  });

  return result;
}
