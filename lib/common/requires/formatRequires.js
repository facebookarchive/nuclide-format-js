'use strict';

var _FirstNode;

function _load_FirstNode() {
  return _FirstNode = _interopRequireDefault(require('../utils/FirstNode'));
}

var _NewLine;

function _load_NewLine() {
  return _NewLine = _interopRequireDefault(require('../utils/NewLine'));
}

var _StringUtils;

function _load_StringUtils() {
  return _StringUtils = require('../utils/StringUtils');
}

var _hasOneRequireDeclarationOrModuleImport;

function _load_hasOneRequireDeclarationOrModuleImport() {
  return _hasOneRequireDeclarationOrModuleImport = _interopRequireDefault(require('../utils/hasOneRequireDeclarationOrModuleImport'));
}

var _isGlobal;

function _load_isGlobal() {
  return _isGlobal = _interopRequireDefault(require('../utils/isGlobal'));
}

var _isRequireExpression;

function _load_isRequireExpression() {
  return _isRequireExpression = _interopRequireDefault(require('../utils/isRequireExpression'));
}

var _isTypeImport;

function _load_isTypeImport() {
  return _isTypeImport = _interopRequireDefault(require('../utils/isTypeImport'));
}

var _isTypeofImport;

function _load_isTypeofImport() {
  return _isTypeofImport = _interopRequireDefault(require('../utils/isTypeofImport'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('../utils/jscodeshift'));
}

var _reprintRequire;

function _load_reprintRequire() {
  return _reprintRequire = _interopRequireDefault(require('../utils/reprintRequire'));
}

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
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  filters: [(_isGlobal || _load_isGlobal()).default, function (path) {
    return (0, (_isTypeImport || _load_isTypeImport()).default)(path) || (0, (_isTypeofImport || _load_isTypeofImport()).default)(path);
  }],
  getSource: function getSource(node) {
    return node.source.value;
  }
},

// Handle side effectful requires, e.g: `require('monkey-patches');`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ExpressionStatement,
  filters: [(_isGlobal || _load_isGlobal()).default, function (path) {
    return (0, (_isRequireExpression || _load_isRequireExpression()).default)(path.node);
  }],
  getSource: function getSource(node) {
    return getModuleName(node.expression);
  }
},

// Handle side effectful imports, e.g: `import 'monkey-patches';`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  filters: [function (path) {
    return isBareImport(path.node);
  }],
  getSource: function getSource(node) {
    return getModuleName(node);
  }
},

// Handle UpperCase requires, e.g: `const UpperCase = require('UpperCase');`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.VariableDeclaration,
  filters: [(_isGlobal || _load_isGlobal()).default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path, options) {
    return isCapitalizedRequireName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return normalizedRequireSource(node, options);
  }
},

// Handle UpperCase imports, e.g: `import UpperCase from 'UpperCase';`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  filters: [function (path, options) {
    return isCapitalizedImportName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return normalizeModuleName(getModuleName(node), options);
  }
},

// Handle lowerCase requires, e.g: `const lowerCase = require('lowerCase');`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.VariableDeclaration,
  filters: [(_isGlobal || _load_isGlobal()).default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path, options) {
    return !isCapitalizedRequireName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return normalizedRequireSource(node, options);
  }
},

