/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {Node} from '../types/ast';

import {compareStringsCapitalsLast} from './StringUtils';
import jscs from 'jscodeshift';
import oneLineObjectPattern from './oneLineObjectPattern';
import reprintComment from './reprintComment';

const {statement} = jscs.template;

/**
 * Thin wrapper to reprint requires, it's wrapped in a new function in order to
 * easily attach comments to the node.
 */
function reprintRequire(node: Node): Node {
  const comments = node.comments;
  const newNode = reprintRequireHelper(node);
  if (comments) {
    newNode.comments = comments.map(comment => reprintComment(comment));
  }
  return newNode;
}

/**
 * This takes in a require node and reprints it. This should remove whitespace
 * and allow us to have a consistent formatting of all requires.
 */
function reprintRequireHelper(node: Node): Node {
  if (jscs.ExpressionStatement.check(node)) {
    return statement`${node.expression}`;
  }

  if (jscs.VariableDeclaration.check(node)) {
    const kind = node.kind || 'const';
    const declaration = node.declarations[0];
    if (jscs.Identifier.check(declaration.id)) {
      return jscs.variableDeclaration(
        kind,
        [jscs.variableDeclarator(declaration.id, declaration.init)],
      );
    } else if (jscs.ObjectPattern.check(declaration.id)) {
      declaration.id.properties.sort((prop1, prop2) => {
        return compareStringsCapitalsLast(prop1.key.name, prop2.key.name);
      });
      return jscs.variableDeclaration(
        kind,
        [jscs.variableDeclarator(
          oneLineObjectPattern(declaration.id),
          declaration.init,
        )],
      );
    } else if (jscs.ArrayPattern.check(declaration.id)) {
      return jscs.variableDeclaration(
        kind,
        [jscs.variableDeclarator(declaration.id, declaration.init)],
      );
    }
  }

  if (jscs.ImportDeclaration.check(node) && node.importKind === 'type') {
    // Sort the specifiers.
    node.specifiers.sort((one, two) => compareStringsCapitalsLast(
      one.imported.name,
      two.imported.name,
    ));
    return node;
  }

  return node;
}

module.exports = reprintRequire;
