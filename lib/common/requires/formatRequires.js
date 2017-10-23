'use strict';

var _FirstNode = require('../utils/FirstNode');

var _FirstNode2 = _interopRequireDefault(_FirstNode);

var _NewLine = require('../utils/NewLine');

var _NewLine2 = _interopRequireDefault(_NewLine);

var _StringUtils = require('../utils/StringUtils');

var _hasOneRequireDeclaration = require('../utils/hasOneRequireDeclaration');

var _hasOneRequireDeclaration2 = _interopRequireDefault(_hasOneRequireDeclaration);

var _isGlobal = require('../utils/isGlobal');

var _isGlobal2 = _interopRequireDefault(_isGlobal);

var _isRequireExpression = require('../utils/isRequireExpression');

var _isRequireExpression2 = _interopRequireDefault(_isRequireExpression);

var _isTypeImport = require('../utils/isTypeImport');

var _isTypeImport2 = _interopRequireDefault(_isTypeImport);

var _isTypeofImport = require('../utils/isTypeofImport');

var _isTypeofImport2 = _interopRequireDefault(_isTypeofImport);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _reprintRequire = require('../utils/reprintRequire');

var _reprintRequire2 = _interopRequireDefault(_reprintRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /*
                                                                                                                                                                                                     * Copyright (c) 2015-present, Facebook, Inc.
                                                                                                                                                                                                     * All rights reserved.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * This source code is licensed under the license found in the LICENSE file in
                                                                                                                                                                                                     * the root directory of this source tree.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * 
                                                                                                                                                                                                     */

// Set up a config to easily add require formats
var CONFIG = [
// Handle type imports
{
  nodeType: _jscodeshift2.default.ImportDeclaration,
  filters: [_isGlobal2.default, function (path) {
    return (0, _isTypeImport2.default)(path) || (0, _isTypeofImport2.default)(path);
  }],
  getSource: function getSource(node) {
    return node.source.value;
  }
},

// Handle side effects, e.g: `require('monkey-patches');`
{
  nodeType: _jscodeshift2.default.ExpressionStatement,
  filters: [_isGlobal2.default, function (path) {
    return (0, _isRequireExpression2.default)(path.node);
  }],
  getSource: function getSource(node) {
    return getModuleName(node.expression);
  }
},

// Handle UpperCase requires, e.g: `const UpperCase = require('UpperCase');`
{
  nodeType: _jscodeshift2.default.VariableDeclaration,
  filters: [_isGlobal2.default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path, options) {
    return isCapitalizedModuleName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return normalizeModuleName(tagPatternRequire(getModuleName(node.declarations[0].init), node), options);
  }
},

// Handle lowerCase requires, e.g: `const lowerCase = require('lowerCase');`
// and destructuring
{
  nodeType: _jscodeshift2.default.VariableDeclaration,
  filters: [_isGlobal2.default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path, options) {
    return !isCapitalizedModuleName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return tagPatternRequire(getModuleName(node.declarations[0].init), node);
  }
}];

/**
 * This formats requires based on the right hand side of the require.
 *
 * The groups are:
 *
 *   - import types: import type Foo from 'anything';
 *   - require expressions: require('anything');
 *   - capitalized requires: var Foo = require('Anything');
 *   - non-capitalized requires: var foo = require('anything');
 *
 * Array and object destructures are also valid left hand sides. Object patterns
 * are sorted.
 */
function formatRequires(root, options) {
  var _ref;

  var first = _FirstNode2.default.get(root);
  if (!first) {
    return;
  }
  var _first = first; // For flow.
  // Create groups of requires from each config
  var nodeGroups = CONFIG.map(function (config) {
    var paths = root.find(config.nodeType).filter(function (path) {
      return config.filters.every(function (filter) {
        return filter(path, options);
      });
    });

    // Save the underlying nodes before removing the paths
    var nodes = paths.nodes().slice();
    paths.forEach(function (path) {
      return (0, _jscodeshift2.default)(path).remove();
    });
    var sourceGroups = {};
    nodes.forEach(function (node) {
      var source = config.getSource(node, options);
      (sourceGroups[source] = sourceGroups[source] || []).push(node);
    });
    return Object.keys(sourceGroups).sort(function (source1, source2) {
      return (0, _StringUtils.compareStringsCapitalsFirst)(source1, source2);
    }).map(function (source) {
      return (0, _reprintRequire2.default)(sourceGroups[source]);
    });
  });

  var programBody = root.get('program').get('body');
  var allNodesRemoved = programBody.value.length === 0;

  // Build all the nodes we want to insert, then add them
  var allGroups = [[_NewLine2.default.statement]];
  nodeGroups.forEach(function (group) {
    return allGroups.push(group, [_NewLine2.default.statement]);
  });
  var nodesToInsert = (_ref = []).concat.apply(_ref, allGroups);
  if (allNodesRemoved) {
    programBody.push.apply(programBody, _toConsumableArray(nodesToInsert));
  } else {
    _first.insertBefore.apply(_first, _toConsumableArray(nodesToInsert));
  }
}

/**
 * Tests if a variable declaration is a valid require declaration.
 */
function isValidRequireDeclaration(node) {
  if (!(0, _hasOneRequireDeclaration2.default)(node)) {
    return false;
  }
  var declaration = node.declarations[0];
  if (_jscodeshift2.default.Identifier.check(declaration.id)) {
    return true;
  }
  if (_jscodeshift2.default.ObjectPattern.check(declaration.id)) {
    return declaration.id.properties.every(function (prop) {
      return _jscodeshift2.default.Identifier.check(prop.key);
    });
  }
  if (_jscodeshift2.default.ArrayPattern.check(declaration.id)) {
    return declaration.id.elements.every(function (element) {
      return _jscodeshift2.default.Identifier.check(element);
    });
  }
  return false;
}

function isCapitalizedModuleName(node, options) {
  var rawName = getModuleName(node.declarations[0].init);
  return (0, _StringUtils.isCapitalized)(normalizeModuleName(rawName, options));
}

function getModuleName(requireNode) {
  var rhs = requireNode;
  var names = [];
  while (true) {
    if (_jscodeshift2.default.MemberExpression.check(rhs)) {
      names.unshift(rhs.property.name);
      rhs = rhs.object;
    } else if (_jscodeshift2.default.CallExpression.check(rhs) && !_jscodeshift2.default.Identifier.check(rhs.callee)) {
      rhs = rhs.callee;
    } else if (_jscodeshift2.default.ExpressionStatement.check(rhs)) {
      rhs = rhs.expression;
    } else {
      break;
    }
  }
  names.unshift(rhs.arguments[0].value);
  return names.join('.');
}

function normalizeModuleName(name, options) {
  return options.moduleMap.getAlias(name);
}

// Tag pattern requires so they are not mangled by normal id requires,
// and to make the ordering deterministic
function tagPatternRequire(name, node) {
  var tag = _jscodeshift2.default.Identifier.check(node.declarations[0].id) ? '' : '|PATTERN';
  return name + tag;
}

module.exports = formatRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvZm9ybWF0UmVxdWlyZXMuanMiXSwibmFtZXMiOlsiQ09ORklHIiwibm9kZVR5cGUiLCJJbXBvcnREZWNsYXJhdGlvbiIsImZpbHRlcnMiLCJwYXRoIiwiZ2V0U291cmNlIiwibm9kZSIsInNvdXJjZSIsInZhbHVlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE1vZHVsZU5hbWUiLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24iLCJvcHRpb25zIiwiaXNDYXBpdGFsaXplZE1vZHVsZU5hbWUiLCJub3JtYWxpemVNb2R1bGVOYW1lIiwidGFnUGF0dGVyblJlcXVpcmUiLCJkZWNsYXJhdGlvbnMiLCJpbml0IiwiZm9ybWF0UmVxdWlyZXMiLCJyb290IiwiZmlyc3QiLCJnZXQiLCJfZmlyc3QiLCJub2RlR3JvdXBzIiwibWFwIiwicGF0aHMiLCJmaW5kIiwiY29uZmlnIiwiZmlsdGVyIiwiZXZlcnkiLCJub2RlcyIsInNsaWNlIiwiZm9yRWFjaCIsInJlbW92ZSIsInNvdXJjZUdyb3VwcyIsInB1c2giLCJPYmplY3QiLCJrZXlzIiwic29ydCIsInNvdXJjZTEiLCJzb3VyY2UyIiwicHJvZ3JhbUJvZHkiLCJhbGxOb2Rlc1JlbW92ZWQiLCJsZW5ndGgiLCJhbGxHcm91cHMiLCJzdGF0ZW1lbnQiLCJncm91cCIsIm5vZGVzVG9JbnNlcnQiLCJjb25jYXQiLCJpbnNlcnRCZWZvcmUiLCJkZWNsYXJhdGlvbiIsIklkZW50aWZpZXIiLCJjaGVjayIsImlkIiwiT2JqZWN0UGF0dGVybiIsInByb3BlcnRpZXMiLCJwcm9wIiwia2V5IiwiQXJyYXlQYXR0ZXJuIiwiZWxlbWVudHMiLCJlbGVtZW50IiwicmF3TmFtZSIsInJlcXVpcmVOb2RlIiwicmhzIiwibmFtZXMiLCJNZW1iZXJFeHByZXNzaW9uIiwidW5zaGlmdCIsInByb3BlcnR5IiwibmFtZSIsIm9iamVjdCIsIkNhbGxFeHByZXNzaW9uIiwiY2FsbGVlIiwiYXJndW1lbnRzIiwiam9pbiIsIm1vZHVsZU1hcCIsImdldEFsaWFzIiwidGFnIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztvTUF0QkE7Ozs7Ozs7Ozs7QUE4QkE7QUFDQSxJQUFNQSxTQUE2QjtBQUNqQztBQUNBO0FBQ0VDLFlBQVUsc0JBQUtDLGlCQURqQjtBQUVFQyxXQUFTLHFCQUFXO0FBQUEsV0FBUSw0QkFBYUMsSUFBYixLQUFzQiw4QkFBZUEsSUFBZixDQUE5QjtBQUFBLEdBQVgsQ0FGWDtBQUdFQyxhQUFXO0FBQUEsV0FDVEMsS0FBS0MsTUFBTCxDQUFZQyxLQURIO0FBQUE7QUFIYixDQUZpQzs7QUFTakM7QUFDQTtBQUNFUCxZQUFVLHNCQUFLUSxtQkFEakI7QUFFRU4sV0FBUyxxQkFFUDtBQUFBLFdBQVEsbUNBQW9CQyxLQUFLRSxJQUF6QixDQUFSO0FBQUEsR0FGTyxDQUZYO0FBTUVELGFBQVc7QUFBQSxXQUNUSyxjQUFjSixLQUFLSyxVQUFuQixDQURTO0FBQUE7QUFOYixDQVZpQzs7QUFvQmpDO0FBQ0E7QUFDRVYsWUFBVSxzQkFBS1csbUJBRGpCO0FBRUVULFdBQVMscUJBRVA7QUFBQSxXQUFRVSwwQkFBMEJULEtBQUtFLElBQS9CLENBQVI7QUFBQSxHQUZPLEVBR1AsVUFBQ0YsSUFBRCxFQUFPVSxPQUFQO0FBQUEsV0FBbUJDLHdCQUF3QlgsS0FBS0UsSUFBN0IsRUFBbUNRLE9BQW5DLENBQW5CO0FBQUEsR0FITyxDQUZYO0FBT0VULGFBQVcsbUJBQUNDLElBQUQsRUFBT1EsT0FBUDtBQUFBLFdBQ1RFLG9CQUNFQyxrQkFBa0JQLGNBQWNKLEtBQUtZLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUJDLElBQW5DLENBQWxCLEVBQTREYixJQUE1RCxDQURGLEVBRUVR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dCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbiwgTm9kZSwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IEZpcnN0Tm9kZSBmcm9tICcuLi91dGlscy9GaXJzdE5vZGUnO1xuaW1wb3J0IE5ld0xpbmUgZnJvbSAnLi4vdXRpbHMvTmV3TGluZSc7XG5pbXBvcnQge2NvbXBhcmVTdHJpbmdzQ2FwaXRhbHNGaXJzdCwgaXNDYXBpdGFsaXplZH0gZnJvbSAnLi4vdXRpbHMvU3RyaW5nVXRpbHMnO1xuaW1wb3J0IGhhc09uZVJlcXVpcmVEZWNsYXJhdGlvbiBmcm9tICcuLi91dGlscy9oYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24nO1xuaW1wb3J0IGlzR2xvYmFsIGZyb20gJy4uL3V0aWxzL2lzR2xvYmFsJztcbmltcG9ydCBpc1JlcXVpcmVFeHByZXNzaW9uIGZyb20gJy4uL3V0aWxzL2lzUmVxdWlyZUV4cHJlc3Npb24nO1xuaW1wb3J0IGlzVHlwZUltcG9ydCBmcm9tICcuLi91dGlscy9pc1R5cGVJbXBvcnQnO1xuaW1wb3J0IGlzVHlwZW9mSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVHlwZW9mSW1wb3J0JztcbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcbmltcG9ydCByZXByaW50UmVxdWlyZSBmcm9tICcuLi91dGlscy9yZXByaW50UmVxdWlyZSc7XG5cbnR5cGUgQ29uZmlnRW50cnkgPSB7XG4gIG5vZGVUeXBlOiBzdHJpbmcsXG4gIGZpbHRlcnM6IEFycmF5PChwYXRoOiBOb2RlUGF0aCwgb3B0aW9uczogU291cmNlT3B0aW9ucykgPT4gYm9vbGVhbj4sXG4gIGdldFNvdXJjZTogKG5vZGU6IE5vZGUsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpID0+IHN0cmluZyxcbn07XG5cbi8vIFNldCB1cCBhIGNvbmZpZyB0byBlYXNpbHkgYWRkIHJlcXVpcmUgZm9ybWF0c1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIEhhbmRsZSB0eXBlIGltcG9ydHNcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtpc0dsb2JhbCwgcGF0aCA9PiBpc1R5cGVJbXBvcnQocGF0aCkgfHwgaXNUeXBlb2ZJbXBvcnQocGF0aCldLFxuICAgIGdldFNvdXJjZTogbm9kZSA9PlxuICAgICAgbm9kZS5zb3VyY2UudmFsdWUsXG4gIH0sXG5cbiAgLy8gSGFuZGxlIHNpZGUgZWZmZWN0cywgZS5nOiBgcmVxdWlyZSgnbW9ua2V5LXBhdGNoZXMnKTtgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIGlzR2xvYmFsLFxuICAgICAgcGF0aCA9PiBpc1JlcXVpcmVFeHByZXNzaW9uKHBhdGgubm9kZSksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IG5vZGUgPT5cbiAgICAgIGdldE1vZHVsZU5hbWUobm9kZS5leHByZXNzaW9uKSxcbiAgfSxcblxuICAvLyBIYW5kbGUgVXBwZXJDYXNlIHJlcXVpcmVzLCBlLmc6IGBjb25zdCBVcHBlckNhc2UgPSByZXF1aXJlKCdVcHBlckNhc2UnKTtgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIGlzR2xvYmFsLFxuICAgICAgcGF0aCA9PiBpc1ZhbGlkUmVxdWlyZURlY2xhcmF0aW9uKHBhdGgubm9kZSksXG4gICAgICAocGF0aCwgb3B0aW9ucykgPT4gaXNDYXBpdGFsaXplZE1vZHVsZU5hbWUocGF0aC5ub2RlLCBvcHRpb25zKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogKG5vZGUsIG9wdGlvbnMpID0+XG4gICAgICBub3JtYWxpemVNb2R1bGVOYW1lKFxuICAgICAgICB0YWdQYXR0ZXJuUmVxdWlyZShnZXRNb2R1bGVOYW1lKG5vZGUuZGVjbGFyYXRpb25zWzBdLmluaXQpLCBub2RlKSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIGxvd2VyQ2FzZSByZXF1aXJlcywgZS5nOiBgY29uc3QgbG93ZXJDYXNlID0gcmVxdWlyZSgnbG93ZXJDYXNlJyk7YFxuICAvLyBhbmQgZGVzdHJ1Y3R1cmluZ1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihwYXRoLm5vZGUpLFxuICAgICAgKHBhdGgsIG9wdGlvbnMpID0+ICFpc0NhcGl0YWxpemVkTW9kdWxlTmFtZShwYXRoLm5vZGUsIG9wdGlvbnMpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiAobm9kZSwgb3B0aW9ucykgPT5cbiAgICAgIHRhZ1BhdHRlcm5SZXF1aXJlKGdldE1vZHVsZU5hbWUobm9kZS5kZWNsYXJhdGlvbnNbMF0uaW5pdCksIG5vZGUpLFxuICB9LFxuXTtcblxuLyoqXG4gKiBUaGlzIGZvcm1hdHMgcmVxdWlyZXMgYmFzZWQgb24gdGhlIHJpZ2h0IGhhbmQgc2lkZSBvZiB0aGUgcmVxdWlyZS5cbiAqXG4gKiBUaGUgZ3JvdXBzIGFyZTpcbiAqXG4gKiAgIC0gaW1wb3J0IHR5cGVzOiBpbXBvcnQgdHlwZSBGb28gZnJvbSAnYW55dGhpbmcnO1xuICogICAtIHJlcXVpcmUgZXhwcmVzc2lvbnM6IHJlcXVpcmUoJ2FueXRoaW5nJyk7XG4gKiAgIC0gY2FwaXRhbGl6ZWQgcmVxdWlyZXM6IHZhciBGb28gPSByZXF1aXJlKCdBbnl0aGluZycpO1xuICogICAtIG5vbi1jYXBpdGFsaXplZCByZXF1aXJlczogdmFyIGZvbyA9IHJlcXVpcmUoJ2FueXRoaW5nJyk7XG4gKlxuICogQXJyYXkgYW5kIG9iamVjdCBkZXN0cnVjdHVyZXMgYXJlIGFsc28gdmFsaWQgbGVmdCBoYW5kIHNpZGVzLiBPYmplY3QgcGF0dGVybnNcbiAqIGFyZSBzb3J0ZWQuXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdFJlcXVpcmVzKHJvb3Q6IENvbGxlY3Rpb24sIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiB2b2lkIHtcbiAgY29uc3QgZmlyc3QgPSBGaXJzdE5vZGUuZ2V0KHJvb3QpO1xuICBpZiAoIWZpcnN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IF9maXJzdCA9IGZpcnN0OyAvLyBGb3IgZmxvdy5cbiAgLy8gQ3JlYXRlIGdyb3VwcyBvZiByZXF1aXJlcyBmcm9tIGVhY2ggY29uZmlnXG4gIGNvbnN0IG5vZGVHcm91cHMgPSBDT05GSUcubWFwKGNvbmZpZyA9PiB7XG4gICAgY29uc3QgcGF0aHMgPSByb290XG4gICAgICAuZmluZChjb25maWcubm9kZVR5cGUpXG4gICAgICAuZmlsdGVyKHBhdGggPT4gY29uZmlnLmZpbHRlcnMuZXZlcnkoZmlsdGVyID0+IGZpbHRlcihwYXRoLCBvcHRpb25zKSkpO1xuXG4gICAgLy8gU2F2ZSB0aGUgdW5kZXJseWluZyBub2RlcyBiZWZvcmUgcmVtb3ZpbmcgdGhlIHBhdGhzXG4gICAgY29uc3Qgbm9kZXMgPSBwYXRocy5ub2RlcygpLnNsaWNlKCk7XG4gICAgcGF0aHMuZm9yRWFjaChwYXRoID0+IGpzY3MocGF0aCkucmVtb3ZlKCkpO1xuICAgIGNvbnN0IHNvdXJjZUdyb3VwcyA9IHt9O1xuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBjb25maWcuZ2V0U291cmNlKG5vZGUsIG9wdGlvbnMpO1xuICAgICAgKHNvdXJjZUdyb3Vwc1tzb3VyY2VdID0gc291cmNlR3JvdXBzW3NvdXJjZV0gfHwgW10pLnB1c2gobm9kZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZUdyb3VwcylcbiAgICAgIC5zb3J0KChzb3VyY2UxLCBzb3VyY2UyKSA9PiBjb21wYXJlU3RyaW5nc0NhcGl0YWxzRmlyc3Qoc291cmNlMSwgc291cmNlMikpXG4gICAgICAubWFwKHNvdXJjZSA9PiByZXByaW50UmVxdWlyZShzb3VyY2VHcm91cHNbc291cmNlXSkpO1xuICB9KTtcblxuICBjb25zdCBwcm9ncmFtQm9keSA9IHJvb3QuZ2V0KCdwcm9ncmFtJykuZ2V0KCdib2R5Jyk7XG4gIGNvbnN0IGFsbE5vZGVzUmVtb3ZlZCA9IHByb2dyYW1Cb2R5LnZhbHVlLmxlbmd0aCA9PT0gMDtcblxuICAvLyBCdWlsZCBhbGwgdGhlIG5vZGVzIHdlIHdhbnQgdG8gaW5zZXJ0LCB0aGVuIGFkZCB0aGVtXG4gIGNvbnN0IGFsbEdyb3VwcyA9IFtbTmV3TGluZS5zdGF0ZW1lbnRdXTtcbiAgbm9kZUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGFsbEdyb3Vwcy5wdXNoKGdyb3VwLCBbTmV3TGluZS5zdGF0ZW1lbnRdKSk7XG4gIGNvbnN0IG5vZGVzVG9JbnNlcnQgPSBbXS5jb25jYXQoLi4uYWxsR3JvdXBzKTtcbiAgaWYgKGFsbE5vZGVzUmVtb3ZlZCkge1xuICAgIHByb2dyYW1Cb2R5LnB1c2goLi4ubm9kZXNUb0luc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgX2ZpcnN0Lmluc2VydEJlZm9yZSguLi5ub2Rlc1RvSW5zZXJ0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgdmFyaWFibGUgZGVjbGFyYXRpb24gaXMgYSB2YWxpZCByZXF1aXJlIGRlY2xhcmF0aW9uLlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkUmVxdWlyZURlY2xhcmF0aW9uKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgaWYgKCFoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLmV2ZXJ5KFxuICAgICAgcHJvcCA9PiBqc2NzLklkZW50aWZpZXIuY2hlY2socHJvcC5rZXkpLFxuICAgICk7XG4gIH1cbiAgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5lbGVtZW50cy5ldmVyeShcbiAgICAgIGVsZW1lbnQgPT4ganNjcy5JZGVudGlmaWVyLmNoZWNrKGVsZW1lbnQpLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0NhcGl0YWxpemVkTW9kdWxlTmFtZShub2RlOiBOb2RlLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJhd05hbWUgPSBnZXRNb2R1bGVOYW1lKG5vZGUuZGVjbGFyYXRpb25zWzBdLmluaXQpO1xuICByZXR1cm4gaXNDYXBpdGFsaXplZChub3JtYWxpemVNb2R1bGVOYW1lKHJhd05hbWUsIG9wdGlvbnMpKTtcbn1cblxuZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZShyZXF1aXJlTm9kZTogTm9kZSk6IHN0cmluZyB7XG4gIGxldCByaHMgPSByZXF1aXJlTm9kZTtcbiAgY29uc3QgbmFtZXMgPSBbXTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAoanNjcy5NZW1iZXJFeHByZXNzaW9uLmNoZWNrKHJocykpIHtcbiAgICAgIG5hbWVzLnVuc2hpZnQocmhzLnByb3BlcnR5Lm5hbWUpO1xuICAgICAgcmhzID0gcmhzLm9iamVjdDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAganNjcy5DYWxsRXhwcmVzc2lvbi5jaGVjayhyaHMpICYmXG4gICAgICAhanNjcy5JZGVudGlmaWVyLmNoZWNrKHJocy5jYWxsZWUpXG4gICAgKSB7XG4gICAgICByaHMgPSByaHMuY2FsbGVlO1xuICAgIH0gZWxzZSBpZiAoanNjcy5FeHByZXNzaW9uU3RhdGVtZW50LmNoZWNrKHJocykpIHtcbiAgICAgIHJocyA9IHJocy5leHByZXNzaW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgbmFtZXMudW5zaGlmdChyaHMuYXJndW1lbnRzWzBdLnZhbHVlKTtcbiAgcmV0dXJuIG5hbWVzLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTW9kdWxlTmFtZShuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiBzdHJpbmcge1xuICByZXR1cm4gb3B0aW9ucy5tb2R1bGVNYXAuZ2V0QWxpYXMobmFtZSk7XG59XG5cbi8vIFRhZyBwYXR0ZXJuIHJlcXVpcmVzIHNvIHRoZXkgYXJlIG5vdCBtYW5nbGVkIGJ5IG5vcm1hbCBpZCByZXF1aXJlcyxcbi8vIGFuZCB0byBtYWtlIHRoZSBvcmRlcmluZyBkZXRlcm1pbmlzdGljXG5mdW5jdGlvbiB0YWdQYXR0ZXJuUmVxdWlyZShuYW1lOiBzdHJpbmcsIG5vZGU6IE5vZGUpOiBzdHJpbmcge1xuICBjb25zdCB0YWcgPSBqc2NzLklkZW50aWZpZXIuY2hlY2sobm9kZS5kZWNsYXJhdGlvbnNbMF0uaWQpXG4gICAgICA/ICcnXG4gICAgICA6ICd8UEFUVEVSTic7XG4gIHJldHVybiBuYW1lICsgdGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFJlcXVpcmVzO1xuIl19