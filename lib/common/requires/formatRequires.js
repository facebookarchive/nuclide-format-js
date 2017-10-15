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
    return normalizeModuleName(getModuleName(node.declarations[0].init), options);
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
    return getModuleName(node.declarations[0].init);
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

module.exports = formatRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvZm9ybWF0UmVxdWlyZXMuanMiXSwibmFtZXMiOlsiQ09ORklHIiwibm9kZVR5cGUiLCJJbXBvcnREZWNsYXJhdGlvbiIsImZpbHRlcnMiLCJwYXRoIiwiZ2V0U291cmNlIiwibm9kZSIsInNvdXJjZSIsInZhbHVlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE1vZHVsZU5hbWUiLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24iLCJvcHRpb25zIiwiaXNDYXBpdGFsaXplZE1vZHVsZU5hbWUiLCJub3JtYWxpemVNb2R1bGVOYW1lIiwiZGVjbGFyYXRpb25zIiwiaW5pdCIsImZvcm1hdFJlcXVpcmVzIiwicm9vdCIsImZpcnN0IiwiZ2V0IiwiX2ZpcnN0Iiwibm9kZUdyb3VwcyIsIm1hcCIsInBhdGhzIiwiZmluZCIsImNvbmZpZyIsImZpbHRlciIsImV2ZXJ5Iiwibm9kZXMiLCJzbGljZSIsImZvckVhY2giLCJyZW1vdmUiLCJzb3VyY2VHcm91cHMiLCJwdXNoIiwiT2JqZWN0Iiwia2V5cyIsInNvcnQiLCJzb3VyY2UxIiwic291cmNlMiIsInByb2dyYW1Cb2R5IiwiYWxsTm9kZXNSZW1vdmVkIiwibGVuZ3RoIiwiYWxsR3JvdXBzIiwic3RhdGVtZW50IiwiZ3JvdXAiLCJub2Rlc1RvSW5zZXJ0IiwiY29uY2F0IiwiaW5zZXJ0QmVmb3JlIiwiZGVjbGFyYXRpb24iLCJJZGVudGlmaWVyIiwiY2hlY2siLCJpZCIsIk9iamVjdFBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwicHJvcCIsImtleSIsIkFycmF5UGF0dGVybiIsImVsZW1lbnRzIiwiZWxlbWVudCIsInJhd05hbWUiLCJyZXF1aXJlTm9kZSIsInJocyIsIm5hbWVzIiwiTWVtYmVyRXhwcmVzc2lvbiIsInVuc2hpZnQiLCJwcm9wZXJ0eSIsIm5hbWUiLCJvYmplY3QiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImFyZ3VtZW50cyIsImpvaW4iLCJtb2R1bGVNYXAiLCJnZXRBbGlhcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBYUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7b01BdEJBOzs7Ozs7Ozs7O0FBOEJBO0FBQ0EsSUFBTUEsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLHNCQUFLQyxpQkFEakI7QUFFRUMsV0FBUyxxQkFBVztBQUFBLFdBQVEsNEJBQWFDLElBQWIsS0FBc0IsOEJBQWVBLElBQWYsQ0FBOUI7QUFBQSxHQUFYLENBRlg7QUFHRUMsYUFBVztBQUFBLFdBQ1RDLEtBQUtDLE1BQUwsQ0FBWUMsS0FESDtBQUFBO0FBSGIsQ0FGaUM7O0FBU2pDO0FBQ0E7QUFDRVAsWUFBVSxzQkFBS1EsbUJBRGpCO0FBRUVOLFdBQVMscUJBRVA7QUFBQSxXQUFRLG1DQUFvQkMsS0FBS0UsSUFBekIsQ0FBUjtBQUFBLEdBRk8sQ0FGWDtBQU1FRCxhQUFXO0FBQUEsV0FDVEssY0FBY0osS0FBS0ssVUFBbkIsQ0FEUztBQUFBO0FBTmIsQ0FWaUM7O0FBb0JqQztBQUNBO0FBQ0VWLFlBQVUsc0JBQUtXLG1CQURqQjtBQUVFVCxXQUFTLHFCQUVQO0FBQUEsV0FBUVUsMEJBQTBCVCxLQUFLRSxJQUEvQixDQUFSO0FBQUEsR0FGTyxFQUdQLFVBQUNGLElBQUQsRUFBT1UsT0FBUDtBQUFBLFdBQW1CQyx3QkFBd0JYLEtBQUtFLElBQTdCLEVBQW1DUSxPQUFuQyxDQUFuQjtBQUFBLEdBSE8sQ0FGWDtBQU9FVCxhQUFXLG1CQUFDQyxJQUFELEVBQU9RLE9BQVA7QUFBQSxXQUNURSxvQkFBb0JOLGNBQWNKLEtBQUtXLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUJDLElBQW5DLENBQXBCLEVBQThESixPQUE5RCxDQURTO0FBQUE7QUFQYixDQXJCaUM7O0FBZ0NqQztBQUNBO0FBQ0E7QUFD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WUFBTUUsT0FBTixDQUFjSCxJQUFJSSxRQUFKLENBQWFDLElBQTNCO0FBQ0FMLFlBQU1BLElBQUlNLE1BQVY7QUFDRCxLQUhELE1BR08sSUFDTCxzQkFBS0MsY0FBTCxDQUFvQmxCLEtBQXBCLENBQTBCVyxHQUExQixLQUNBLENBQUMsc0JBQUtaLFVBQUwsQ0FBZ0JDLEtBQWhCLENBQXNCVyxJQUFJUSxNQUExQixDQUZJLEVBR0w7QUFDQVIsWUFBTUEsSUFBSVEsTUFBVjtBQUNELEtBTE0sTUFLQSxJQUFJLHNCQUFLL0QsbUJBQUwsQ0FBeUI0QyxLQUF6QixDQUErQlcsR0FBL0IsQ0FBSixFQUF5QztBQUM5Q0EsWUFBTUEsSUFBSXJELFVBQVY7QUFDRCxLQUZNLE1BRUE7QUFDTDtBQUNEO0FBQ0Y7QUFDRHNELFFBQU1FLE9BQU4sQ0FBY0gsSUFBSVMsU0FBSixDQUFjLENBQWQsRUFBaUJqRSxLQUEvQjtBQUNBLFNBQU95RCxNQUFNUyxJQUFOLENBQVcsR0FBWCxDQUFQO0FBQ0Q7O0FBRUQsU0FBUzFELG1CQUFULENBQTZCcUQsSUFBN0IsRUFBMkN2RCxPQUEzQyxFQUEyRTtBQUN6RSxTQUFPQSxRQUFRNkQsU0FBUixDQUFrQkMsUUFBbEIsQ0FBMkJQLElBQTNCLENBQVA7QUFDRDs7QUFFRFEsT0FBT0MsT0FBUCxHQUFpQjNELGNBQWpCIiwiZmlsZSI6ImZvcm1hdFJlcXVpcmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBGaXJzdE5vZGUgZnJvbSAnLi4vdXRpbHMvRmlyc3ROb2RlJztcbmltcG9ydCBOZXdMaW5lIGZyb20gJy4uL3V0aWxzL05ld0xpbmUnO1xuaW1wb3J0IHtjb21wYXJlU3RyaW5nc0NhcGl0YWxzRmlyc3QsIGlzQ2FwaXRhbGl6ZWR9IGZyb20gJy4uL3V0aWxzL1N0cmluZ1V0aWxzJztcbmltcG9ydCBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24gZnJvbSAnLi4vdXRpbHMvaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uJztcbmltcG9ydCBpc0dsb2JhbCBmcm9tICcuLi91dGlscy9pc0dsb2JhbCc7XG5pbXBvcnQgaXNSZXF1aXJlRXhwcmVzc2lvbiBmcm9tICcuLi91dGlscy9pc1JlcXVpcmVFeHByZXNzaW9uJztcbmltcG9ydCBpc1R5cGVJbXBvcnQgZnJvbSAnLi4vdXRpbHMvaXNUeXBlSW1wb3J0JztcbmltcG9ydCBpc1R5cGVvZkltcG9ydCBmcm9tICcuLi91dGlscy9pc1R5cGVvZkltcG9ydCc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgcmVwcmludFJlcXVpcmUgZnJvbSAnLi4vdXRpbHMvcmVwcmludFJlcXVpcmUnO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBub2RlVHlwZTogc3RyaW5nLFxuICBmaWx0ZXJzOiBBcnJheTwocGF0aDogTm9kZVBhdGgsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpID0+IGJvb2xlYW4+LFxuICBnZXRTb3VyY2U6IChub2RlOiBOb2RlLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKSA9PiBzdHJpbmcsXG59O1xuXG4vLyBTZXQgdXAgYSBjb25maWcgdG8gZWFzaWx5IGFkZCByZXF1aXJlIGZvcm1hdHNcbmNvbnN0IENPTkZJRzogQXJyYXk8Q29uZmlnRW50cnk+ID0gW1xuICAvLyBIYW5kbGUgdHlwZSBpbXBvcnRzXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbaXNHbG9iYWwsIHBhdGggPT4gaXNUeXBlSW1wb3J0KHBhdGgpIHx8IGlzVHlwZW9mSW1wb3J0KHBhdGgpXSxcbiAgICBnZXRTb3VyY2U6IG5vZGUgPT5cbiAgICAgIG5vZGUuc291cmNlLnZhbHVlLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBzaWRlIGVmZmVjdHMsIGUuZzogYHJlcXVpcmUoJ21vbmtleS1wYXRjaGVzJyk7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudCxcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNSZXF1aXJlRXhwcmVzc2lvbihwYXRoLm5vZGUpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiBub2RlID0+XG4gICAgICBnZXRNb2R1bGVOYW1lKG5vZGUuZXhwcmVzc2lvbiksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIFVwcGVyQ2FzZSByZXF1aXJlcywgZS5nOiBgY29uc3QgVXBwZXJDYXNlID0gcmVxdWlyZSgnVXBwZXJDYXNlJyk7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihwYXRoLm5vZGUpLFxuICAgICAgKHBhdGgsIG9wdGlvbnMpID0+IGlzQ2FwaXRhbGl6ZWRNb2R1bGVOYW1lKHBhdGgubm9kZSwgb3B0aW9ucyksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IChub2RlLCBvcHRpb25zKSA9PlxuICAgICAgbm9ybWFsaXplTW9kdWxlTmFtZShnZXRNb2R1bGVOYW1lKG5vZGUuZGVjbGFyYXRpb25zWzBdLmluaXQpLCBvcHRpb25zKSxcbiAgfSxcblxuICAvLyBIYW5kbGUgbG93ZXJDYXNlIHJlcXVpcmVzLCBlLmc6IGBjb25zdCBsb3dlckNhc2UgPSByZXF1aXJlKCdsb3dlckNhc2UnKTtgXG4gIC8vIGFuZCBkZXN0cnVjdHVyaW5nXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIGlzR2xvYmFsLFxuICAgICAgcGF0aCA9PiBpc1ZhbGlkUmVxdWlyZURlY2xhcmF0aW9uKHBhdGgubm9kZSksXG4gICAgICAocGF0aCwgb3B0aW9ucykgPT4gIWlzQ2FwaXRhbGl6ZWRNb2R1bGVOYW1lKHBhdGgubm9kZSwgb3B0aW9ucyksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IChub2RlLCBvcHRpb25zKSA9PlxuICAgICAgZ2V0TW9kdWxlTmFtZShub2RlLmRlY2xhcmF0aW9uc1swXS5pbml0KSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyBmb3JtYXRzIHJlcXVpcmVzIGJhc2VkIG9uIHRoZSByaWdodCBoYW5kIHNpZGUgb2YgdGhlIHJlcXVpcmUuXG4gKlxuICogVGhlIGdyb3VwcyBhcmU6XG4gKlxuICogICAtIGltcG9ydCB0eXBlczogaW1wb3J0IHR5cGUgRm9vIGZyb20gJ2FueXRoaW5nJztcbiAqICAgLSByZXF1aXJlIGV4cHJlc3Npb25zOiByZXF1aXJlKCdhbnl0aGluZycpO1xuICogICAtIGNhcGl0YWxpemVkIHJlcXVpcmVzOiB2YXIgRm9vID0gcmVxdWlyZSgnQW55dGhpbmcnKTtcbiAqICAgLSBub24tY2FwaXRhbGl6ZWQgcmVxdWlyZXM6IHZhciBmb28gPSByZXF1aXJlKCdhbnl0aGluZycpO1xuICpcbiAqIEFycmF5IGFuZCBvYmplY3QgZGVzdHJ1Y3R1cmVzIGFyZSBhbHNvIHZhbGlkIGxlZnQgaGFuZCBzaWRlcy4gT2JqZWN0IHBhdHRlcm5zXG4gKiBhcmUgc29ydGVkLlxuICovXG5mdW5jdGlvbiBmb3JtYXRSZXF1aXJlcyhyb290OiBDb2xsZWN0aW9uLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogdm9pZCB7XG4gIGNvbnN0IGZpcnN0ID0gRmlyc3ROb2RlLmdldChyb290KTtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBfZmlyc3QgPSBmaXJzdDsgLy8gRm9yIGZsb3cuXG4gIC8vIENyZWF0ZSBncm91cHMgb2YgcmVxdWlyZXMgZnJvbSBlYWNoIGNvbmZpZ1xuICBjb25zdCBub2RlR3JvdXBzID0gQ09ORklHLm1hcChjb25maWcgPT4ge1xuICAgIGNvbnN0IHBhdGhzID0gcm9vdFxuICAgICAgLmZpbmQoY29uZmlnLm5vZGVUeXBlKVxuICAgICAgLmZpbHRlcihwYXRoID0+IGNvbmZpZy5maWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXIocGF0aCwgb3B0aW9ucykpKTtcblxuICAgIC8vIFNhdmUgdGhlIHVuZGVybHlpbmcgbm9kZXMgYmVmb3JlIHJlbW92aW5nIHRoZSBwYXRoc1xuICAgIGNvbnN0IG5vZGVzID0gcGF0aHMubm9kZXMoKS5zbGljZSgpO1xuICAgIHBhdGhzLmZvckVhY2gocGF0aCA9PiBqc2NzKHBhdGgpLnJlbW92ZSgpKTtcbiAgICBjb25zdCBzb3VyY2VHcm91cHMgPSB7fTtcbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gY29uZmlnLmdldFNvdXJjZShub2RlLCBvcHRpb25zKTtcbiAgICAgIChzb3VyY2VHcm91cHNbc291cmNlXSA9IHNvdXJjZUdyb3Vwc1tzb3VyY2VdIHx8IFtdKS5wdXNoKG5vZGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2VHcm91cHMpXG4gICAgICAuc29ydCgoc291cmNlMSwgc291cmNlMikgPT4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0ZpcnN0KHNvdXJjZTEsIHNvdXJjZTIpKVxuICAgICAgLm1hcChzb3VyY2UgPT4gcmVwcmludFJlcXVpcmUoc291cmNlR3JvdXBzW3NvdXJjZV0pKTtcbiAgfSk7XG5cbiAgY29uc3QgcHJvZ3JhbUJvZHkgPSByb290LmdldCgncHJvZ3JhbScpLmdldCgnYm9keScpO1xuICBjb25zdCBhbGxOb2Rlc1JlbW92ZWQgPSBwcm9ncmFtQm9keS52YWx1ZS5sZW5ndGggPT09IDA7XG5cbiAgLy8gQnVpbGQgYWxsIHRoZSBub2RlcyB3ZSB3YW50IHRvIGluc2VydCwgdGhlbiBhZGQgdGhlbVxuICBjb25zdCBhbGxHcm91cHMgPSBbW05ld0xpbmUuc3RhdGVtZW50XV07XG4gIG5vZGVHcm91cHMuZm9yRWFjaChncm91cCA9PiBhbGxHcm91cHMucHVzaChncm91cCwgW05ld0xpbmUuc3RhdGVtZW50XSkpO1xuICBjb25zdCBub2Rlc1RvSW5zZXJ0ID0gW10uY29uY2F0KC4uLmFsbEdyb3Vwcyk7XG4gIGlmIChhbGxOb2Rlc1JlbW92ZWQpIHtcbiAgICBwcm9ncmFtQm9keS5wdXNoKC4uLm5vZGVzVG9JbnNlcnQpO1xuICB9IGVsc2Uge1xuICAgIF9maXJzdC5pbnNlcnRCZWZvcmUoLi4ubm9kZXNUb0luc2VydCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGlzIGEgdmFsaWQgcmVxdWlyZSBkZWNsYXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIGlmICghaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGpzY3MuT2JqZWN0UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5ldmVyeShcbiAgICAgIHByb3AgPT4ganNjcy5JZGVudGlmaWVyLmNoZWNrKHByb3Aua2V5KSxcbiAgICApO1xuICB9XG4gIGlmIChqc2NzLkFycmF5UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gZGVjbGFyYXRpb24uaWQuZWxlbWVudHMuZXZlcnkoXG4gICAgICBlbGVtZW50ID0+IGpzY3MuSWRlbnRpZmllci5jaGVjayhlbGVtZW50KSxcbiAgICApO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNDYXBpdGFsaXplZE1vZHVsZU5hbWUobm9kZTogTm9kZSwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IGJvb2xlYW4ge1xuICBjb25zdCByYXdOYW1lID0gZ2V0TW9kdWxlTmFtZShub2RlLmRlY2xhcmF0aW9uc1swXS5pbml0KTtcbiAgcmV0dXJuIGlzQ2FwaXRhbGl6ZWQobm9ybWFsaXplTW9kdWxlTmFtZShyYXdOYW1lLCBvcHRpb25zKSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vZHVsZU5hbWUocmVxdWlyZU5vZGU6IE5vZGUpOiBzdHJpbmcge1xuICBsZXQgcmhzID0gcmVxdWlyZU5vZGU7XG4gIGNvbnN0IG5hbWVzID0gW107XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKGpzY3MuTWVtYmVyRXhwcmVzc2lvbi5jaGVjayhyaHMpKSB7XG4gICAgICBuYW1lcy51bnNoaWZ0KHJocy5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgIHJocyA9IHJocy5vYmplY3Q7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGpzY3MuQ2FsbEV4cHJlc3Npb24uY2hlY2socmhzKSAmJlxuICAgICAgIWpzY3MuSWRlbnRpZmllci5jaGVjayhyaHMuY2FsbGVlKVxuICAgICkge1xuICAgICAgcmhzID0gcmhzLmNhbGxlZTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudC5jaGVjayhyaHMpKSB7XG4gICAgICByaHMgPSByaHMuZXhwcmVzc2lvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIG5hbWVzLnVuc2hpZnQocmhzLmFyZ3VtZW50c1swXS52YWx1ZSk7XG4gIHJldHVybiBuYW1lcy5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1vZHVsZU5hbWUobmFtZTogc3RyaW5nLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9wdGlvbnMubW9kdWxlTWFwLmdldEFsaWFzKG5hbWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFJlcXVpcmVzO1xuIl19