/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {Collection, Node, NodePath} from '../types/ast';

import FirstNode from '../utils/FirstNode';
import NewLine from '../utils/NewLine';
import {compareStrings, isCapitalized} from '../utils/StringUtils';
import hasOneRequireDeclaration from '../utils/hasOneRequireDeclaration';
import isGlobal from '../utils/isGlobal';
import isRequireExpression from '../utils/isRequireExpression';
import isTypeImport from '../utils/isTypeImport';
import isTypeofImport from '../utils/isTypeofImport';
import jscs from 'jscodeshift';
import reprintRequire from '../utils/reprintRequire';

type ConfigEntry = {
  nodeType: string,
  filters: Array<(path: NodePath) => boolean>,
  getSource: (node: Node) => string,
};

// Set up a config to easily add require formats
const CONFIG: Array<ConfigEntry> = [
  // Handle type imports
  {
    nodeType: jscs.ImportDeclaration,
    filters: [isGlobal, isTypeImport],
    getSource: node =>
      node.source.value,
  },

  // Handle typeof imports
  {
    nodeType: jscs.ImportDeclaration,
    filters: [isGlobal, isTypeofImport],
    getSource: node =>
      node.source.value,
  },

  // Handle side effects, e.g: `require('monkey-patches');`
  {
    nodeType: jscs.ExpressionStatement,
    filters: [
      isGlobal,
      path => isRequireExpression(path.node),
    ],
    getSource: node =>
      getDeclarationModuleName(node.expression),
  },

  // Handle UpperCase requires, e.g: `const UpperCase = require('UpperCase');`
  {
    nodeType: jscs.VariableDeclaration,
    filters: [
      isGlobal,
      path => isValidRequireDeclaration(path.node),
      path => isCapitalizedModuleDeclaration(path.node),
    ],
    getSource: node =>
      getDeclarationModuleName(node.declarations[0].init),
  },

  // Handle lowerCase requires, e.g: `const lowerCase = require('lowerCase');`
  // and destructuring
  {
    nodeType: jscs.VariableDeclaration,
    filters: [
      isGlobal,
      path => isValidRequireDeclaration(path.node),
      path => !isCapitalizedModuleDeclaration(path.node),
    ],
    getSource: node =>
      getDeclarationModuleName(node.declarations[0].init),
  },
];

/**
 * This formats requires based on the left hand side of the require, unless it
 * is a simple require expression in which case there is no left hand side.
 *
 * The groups are:
 *
 *   - import types: import type Foo from 'anything';
 *   - require expressions: require('anything');
 *   - capitalized requires: var Foo = require('anything');
 *   - non-capitalized requires: var foo = require('anything');
 *
 * Array and object destructures are also valid left hand sides. Object patterns
 * are sorted and then the first identifier in each of patterns is used for
 * sorting.
 */
function formatRequires(root: Collection): void {
  const first = FirstNode.get(root);
  if (!first) {
    return;
  }
  const _first = first; // For flow.
  // Create groups of requires from each config
  const nodeGroups = CONFIG.map(config => {
    const paths = root
      .find(config.nodeType)
      .filter(path => config.filters.every(filter => filter(path)));

    // Save the underlying nodes before removing the paths
    const nodes = paths.nodes().slice();
    paths.forEach(path => jscs(path).remove());
    const sourceGroups = {};
    nodes.forEach(node => {
      const source = config.getSource(node);
      (sourceGroups[source] = sourceGroups[source] || []).push(node);
    });
    return Object.keys(sourceGroups)
      .sort((source1, source2) => compareStrings(source1, source2))
      .map(source => reprintRequire(sourceGroups[source]));
  });

  const programBody = root.get('program').get('body');
  const allNodesRemoved = programBody.value.length === 0;

  // Build all the nodes we want to insert, then add them
  const allGroups = [[NewLine.statement]];
  nodeGroups.forEach(group => allGroups.push(group, [NewLine.statement]));
  const nodesToInsert = [].concat(...allGroups);
  if (allNodesRemoved) {
    programBody.push(...nodesToInsert);
  } else {
    _first.insertBefore(...nodesToInsert);
  }
}

/**
 * Tests if a variable declaration is a valid require declaration.
 */
function isValidRequireDeclaration(node: Node): boolean {
  if (!hasOneRequireDeclaration(node)) {
    return false;
  }
  const declaration = node.declarations[0];
  if (jscs.Identifier.check(declaration.id)) {
    return true;
  }
  if (jscs.ObjectPattern.check(declaration.id)) {
    return declaration.id.properties.every(
      prop => jscs.Identifier.check(prop.key),
    );
  }
  if (jscs.ArrayPattern.check(declaration.id)) {
    return declaration.id.elements.every(
      element => jscs.Identifier.check(element),
    );
  }
  return false;
}

function isCapitalizedModuleDeclaration(node: Node): boolean {
  const declaration = node.declarations[0];
  if (jscs.Identifier.check(declaration.id)) {
    return isCapitalized(declaration.id.name);
  }
  return false;
}

function getDeclarationModuleName(requireNode: Node): string {
  let rhs = requireNode;
  const names = [];
  while (true) {
    if (jscs.MemberExpression.check(rhs)) {
      names.unshift(rhs.property.name);
      rhs = rhs.object;
    } else if (
      jscs.CallExpression.check(rhs) &&
      !jscs.Identifier.check(rhs.callee)
    ) {
      rhs = rhs.callee;
    } else if (jscs.ExpressionStatement.check(rhs)) {
      rhs = rhs.expression;
    } else {
      break;
    }
  }
  names.unshift(rhs.arguments[0].value);
  return names.join('.');
}

module.exports = formatRequires;
