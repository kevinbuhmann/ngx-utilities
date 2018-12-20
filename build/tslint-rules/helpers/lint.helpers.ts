import { getDecoratorName } from 'codelyzer/util/utils';
import * as ts from 'typescript';

export function getInheritedMethods(
  node: ts.ClassDeclaration | ts.ClassExpression | ts.InterfaceDeclaration,
  typeChecker: ts.TypeChecker,
  includeInterfaces: boolean
) {
  const inheritedMethods: (ts.MethodDeclaration | ts.MethodSignature)[] = [];

  const baseDeclarations = getBaseDeclarations(node, typeChecker, includeInterfaces);

  if (baseDeclarations) {
    for (const baseDeclaration of baseDeclarations) {
      const currentInheritedMethods = Array.from(baseDeclaration.members as ts.NodeArray<ts.Node>).filter(
        member => ts.isMethodDeclaration(member) || ts.isMethodSignature(member)
      ) as (ts.MethodDeclaration | ts.MethodSignature)[];

      inheritedMethods.push(...currentInheritedMethods, ...getInheritedMethods(baseDeclaration, typeChecker, includeInterfaces));
    }
  }

  return inheritedMethods;
}

export function getBaseDeclarations(
  node: ts.ClassDeclaration | ts.ClassExpression | ts.InterfaceDeclaration,
  typeChecker: ts.TypeChecker,
  includeInterfaces: boolean
) {
  let baseDeclarations: (ts.ClassDeclaration | ts.ClassExpression | ts.InterfaceDeclaration)[];

  const extendsClause = node.heritageClauses
    ? node.heritageClauses.filter(clause => clause.token === ts.SyntaxKind.ExtendsKeyword)[0]
    : undefined;
  const implementsClause =
    includeInterfaces && node.heritageClauses
      ? node.heritageClauses.filter(clause => clause.token === ts.SyntaxKind.ImplementsKeyword)[0]
      : undefined;

  if (extendsClause || implementsClause) {
    const typeNodes = [...(extendsClause ? extendsClause.types : []), ...(implementsClause ? implementsClause.types : [])];

    baseDeclarations = typeNodes
      .map(typeNode => (includeInterfaces && typeNode.getText().includes('Partial') ? typeNode.typeArguments[0] : typeNode))
      .map(typeNode => typeChecker.getTypeFromTypeNode(typeNode))
      .map(type => type.symbol.declarations[0])
      .map(declaration => (declaration && isBaseDeclaration(declaration) ? declaration : undefined))
      .filter(baseDeclaration => baseDeclaration !== undefined && (includeInterfaces || !ts.isInterfaceDeclaration(baseDeclaration)));
  }

  return baseDeclarations;
}

export function isBaseDeclaration(node: ts.Node): node is ts.ClassDeclaration | ts.ClassExpression | ts.InterfaceDeclaration {
  return ts.isClassDeclaration(node) || ts.isClassExpression(node) || ts.isInterfaceDeclaration(node);
}

export function isComponentClass(node: ts.ClassDeclaration | ts.ClassExpression) {
  return node.decorators && node.decorators.some(decorator => getDecoratorName(decorator) === 'Component');
}

export function usesDependencyInjection(node: ts.ClassDeclaration | ts.ClassExpression) {
  return (
    node.decorators &&
    node.decorators.some(decorator => ['Component', 'Directive', 'Pipe', 'Injectable'].includes(getDecoratorName(decorator)))
  );
}
