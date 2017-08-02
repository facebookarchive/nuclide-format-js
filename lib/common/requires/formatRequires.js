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
  filters: [_isGlobal2.default, _isTypeImport2.default],
  getSource: function getSource(node) {
    return node.source.value;
  }
},

// Handle typeof imports
{
  nodeType: _jscodeshift2.default.ImportDeclaration,
  filters: [_isGlobal2.default, _isTypeofImport2.default],
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
    return getDeclarationModuleName(node.expression);
  }
},

// Handle UpperCase requires, e.g: `const UpperCase = require('UpperCase');`
{
  nodeType: _jscodeshift2.default.VariableDeclaration,
  filters: [_isGlobal2.default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path) {
    return isCapitalizedModuleDeclaration(path.node);
  }],
  getSource: function getSource(node) {
    return getDeclarationModuleName(node.declarations[0].init);
  }
},

// Handle lowerCase requires, e.g: `const lowerCase = require('lowerCase');`
// and destructuring
{
  nodeType: _jscodeshift2.default.VariableDeclaration,
  filters: [_isGlobal2.default, function (path) {
    return isValidRequireDeclaration(path.node);
  }, function (path) {
    return !isCapitalizedModuleDeclaration(path.node);
  }],
  getSource: function getSource(node) {
    return getDeclarationModuleName(node.declarations[0].init);
  }
}];

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
function formatRequires(root) {
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
        return filter(path);
      });
    });

    // Save the underlying nodes before removing the paths
    var nodes = paths.nodes().slice();
    paths.forEach(function (path) {
      return (0, _jscodeshift2.default)(path).remove();
    });
    var sourceGroups = {};
    nodes.forEach(function (node) {
      var source = config.getSource(node);
      (sourceGroups[source] = sourceGroups[source] || []).push(node);
    });
    return Object.keys(sourceGroups).sort(function (source1, source2) {
      return (0, _StringUtils.compareStrings)(source1, source2);
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

function isCapitalizedModuleDeclaration(node) {
  var declaration = node.declarations[0];
  if (_jscodeshift2.default.Identifier.check(declaration.id)) {
    return (0, _StringUtils.isCapitalized)(declaration.id.name);
  }
  return false;
}

function getDeclarationModuleName(requireNode) {
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

module.exports = formatRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvZm9ybWF0UmVxdWlyZXMuanMiXSwibmFtZXMiOlsiQ09ORklHIiwibm9kZVR5cGUiLCJJbXBvcnREZWNsYXJhdGlvbiIsImZpbHRlcnMiLCJnZXRTb3VyY2UiLCJub2RlIiwic291cmNlIiwidmFsdWUiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwicGF0aCIsImdldERlY2xhcmF0aW9uTW9kdWxlTmFtZSIsImV4cHJlc3Npb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiaXNWYWxpZFJlcXVpcmVEZWNsYXJhdGlvbiIsImlzQ2FwaXRhbGl6ZWRNb2R1bGVEZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsImluaXQiLCJmb3JtYXRSZXF1aXJlcyIsInJvb3QiLCJmaXJzdCIsImdldCIsIl9maXJzdCIsIm5vZGVHcm91cHMiLCJtYXAiLCJwYXRocyIsImZpbmQiLCJjb25maWciLCJmaWx0ZXIiLCJldmVyeSIsIm5vZGVzIiwic2xpY2UiLCJmb3JFYWNoIiwicmVtb3ZlIiwic291cmNlR3JvdXBzIiwicHVzaCIsIk9iamVjdCIsImtleXMiLCJzb3J0Iiwic291cmNlMSIsInNvdXJjZTIiLCJwcm9ncmFtQm9keSIsImFsbE5vZGVzUmVtb3ZlZCIsImxlbmd0aCIsImFsbEdyb3VwcyIsInN0YXRlbWVudCIsImdyb3VwIiwibm9kZXNUb0luc2VydCIsImNvbmNhdCIsImluc2VydEJlZm9yZSIsImRlY2xhcmF0aW9uIiwiSWRlbnRpZmllciIsImNoZWNrIiwiaWQiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsInByb3AiLCJrZXkiLCJBcnJheVBhdHRlcm4iLCJlbGVtZW50cyIsImVsZW1lbnQiLCJuYW1lIiwicmVxdWlyZU5vZGUiLCJyaHMiLCJuYW1lcyIsIk1lbWJlckV4cHJlc3Npb24iLCJ1bnNoaWZ0IiwicHJvcGVydHkiLCJvYmplY3QiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImFyZ3VtZW50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Q0EsQ0FBQyxzQkFBS1osVUFBTCxDQUFnQkMsS0FBaEIsQ0FBc0JXLElBQUlPLE1BQTFCLENBRkksRUFHTDtBQUNBUCxZQUFNQSxJQUFJTyxNQUFWO0FBQ0QsS0FMTSxNQUtBLElBQUksc0JBQUs3RCxtQkFBTCxDQUF5QjJDLEtBQXpCLENBQStCVyxHQUEvQixDQUFKLEVBQXlDO0FBQzlDQSxZQUFNQSxJQUFJbkQsVUFBVjtBQUNELEtBRk0sTUFFQTtBQUNMO0FBQ0Q7QUFDRjtBQUNEb0QsUUFBTUUsT0FBTixDQUFjSCxJQUFJUSxTQUFKLENBQWMsQ0FBZCxFQUFpQi9ELEtBQS9CO0FBQ0EsU0FBT3dELE1BQU1RLElBQU4sQ0FBVyxHQUFYLENBQVA7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQnhELGNBQWpCIiwiZmlsZSI6ImZvcm1hdFJlcXVpcmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgRmlyc3ROb2RlIGZyb20gJy4uL3V0aWxzL0ZpcnN0Tm9kZSc7XG5pbXBvcnQgTmV3TGluZSBmcm9tICcuLi91dGlscy9OZXdMaW5lJztcbmltcG9ydCB7Y29tcGFyZVN0cmluZ3MsIGlzQ2FwaXRhbGl6ZWR9IGZyb20gJy4uL3V0aWxzL1N0cmluZ1V0aWxzJztcbmltcG9ydCBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24gZnJvbSAnLi4vdXRpbHMvaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uJztcbmltcG9ydCBpc0dsb2JhbCBmcm9tICcuLi91dGlscy9pc0dsb2JhbCc7XG5pbXBvcnQgaXNSZXF1aXJlRXhwcmVzc2lvbiBmcm9tICcuLi91dGlscy9pc1JlcXVpcmVFeHByZXNzaW9uJztcbmltcG9ydCBpc1R5cGVJbXBvcnQgZnJvbSAnLi4vdXRpbHMvaXNUeXBlSW1wb3J0JztcbmltcG9ydCBpc1R5cGVvZkltcG9ydCBmcm9tICcuLi91dGlscy9pc1R5cGVvZkltcG9ydCc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgcmVwcmludFJlcXVpcmUgZnJvbSAnLi4vdXRpbHMvcmVwcmludFJlcXVpcmUnO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBub2RlVHlwZTogc3RyaW5nLFxuICBmaWx0ZXJzOiBBcnJheTwocGF0aDogTm9kZVBhdGgpID0+IGJvb2xlYW4+LFxuICBnZXRTb3VyY2U6IChub2RlOiBOb2RlKSA9PiBzdHJpbmcsXG59O1xuXG4vLyBTZXQgdXAgYSBjb25maWcgdG8gZWFzaWx5IGFkZCByZXF1aXJlIGZvcm1hdHNcbmNvbnN0IENPTkZJRzogQXJyYXk8Q29uZmlnRW50cnk+ID0gW1xuICAvLyBIYW5kbGUgdHlwZSBpbXBvcnRzXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbaXNHbG9iYWwsIGlzVHlwZUltcG9ydF0sXG4gICAgZ2V0U291cmNlOiBub2RlID0+XG4gICAgICBub2RlLnNvdXJjZS52YWx1ZSxcbiAgfSxcblxuICAvLyBIYW5kbGUgdHlwZW9mIGltcG9ydHNcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtpc0dsb2JhbCwgaXNUeXBlb2ZJbXBvcnRdLFxuICAgIGdldFNvdXJjZTogbm9kZSA9PlxuICAgICAgbm9kZS5zb3VyY2UudmFsdWUsXG4gIH0sXG5cbiAgLy8gSGFuZGxlIHNpZGUgZWZmZWN0cywgZS5nOiBgcmVxdWlyZSgnbW9ua2V5LXBhdGNoZXMnKTtgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIGlzR2xvYmFsLFxuICAgICAgcGF0aCA9PiBpc1JlcXVpcmVFeHByZXNzaW9uKHBhdGgubm9kZSksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IG5vZGUgPT5cbiAgICAgIGdldERlY2xhcmF0aW9uTW9kdWxlTmFtZShub2RlLmV4cHJlc3Npb24pLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBVcHBlckNhc2UgcmVxdWlyZXMsIGUuZzogYGNvbnN0IFVwcGVyQ2FzZSA9IHJlcXVpcmUoJ1VwcGVyQ2FzZScpO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAgZmlsdGVyczogW1xuICAgICAgaXNHbG9iYWwsXG4gICAgICBwYXRoID0+IGlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24ocGF0aC5ub2RlKSxcbiAgICAgIHBhdGggPT4gaXNDYXBpdGFsaXplZE1vZHVsZURlY2xhcmF0aW9uKHBhdGgubm9kZSksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IG5vZGUgPT5cbiAgICAgIGdldERlY2xhcmF0aW9uTW9kdWxlTmFtZShub2RlLmRlY2xhcmF0aW9uc1swXS5pbml0KSxcbiAgfSxcblxuICAvLyBIYW5kbGUgbG93ZXJDYXNlIHJlcXVpcmVzLCBlLmc6IGBjb25zdCBsb3dlckNhc2UgPSByZXF1aXJlKCdsb3dlckNhc2UnKTtgXG4gIC8vIGFuZCBkZXN0cnVjdHVyaW5nXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtcbiAgICAgIGlzR2xvYmFsLFxuICAgICAgcGF0aCA9PiBpc1ZhbGlkUmVxdWlyZURlY2xhcmF0aW9uKHBhdGgubm9kZSksXG4gICAgICBwYXRoID0+ICFpc0NhcGl0YWxpemVkTW9kdWxlRGVjbGFyYXRpb24ocGF0aC5ub2RlKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogbm9kZSA9PlxuICAgICAgZ2V0RGVjbGFyYXRpb25Nb2R1bGVOYW1lKG5vZGUuZGVjbGFyYXRpb25zWzBdLmluaXQpLFxuICB9LFxuXTtcblxuLyoqXG4gKiBUaGlzIGZvcm1hdHMgcmVxdWlyZXMgYmFzZWQgb24gdGhlIGxlZnQgaGFuZCBzaWRlIG9mIHRoZSByZXF1aXJlLCB1bmxlc3MgaXRcbiAqIGlzIGEgc2ltcGxlIHJlcXVpcmUgZXhwcmVzc2lvbiBpbiB3aGljaCBjYXNlIHRoZXJlIGlzIG5vIGxlZnQgaGFuZCBzaWRlLlxuICpcbiAqIFRoZSBncm91cHMgYXJlOlxuICpcbiAqICAgLSBpbXBvcnQgdHlwZXM6IGltcG9ydCB0eXBlIEZvbyBmcm9tICdhbnl0aGluZyc7XG4gKiAgIC0gcmVxdWlyZSBleHByZXNzaW9uczogcmVxdWlyZSgnYW55dGhpbmcnKTtcbiAqICAgLSBjYXBpdGFsaXplZCByZXF1aXJlczogdmFyIEZvbyA9IHJlcXVpcmUoJ2FueXRoaW5nJyk7XG4gKiAgIC0gbm9uLWNhcGl0YWxpemVkIHJlcXVpcmVzOiB2YXIgZm9vID0gcmVxdWlyZSgnYW55dGhpbmcnKTtcbiAqXG4gKiBBcnJheSBhbmQgb2JqZWN0IGRlc3RydWN0dXJlcyBhcmUgYWxzbyB2YWxpZCBsZWZ0IGhhbmQgc2lkZXMuIE9iamVjdCBwYXR0ZXJuc1xuICogYXJlIHNvcnRlZCBhbmQgdGhlbiB0aGUgZmlyc3QgaWRlbnRpZmllciBpbiBlYWNoIG9mIHBhdHRlcm5zIGlzIHVzZWQgZm9yXG4gKiBzb3J0aW5nLlxuICovXG5mdW5jdGlvbiBmb3JtYXRSZXF1aXJlcyhyb290OiBDb2xsZWN0aW9uKTogdm9pZCB7XG4gIGNvbnN0IGZpcnN0ID0gRmlyc3ROb2RlLmdldChyb290KTtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBfZmlyc3QgPSBmaXJzdDsgLy8gRm9yIGZsb3cuXG4gIC8vIENyZWF0ZSBncm91cHMgb2YgcmVxdWlyZXMgZnJvbSBlYWNoIGNvbmZpZ1xuICBjb25zdCBub2RlR3JvdXBzID0gQ09ORklHLm1hcChjb25maWcgPT4ge1xuICAgIGNvbnN0IHBhdGhzID0gcm9vdFxuICAgICAgLmZpbmQoY29uZmlnLm5vZGVUeXBlKVxuICAgICAgLmZpbHRlcihwYXRoID0+IGNvbmZpZy5maWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXIocGF0aCkpKTtcblxuICAgIC8vIFNhdmUgdGhlIHVuZGVybHlpbmcgbm9kZXMgYmVmb3JlIHJlbW92aW5nIHRoZSBwYXRoc1xuICAgIGNvbnN0IG5vZGVzID0gcGF0aHMubm9kZXMoKS5zbGljZSgpO1xuICAgIHBhdGhzLmZvckVhY2gocGF0aCA9PiBqc2NzKHBhdGgpLnJlbW92ZSgpKTtcbiAgICBjb25zdCBzb3VyY2VHcm91cHMgPSB7fTtcbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gY29uZmlnLmdldFNvdXJjZShub2RlKTtcbiAgICAgIChzb3VyY2VHcm91cHNbc291cmNlXSA9IHNvdXJjZUdyb3Vwc1tzb3VyY2VdIHx8IFtdKS5wdXNoKG5vZGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2VHcm91cHMpXG4gICAgICAuc29ydCgoc291cmNlMSwgc291cmNlMikgPT4gY29tcGFyZVN0cmluZ3Moc291cmNlMSwgc291cmNlMikpXG4gICAgICAubWFwKHNvdXJjZSA9PiByZXByaW50UmVxdWlyZShzb3VyY2VHcm91cHNbc291cmNlXSkpO1xuICB9KTtcblxuICBjb25zdCBwcm9ncmFtQm9keSA9IHJvb3QuZ2V0KCdwcm9ncmFtJykuZ2V0KCdib2R5Jyk7XG4gIGNvbnN0IGFsbE5vZGVzUmVtb3ZlZCA9IHByb2dyYW1Cb2R5LnZhbHVlLmxlbmd0aCA9PT0gMDtcblxuICAvLyBCdWlsZCBhbGwgdGhlIG5vZGVzIHdlIHdhbnQgdG8gaW5zZXJ0LCB0aGVuIGFkZCB0aGVtXG4gIGNvbnN0IGFsbEdyb3VwcyA9IFtbTmV3TGluZS5zdGF0ZW1lbnRdXTtcbiAgbm9kZUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGFsbEdyb3Vwcy5wdXNoKGdyb3VwLCBbTmV3TGluZS5zdGF0ZW1lbnRdKSk7XG4gIGNvbnN0IG5vZGVzVG9JbnNlcnQgPSBbXS5jb25jYXQoLi4uYWxsR3JvdXBzKTtcbiAgaWYgKGFsbE5vZGVzUmVtb3ZlZCkge1xuICAgIHByb2dyYW1Cb2R5LnB1c2goLi4ubm9kZXNUb0luc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgX2ZpcnN0Lmluc2VydEJlZm9yZSguLi5ub2Rlc1RvSW5zZXJ0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgdmFyaWFibGUgZGVjbGFyYXRpb24gaXMgYSB2YWxpZCByZXF1aXJlIGRlY2xhcmF0aW9uLlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkUmVxdWlyZURlY2xhcmF0aW9uKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgaWYgKCFoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLmV2ZXJ5KFxuICAgICAgcHJvcCA9PiBqc2NzLklkZW50aWZpZXIuY2hlY2socHJvcC5rZXkpLFxuICAgICk7XG4gIH1cbiAgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbi5pZC5lbGVtZW50cy5ldmVyeShcbiAgICAgIGVsZW1lbnQgPT4ganNjcy5JZGVudGlmaWVyLmNoZWNrKGVsZW1lbnQpLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0NhcGl0YWxpemVkTW9kdWxlRGVjbGFyYXRpb24obm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICBjb25zdCBkZWNsYXJhdGlvbiA9IG5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICBpZiAoanNjcy5JZGVudGlmaWVyLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgIHJldHVybiBpc0NhcGl0YWxpemVkKGRlY2xhcmF0aW9uLmlkLm5hbWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25Nb2R1bGVOYW1lKHJlcXVpcmVOb2RlOiBOb2RlKTogc3RyaW5nIHtcbiAgbGV0IHJocyA9IHJlcXVpcmVOb2RlO1xuICBjb25zdCBuYW1lcyA9IFtdO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChqc2NzLk1lbWJlckV4cHJlc3Npb24uY2hlY2socmhzKSkge1xuICAgICAgbmFtZXMudW5zaGlmdChyaHMucHJvcGVydHkubmFtZSk7XG4gICAgICByaHMgPSByaHMub2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBqc2NzLkNhbGxFeHByZXNzaW9uLmNoZWNrKHJocykgJiZcbiAgICAgICFqc2NzLklkZW50aWZpZXIuY2hlY2socmhzLmNhbGxlZSlcbiAgICApIHtcbiAgICAgIHJocyA9IHJocy5jYWxsZWU7XG4gICAgfSBlbHNlIGlmIChqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQuY2hlY2socmhzKSkge1xuICAgICAgcmhzID0gcmhzLmV4cHJlc3Npb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBuYW1lcy51bnNoaWZ0KHJocy5hcmd1bWVudHNbMF0udmFsdWUpO1xuICByZXR1cm4gbmFtZXMuam9pbignLicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFJlcXVpcmVzO1xuIl19