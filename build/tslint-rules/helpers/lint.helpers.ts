import { getDecoratorName } from 'codelyzer/util/utils';
import * as ts from 'typescript';

export function usesDependencyInjection(node: ts.ClassDeclaration | ts.ClassExpression) {
  return (
    node.decorators &&
    node.decorators.some(decorator => ['Component', 'Directive', 'Pipe', 'Injectable'].includes(getDecoratorName(decorator)))
  );
}