// Handle lowerCase imports, e.g: `import lowerCase from 'lowerCase';`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  filters: [function (path, options) {
    return !isCapitalizedImportName(path.node, options);
  }],
  getSource: function getSource(node, options) {
    return normalizeModuleName(getModuleName(node), options);
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

  var first = (_FirstNode || _load_FirstNode()).default.get(root);
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
      return (0, (_jscodeshift || _load_jscodeshift()).default)(path).remove();
    });
    var sourceGroups = {};
    nodes.forEach(function (node) {
      var source = config.getSource(node, options);
      (sourceGroups[source] = sourceGroups[source] || []).push(node);
    });
    return Object.keys(sourceGroups).sort(function (source1, source2) {
      return (0, (_StringUtils || _load_StringUtils()).compareStringsCapitalsFirst)(source1, source2);
    }).map(function (source) {
      return (0, (_reprintRequire || _load_reprintRequire()).default)(sourceGroups[source]);
    });
  });

  var programBody = root.get('program').get('body');
  var allNodesRemoved = programBody.value.length === 0;

  // Build all the nodes we want to insert, then add them
  var allGroups = [[(_NewLine || _load_NewLine()).default.statement]];
  nodeGroups.forEach(function (group) {
    return allGroups.push(group, [(_NewLine || _load_NewLine()).default.statement]);
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
  if (!(0, (_hasOneRequireDeclarationOrModuleImport || _load_hasOneRequireDeclarationOrModuleImport()).default)(node)) {
    return false;
  }
  var declaration = node.declarations[0];
  if ((_jscodeshift || _load_jscodeshift()).default.Identifier.check(declaration.id)) {
    return true;
  }
  if ((_jscodeshift || _load_jscodeshift()).default.ObjectPattern.check(declaration.id)) {
    return declaration.id.properties.every(function (prop) {
      return (_jscodeshift || _load_jscodeshift()).default.Identifier.check(prop.key);
    });
  }
  if ((_jscodeshift || _load_jscodeshift()).default.ArrayPattern.check(declaration.id)) {
    return declaration.id.elements.every(function (element) {
      return (_jscodeshift || _load_jscodeshift()).default.Identifier.check(element);
    });
  }
  return false;
}

function isCapitalizedRequireName(node, options) {
  return (0, (_StringUtils || _load_StringUtils()).isCapitalized)(getModuleName(node.declarations[0].init));
}

function isCapitalizedImportName(node, options) {
  return (0, (_StringUtils || _load_StringUtils()).isCapitalized)(normalizeModuleName(getModuleName(node), options));
}

function normalizedRequireSource(node, options) {
  return normalizeModuleName(tagPatternRequire(getModuleName(node.declarations[0].init), node), options);
}

function getModuleName(requireNode) {
  var rhs = requireNode;
  var names = [];
  while (true) {
    if ((_jscodeshift || _load_jscodeshift()).default.ImportDeclaration.check(rhs)) {
      return rhs.source.value;
    } else if ((_jscodeshift || _load_jscodeshift()).default.MemberExpression.check(rhs)) {
      names.unshift(rhs.property.name);
      rhs = rhs.object;
    } else if ((_jscodeshift || _load_jscodeshift()).default.CallExpression.check(rhs) && !(_jscodeshift || _load_jscodeshift()).default.Identifier.check(rhs.callee)) {
      rhs = rhs.callee;
    } else if ((_jscodeshift || _load_jscodeshift()).default.ExpressionStatement.check(rhs)) {
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
  var tag = (_jscodeshift || _load_jscodeshift()).default.Identifier.check(node.declarations[0].id) ? '' : '|PATTERN';
  return name + tag;
}

function isBareImport(importNode) {
  return importNode.specifiers.length === 0;
}

module.exports = formatRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvZm9ybWF0UmVxdWlyZXMuanMiXSwibmFtZXMiOlsiQ09ORklHIiwibm9kZVR5cGUiLCJJbXBvcnREZWNsYXJhdGlvbiIsImZpbHRlcnMiLCJwYXRoIiwiZ2V0U291cmNlIiwibm9kZSIsInNvdXJjZSIsInZhbHVlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE1vZHVsZU5hbWUiLCJleHByZXNzaW9uIiwiaXNCYXJlSW1wb3J0IiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24iLCJvcHRpb25zIiwiaXNDYXBpdGFsaXplZFJlcXVpcmVOYW1lIiwibm9ybWFsaXplZFJlcXVpcmVTb3VyY2UiLCJpc0NhcGl0YWxpemVkSW1wb3J0TmFtZSIsIm5vcm1hbGl6ZU1vZHVsZU5hbWUiLCJmb3JtYXRSZXF1aXJlcyIsInJvb3QiLCJmaXJzdCIsImdldCIsIl9maXJzdCIsIm5vZGVHcm91cHMiLCJtYXAiLCJwYXRocyIsImZpbmQiLCJjb25maWciLCJmaWx0ZXIiLCJldmVyeSIsIm5vZGVzIiwic2xpY2UiLCJmb3JFYWNoIiwicmVtb3ZlIiwic291cmNlR3JvdXBzIiwicHVzaCIsIk9iamVjdCIsImtleXMiLCJzb3J0Iiwic291cmNlMSIsInNvdXJjZTIiLCJwcm9ncmFtQm9keSIsImFsbE5vZGVzUmVtb3ZlZCIsImxlbmd0aCIsImFsbEdyb3VwcyIsInN0YXRlbWVudCIsImdyb3VwIiwibm9kZXNUb0luc2VydCIsImNvbmNhdCIsImluc2VydEJlZm9yZSIsImRlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb25zIiwiSWRlbnRpZmllciIsImNoZWNrIiwiaWQiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsInByb3AiLCJrZXkiLCJBcnJheVBhdHRlcm4iLCJlbGVtZW50cyIsImVsZW1lbnQiLCJpbml0IiwidGFnUGF0dGVyblJlcXVpcmUiLCJyZXF1aXJlTm9kZSIsInJocyIsIm5hbWVzIiwiTWVtYmVyRXhwcmVzc2lvbiIsInVuc2hpZnQiLCJwcm9wZXJ0eSIsIm5hbWUiLCJvYmplY3QiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImFyZ3VtZW50cyIsImpvaW4iLCJtb2R1bGVNYXAiLCJnZXRBbGlhcyIsInRhZyIsImltcG9ydE5vZGUiLCJzcGVjaWZpZXJzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQWFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztvTUF2QkE7Ozs7Ozs7Ozs7QUErQkE7QUFDQSxJQUFNQSxTQUE2QjtBQUNqQztBQUNBO0FBQ0VDLFlBQVUsOENBQUtDLGlCQURqQjtBQUVFQyxXQUFTLDBDQUFXO0FBQUEsV0FBUSxxREFBYUMsSUFBYixLQUFzQix5REFBZUEsSUFBZixDQUE5QjtBQUFBLEdBQVgsQ0FGWDtBQUdFQyxhQUFXO0FBQUEsV0FDVEMsS0FBS0MsTUFBTCxDQUFZQyxLQURIO0FBQUE7QUFIYixDQUZpQzs7QUFTakM7QUFDQTtBQUNFUCxZQUFVLDhDQUFLUSxtQkFEakI7QUFFRU4sV0FBUywwQ0FFUDtBQUFBLFdBQVEsbUVBQW9CQyxLQUFLRSxJQUF6QixDQUFSO0FBQUEsR0FGTyxDQUZYO0FBTUVELGFBQVc7QUFBQSxXQUNUSyxjQUFjSixLQUFLSyxVQUFuQixDQURTO0FBQUE7QUFOYixDQVZpQzs7QUFvQmpDO0FBQ0E7QUFDRVYsWUFBVSw4Q0FBS0MsaUJBRGpCO0FBRUVDLFdBQVMsQ0FBQztBQUFBLFdBQVFTLGFBQWFSLEtBQUtFLElBQWxCLENBQVI7QUFBQSxHQUFELENBRlg7QUFHRUQsYUFBVztBQUFBLFdBQ1RLLGNBQWNKLElBQWQsQ0FE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QUFoQixDQUFzQmpELEtBQUsrQyxZQUFMLENBQWtCLENBQWxCLEVBQXFCRyxFQUEzQyxJQUNOLEVBRE0sR0FFTixVQUZOO0FBR0EsU0FBT2dCLE9BQU9RLEdBQWQ7QUFDRDs7QUFFRCxTQUFTcEUsWUFBVCxDQUFzQnFFLFVBQXRCLEVBQWlEO0FBQy9DLFNBQU9BLFdBQVdDLFVBQVgsQ0FBc0JyQyxNQUF0QixLQUFpQyxDQUF4QztBQUNEOztBQUVEc0MsT0FBT0MsT0FBUCxHQUFpQmhFLGNBQWpCIiwiZmlsZSI6ImZvcm1hdFJlcXVpcmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBGaXJzdE5vZGUgZnJvbSAnLi4vdXRpbHMvRmlyc3ROb2RlJztcbmltcG9ydCBOZXdMaW5lIGZyb20gJy4uL3V0aWxzL05ld0xpbmUnO1xuaW1wb3J0IHtjb21wYXJlU3RyaW5nc0NhcGl0YWxzRmlyc3QsIGlzQ2FwaXRhbGl6ZWR9IGZyb20gJy4uL3V0aWxzL1N0cmluZ1V0aWxzJztcbmltcG9ydCBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydFxuICBmcm9tICcuLi91dGlscy9oYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydCc7XG5pbXBvcnQgaXNHbG9iYWwgZnJvbSAnLi4vdXRpbHMvaXNHbG9iYWwnO1xuaW1wb3J0IGlzUmVxdWlyZUV4cHJlc3Npb24gZnJvbSAnLi4vdXRpbHMvaXNSZXF1aXJlRXhwcmVzc2lvbic7XG5pbXBvcnQgaXNUeXBlSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVHlwZUltcG9ydCc7XG5pbXBvcnQgaXNUeXBlb2ZJbXBvcnQgZnJvbSAnLi4vdXRpbHMvaXNUeXBlb2ZJbXBvcnQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnLi4vdXRpbHMvanNjb2Rlc2hpZnQnO1xuaW1wb3J0IHJlcHJpbnRSZXF1aXJlIGZyb20gJy4uL3V0aWxzL3JlcHJpbnRSZXF1aXJlJztcblxudHlwZSBDb25maWdFbnRyeSA9IHtcbiAgbm9kZVR5cGU6IHN0cmluZyxcbiAgZmlsdGVyczogQXJyYXk8KHBhdGg6IE5vZGVQYXRoLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKSA9PiBib29sZWFuPixcbiAgZ2V0U291cmNlOiAobm9kZTogTm9kZSwgb3B0aW9uczogU291cmNlT3B0aW9ucykgPT4gc3RyaW5nLFxufTtcblxuLy8gU2V0IHVwIGEgY29uZmlnIHRvIGVhc2lseSBhZGQgcmVxdWlyZSBmb3JtYXRzXG5jb25zdCBDT05GSUc6IEFycmF5PENvbmZpZ0VudHJ5PiA9IFtcbiAgLy8gSGFuZGxlIHR5cGUgaW1wb3J0c1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuSW1wb3J0RGVjbGFyYXRpb24sXG4gICAgZmlsdGVyczogW2lzR2xvYmFsLCBwYXRoID0+IGlzVHlwZUltcG9ydChwYXRoKSB8fCBpc1R5cGVvZkltcG9ydChwYXRoKV0sXG4gICAgZ2V0U291cmNlOiBub2RlID0+XG4gICAgICBub2RlLnNvdXJjZS52YWx1ZSxcbiAgfSxcblxuICAvLyBIYW5kbGUgc2lkZSBlZmZlY3RmdWwgcmVxdWlyZXMsIGUuZzogYHJlcXVpcmUoJ21vbmtleS1wYXRjaGVzJyk7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudCxcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNSZXF1aXJlRXhwcmVzc2lvbihwYXRoLm5vZGUpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiBub2RlID0+XG4gICAgICBnZXRNb2R1bGVOYW1lKG5vZGUuZXhwcmVzc2lvbiksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIHNpZGUgZWZmZWN0ZnVsIGltcG9ydHMsIGUuZzogYGltcG9ydCAnbW9ua2V5LXBhdGNoZXMnO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtwYXRoID0+IGlzQmFyZUltcG9ydChwYXRoLm5vZGUpXSxcbiAgICBnZXRTb3VyY2U6IG5vZGUgPT5cbiAgICAgIGdldE1vZHVsZU5hbWUobm9kZSksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIFVwcGVyQ2FzZSByZXF1aXJlcywgZS5nOiBgY29uc3QgVXBwZXJDYXNlID0gcmVxdWlyZSgnVXBwZXJDYXNlJyk7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihwYXRoLm5vZGUpLFxuICAgICAgKHBhdGgsIG9wdGlvbnMpID0+IGlzQ2FwaXRhbGl6ZWRSZXF1aXJlTmFtZShwYXRoLm5vZGUsIG9wdGlvbnMpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiAobm9kZSwgb3B0aW9ucykgPT5cbiAgICAgIG5vcm1hbGl6ZWRSZXF1aXJlU291cmNlKG5vZGUsIG9wdGlvbnMpLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBVcHBlckNhc2UgaW1wb3J0cywgZS5nOiBgaW1wb3J0IFVwcGVyQ2FzZSBmcm9tICdVcHBlckNhc2UnO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIChwYXRoLCBvcHRpb25zKSA9PlxuICAgICAgICBpc0NhcGl0YWxpemVkSW1wb3J0TmFtZShwYXRoLm5vZGUsIG9wdGlvbnMpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiAobm9kZSwgb3B0aW9ucykgPT5cbiAgICAgIG5vcm1hbGl6ZU1vZHVsZU5hbWUoZ2V0TW9kdWxlTmFtZShub2RlKSwgb3B0aW9ucyksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIGxvd2VyQ2FzZSByZXF1aXJlcywgZS5nOiBgY29uc3QgbG93ZXJDYXNlID0gcmVxdWlyZSgnbG93ZXJDYXNlJyk7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICBpc0dsb2JhbCxcbiAgICAgIHBhdGggPT4gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihwYXRoLm5vZGUpLFxuICAgICAgKHBhdGgsIG9wdGlvbnMpID0+ICFpc0NhcGl0YWxpemVkUmVxdWlyZU5hbWUocGF0aC5ub2RlLCBvcHRpb25zKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogKG5vZGUsIG9wdGlvbnMpID0+XG4gICAgICBub3JtYWxpemVkUmVxdWlyZVNvdXJjZShub2RlLCBvcHRpb25zKSxcbiAgfSxcblxuICAvLyBIYW5kbGUgbG93ZXJDYXNlIGltcG9ydHMsIGUuZzogYGltcG9ydCBsb3dlckNhc2UgZnJvbSAnbG93ZXJDYXNlJztgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICAocGF0aCwgb3B0aW9ucykgPT5cbiAgICAgICAgIWlzQ2FwaXRhbGl6ZWRJbXBvcnROYW1lKHBhdGgubm9kZSwgb3B0aW9ucyksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IChub2RlLCBvcHRpb25zKSA9PlxuICAgICAgbm9ybWFsaXplTW9kdWxlTmFtZShnZXRNb2R1bGVOYW1lKG5vZGUpLCBvcHRpb25zKSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyBmb3JtYXRzIHJlcXVpcmVzIGJhc2VkIG9uIHRoZSByaWdodCBoYW5kIHNpZGUgb2YgdGhlIHJlcXVpcmUuXG4gKlxuICogVGhlIGdyb3VwcyBhcmU6XG4gKlxuICogICAtIGltcG9ydCB0eXBlczogaW1wb3J0IHR5cGUgRm9vIGZyb20gJ2FueXRoaW5nJztcbiAqICAgLSByZXF1aXJlIGV4cHJlc3Npb25zOiByZXF1aXJlKCdhbnl0aGluZycpO1xuICogICAtIGNhcGl0YWxpemVkIHJlcXVpcmVzOiB2YXIgRm9vID0gcmVxdWlyZSgnQW55dGhpbmcnKTtcbiAqICAgLSBub24tY2FwaXRhbGl6ZWQgcmVxdWlyZXM6IHZhciBmb28gPSByZXF1aXJlKCdhbnl0aGluZycpO1xuICpcbiAqIEFycmF5IGFuZCBvYmplY3QgZGVzdHJ1Y3R1cmVzIGFyZSBhbHNvIHZhbGlkIGxlZnQgaGFuZCBzaWRlcy4gT2JqZWN0IHBhdHRlcm5zXG4gKiBhcmUgc29ydGVkLlxuICovXG5mdW5jdGlvbiBmb3JtYXRSZXF1aXJlcyhyb290OiBDb2xsZWN0aW9uLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogdm9pZCB7XG4gIGNvbnN0IGZpcnN0ID0gRmlyc3ROb2RlLmdldChyb290KTtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBfZmlyc3QgPSBmaXJzdDsgLy8gRm9yIGZsb3cuXG4gIC8vIENyZWF0ZSBncm91cHMgb2YgcmVxdWlyZXMgZnJvbSBlYWNoIGNvbmZpZ1xuICBjb25zdCBub2RlR3JvdXBzID0gQ09ORklHLm1hcChjb25maWcgPT4ge1xuICAgIGNvbnN0IHBhdGhzID0gcm9vdFxuICAgICAgLmZpbmQoY29uZmlnLm5vZGVUeXBlKVxuICAgICAgLmZpbHRlcihwYXRoID0+IGNvbmZpZy5maWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXIocGF0aCwgb3B0aW9ucykpKTtcblxuICAgIC8vIFNhdmUgdGhlIHVuZGVybHlpbmcgbm9kZXMgYmVmb3JlIHJlbW92aW5nIHRoZSBwYXRoc1xuICAgIGNvbnN0IG5vZGVzID0gcGF0aHMubm9kZXMoKS5zbGljZSgpO1xuICAgIHBhdGhzLmZvckVhY2gocGF0aCA9PiBqc2NzKHBhdGgpLnJlbW92ZSgpKTtcbiAgICBjb25zdCBzb3VyY2VHcm91cHMgPSB7fTtcbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gY29uZmlnLmdldFNvdXJjZShub2RlLCBvcHRpb25zKTtcbiAgICAgIChzb3VyY2VHcm91cHNbc291cmNlXSA9IHNvdXJjZUdyb3Vwc1tzb3VyY2VdIHx8IFtdKS5wdXNoKG5vZGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2VHcm91cHMpXG4gICAgICAuc29ydCgoc291cmNlMSwgc291cmNlMikgPT4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0ZpcnN0KHNvdXJjZTEsIHNvdXJjZTIpKVxuICAgICAgLm1hcChzb3VyY2UgPT4gcmVwcmludFJlcXVpcmUoc291cmNlR3JvdXBzW3NvdXJjZV0pKTtcbiAgfSk7XG5cbiAgY29uc3QgcHJvZ3JhbUJvZHkgPSByb290LmdldCgncHJvZ3JhbScpLmdldCgnYm9keScpO1xuICBjb25zdCBhbGxOb2Rlc1JlbW92ZWQgPSBwcm9ncmFtQm9keS52YWx1ZS5sZW5ndGggPT09IDA7XG5cbiAgLy8gQnVpbGQgYWxsIHRoZSBub2RlcyB3ZSB3YW50IHRvIGluc2VydCwgdGhlbiBhZGQgdGhlbVxuICBjb25zdCBhbGxHcm91cHMgPSBbW05ld0xpbmUuc3RhdGVtZW50XV07XG4gIG5vZGVHcm91cHMuZm9yRWFjaChncm91cCA9PiBhbGxHcm91cHMucHVzaChncm91cCwgW05ld0xpbmUuc3RhdGVtZW50XSkpO1xuICBjb25zdCBub2Rlc1RvSW5zZXJ0ID0gW10uY29uY2F0KC4uLmFsbEdyb3Vwcyk7XG4gIGlmIChhbGxOb2Rlc1JlbW92ZWQpIHtcbiAgICBwcm9ncmFtQm9keS5wdXNoKC4uLm5vZGVzVG9JbnNlcnQpO1xuICB9IGVsc2Uge1xuICAgIF9maXJzdC5pbnNlcnRCZWZvcmUoLi4ubm9kZXNUb0luc2VydCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGlzIGEgdmFsaWQgcmVxdWlyZSBkZWNsYXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbihub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIGlmICghaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQobm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLmV2ZXJ5KFxuICAgICAgcHJvcCA9PiBqc2NzLklkZW50aWZpZXIuY2hlY2socHJvcC5rZXkpLFxuICAgICk7XG4gIH1cbiAgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5lbGVtZW50cy5ldmVyeShcbiAgICAgIGVsZW1lbnQgPT4ganNjcy5JZGVudGlmaWVyLmNoZWNrKGVsZW1lbnQpLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0NhcGl0YWxpemVkUmVxdWlyZU5hbWUobm9kZTogTm9kZSwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNDYXBpdGFsaXplZChnZXRNb2R1bGVOYW1lKG5vZGUuZGVjbGFyYXRpb25zWzBdLmluaXQpKTtcbn1cblxuZnVuY3Rpb24gaXNDYXBpdGFsaXplZEltcG9ydE5hbWUobm9kZTogTm9kZSwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNDYXBpdGFsaXplZChub3JtYWxpemVNb2R1bGVOYW1lKGdldE1vZHVsZU5hbWUobm9kZSksIG9wdGlvbnMpKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplZFJlcXVpcmVTb3VyY2Uobm9kZTogTm9kZSwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IHN0cmluZyB7XG4gIHJldHVybiBub3JtYWxpemVNb2R1bGVOYW1lKFxuICAgIHRhZ1BhdHRlcm5SZXF1aXJlKGdldE1vZHVsZU5hbWUobm9kZS5kZWNsYXJhdGlvbnNbMF0uaW5pdCksIG5vZGUpLFxuICAgIG9wdGlvbnMsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldE1vZHVsZU5hbWUocmVxdWlyZU5vZGU6IE5vZGUpOiBzdHJpbmcge1xuICBsZXQgcmhzID0gcmVxdWlyZU5vZGU7XG4gIGNvbnN0IG5hbWVzID0gW107XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKGpzY3MuSW1wb3J0RGVjbGFyYXRpb24uY2hlY2socmhzKSkge1xuICAgICAgcmV0dXJuIHJocy5zb3VyY2UudmFsdWU7XG4gICAgfSBlbHNlIGlmIChqc2NzLk1lbWJlckV4cHJlc3Npb24uY2hlY2socmhzKSkge1xuICAgICAgbmFtZXMudW5zaGlmdChyaHMucHJvcGVydHkubmFtZSk7XG4gICAgICByaHMgPSByaHMub2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBqc2NzLkNhbGxFeHByZXNzaW9uLmNoZWNrKHJocykgJiZcbiAgICAgICFqc2NzLklkZW50aWZpZXIuY2hlY2socmhzLmNhbGxlZSlcbiAgICApIHtcbiAgICAgIHJocyA9IHJocy5jYWxsZWU7XG4gICAgfSBlbHNlIGlmIChqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQuY2hlY2socmhzKSkge1xuICAgICAgcmhzID0gcmhzLmV4cHJlc3Npb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBuYW1lcy51bnNoaWZ0KHJocy5hcmd1bWVudHNbMF0udmFsdWUpO1xuICByZXR1cm4gbmFtZXMuam9pbignLicpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVNb2R1bGVOYW1lKG5hbWU6IHN0cmluZywgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IHN0cmluZyB7XG4gIHJldHVybiBvcHRpb25zLm1vZHVsZU1hcC5nZXRBbGlhcyhuYW1lKTtcbn1cblxuLy8gVGFnIHBhdHRlcm4gcmVxdWlyZXMgc28gdGhleSBhcmUgbm90IG1hbmdsZWQgYnkgbm9ybWFsIGlkIHJlcXVpcmVzLFxuLy8gYW5kIHRvIG1ha2UgdGhlIG9yZGVyaW5nIGRldGVybWluaXN0aWNcbmZ1bmN0aW9uIHRhZ1BhdHRlcm5SZXF1aXJlKG5hbWU6IHN0cmluZywgbm9kZTogTm9kZSk6IHN0cmluZyB7XG4gIGNvbnN0IHRhZyA9IGpzY3MuSWRlbnRpZmllci5jaGVjayhub2RlLmRlY2xhcmF0aW9uc1swXS5pZClcbiAgICAgID8gJydcbiAgICAgIDogJ3xQQVRURVJOJztcbiAgcmV0dXJuIG5hbWUgKyB0YWc7XG59XG5cbmZ1bmN0aW9uIGlzQmFyZUltcG9ydChpbXBvcnROb2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBpbXBvcnROb2RlLnNwZWNpZmllcnMubGVuZ3RoID09PSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFJlcXVpcmVzO1xuIl19