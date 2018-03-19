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
  var rawName = getModuleName(node.declarations[0].init);
  return (0, (_StringUtils || _load_StringUtils()).isCapitalized)(normalizeModuleName(rawName, options));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvZm9ybWF0UmVxdWlyZXMuanMiXSwibmFtZXMiOlsiQ09ORklHIiwibm9kZVR5cGUiLCJJbXBvcnREZWNsYXJhdGlvbiIsImZpbHRlcnMiLCJwYXRoIiwiZ2V0U291cmNlIiwibm9kZSIsInNvdXJjZSIsInZhbHVlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE1vZHVsZU5hbWUiLCJleHByZXNzaW9uIiwiaXNCYXJlSW1wb3J0IiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24iLCJvcHRpb25zIiwiaXNDYXBpdGFsaXplZFJlcXVpcmVOYW1lIiwibm9ybWFsaXplZFJlcXVpcmVTb3VyY2UiLCJpc0NhcGl0YWxpemVkSW1wb3J0TmFtZSIsIm5vcm1hbGl6ZU1vZHVsZU5hbWUiLCJmb3JtYXRSZXF1aXJlcyIsInJvb3QiLCJmaXJzdCIsImdldCIsIl9maXJzdCIsIm5vZGVHcm91cHMiLCJtYXAiLCJwYXRocyIsImZpbmQiLCJjb25maWciLCJmaWx0ZXIiLCJldmVyeSIsIm5vZGVzIiwic2xpY2UiLCJmb3JFYWNoIiwicmVtb3ZlIiwic291cmNlR3JvdXBzIiwicHVzaCIsIk9iamVjdCIsImtleXMiLCJzb3J0Iiwic291cmNlMSIsInNvdXJjZTIiLCJwcm9ncmFtQm9keSIsImFsbE5vZGVzUmVtb3ZlZCIsImxlbmd0aCIsImFsbEdyb3VwcyIsInN0YXRlbWVudCIsImdyb3VwIiwibm9kZXNUb0luc2VydCIsImNvbmNhdCIsImluc2VydEJlZm9yZSIsImRlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb25zIiwiSWRlbnRpZmllciIsImNoZWNrIiwiaWQiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsInByb3AiLCJrZXkiLCJBcnJheVBhdHRlcm4iLCJlbGVtZW50cyIsImVsZW1lbnQiLCJyYXdOYW1lIiwiaW5pdCIsInRhZ1BhdHRlcm5SZXF1aXJlIiwicmVxdWlyZU5vZGUiLCJyaHMiLCJuYW1lcyIsIk1lbWJlckV4cHJlc3Npb24iLCJ1bnNoaWZ0IiwicHJvcGVydHkiLCJuYW1lIiwib2JqZWN0IiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJqb2luIiwibW9kdWxlTWFwIiwiZ2V0QWxpYXMiLCJ0YWciLCJpbXBvcnROb2RlIiwic3BlY2lmaWVycyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7b01BdkJBOzs7Ozs7Ozs7O0FBK0JBO0FBQ0EsSUFBTUEsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLDhDQUFLQyxpQkFEakI7QUFFRUMsV0FBUywwQ0FBVztBQUFBLFdBQVEscURBQWFDLElBQWIsS0FBc0IseURBQWVBLElBQWYsQ0FBOUI7QUFBQSxHQUFYLENBRlg7QUFHRUMsYUFBVztBQUFBLFdBQ1RDLEtBQUtDLE1BQUwsQ0FBWUMsS0FESDtBQUFBO0FBSGIsQ0FGaUM7O0FBU2pDO0FBQ0E7QUFDRVAsWUFBVSw4Q0FBS1EsbUJBRGpCO0FBRUVOLFdBQVMsMENBRVA7QUFBQSxXQUFRLG1FQUFvQkMsS0FBS0UsSUFBekIsQ0FBUjtBQUFBLEdBRk8sQ0FGWDtBQU1FRCxhQUFXO0FBQUEsV0FDVEssY0FBY0osS0FBS0ssVUFBbkIsQ0FEUztBQUFBO0FBTmIsQ0FWaUM7O0FBb0JqQztBQUNBO0FBQ0VWLFlBQVUsOENBQUtDLGlCQURqQjtBQUVFQyxXQUFTLENBQUM7QUFBQSxXQUFRUyxhQUFhUixLQUFLRSxJQUFsQixDQUFSO0FBQUEsR0FBRCxDQUZYO0FBR0VELGFBQVc7QUFBQSxXQUNUSyxjQUFj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QUEzQixFQUF5Q25FLElBQXpDLEVBQTZEO0FBQzNELE1BQU0yRSxNQUFNLDhDQUFLM0IsVUFBTCxDQUFnQkMsS0FBaEIsQ0FBc0JqRCxLQUFLK0MsWUFBTCxDQUFrQixDQUFsQixFQUFxQkcsRUFBM0MsSUFDTixFQURNLEdBRU4sVUFGTjtBQUdBLFNBQU9pQixPQUFPUSxHQUFkO0FBQ0Q7O0FBRUQsU0FBU3JFLFlBQVQsQ0FBc0JzRSxVQUF0QixFQUFpRDtBQUMvQyxTQUFPQSxXQUFXQyxVQUFYLENBQXNCdEMsTUFBdEIsS0FBaUMsQ0FBeEM7QUFDRDs7QUFFRHVDLE9BQU9DLE9BQVAsR0FBaUJqRSxjQUFqQiIsImZpbGUiOiJmb3JtYXRSZXF1aXJlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9uLCBOb2RlLCBOb2RlUGF0aH0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgRmlyc3ROb2RlIGZyb20gJy4uL3V0aWxzL0ZpcnN0Tm9kZSc7XG5pbXBvcnQgTmV3TGluZSBmcm9tICcuLi91dGlscy9OZXdMaW5lJztcbmltcG9ydCB7Y29tcGFyZVN0cmluZ3NDYXBpdGFsc0ZpcnN0LCBpc0NhcGl0YWxpemVkfSBmcm9tICcuLi91dGlscy9TdHJpbmdVdGlscyc7XG5pbXBvcnQgaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnRcbiAgZnJvbSAnLi4vdXRpbHMvaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQnO1xuaW1wb3J0IGlzR2xvYmFsIGZyb20gJy4uL3V0aWxzL2lzR2xvYmFsJztcbmltcG9ydCBpc1JlcXVpcmVFeHByZXNzaW9uIGZyb20gJy4uL3V0aWxzL2lzUmVxdWlyZUV4cHJlc3Npb24nO1xuaW1wb3J0IGlzVHlwZUltcG9ydCBmcm9tICcuLi91dGlscy9pc1R5cGVJbXBvcnQnO1xuaW1wb3J0IGlzVHlwZW9mSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVHlwZW9mSW1wb3J0JztcbmltcG9ydCBqc2NzIGZyb20gJy4uL3V0aWxzL2pzY29kZXNoaWZ0JztcbmltcG9ydCByZXByaW50UmVxdWlyZSBmcm9tICcuLi91dGlscy9yZXByaW50UmVxdWlyZSc7XG5cbnR5cGUgQ29uZmlnRW50cnkgPSB7XG4gIG5vZGVUeXBlOiBzdHJpbmcsXG4gIGZpbHRlcnM6IEFycmF5PChwYXRoOiBOb2RlUGF0aCwgb3B0aW9uczogU291cmNlT3B0aW9ucykgPT4gYm9vbGVhbj4sXG4gIGdldFNvdXJjZTogKG5vZGU6IE5vZGUsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpID0+IHN0cmluZyxcbn07XG5cbi8vIFNldCB1cCBhIGNvbmZpZyB0byBlYXNpbHkgYWRkIHJlcXVpcmUgZm9ybWF0c1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIEhhbmRsZSB0eXBlIGltcG9ydHNcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtpc0dsb2JhbCwgcGF0aCA9PiBpc1R5cGVJbXBvcnQocGF0aCkgfHwgaXNUeXBlb2ZJbXBvcnQocGF0aCldLFxuICAgIGdldFNvdXJjZTogbm9kZSA9PlxuICAgICAgbm9kZS5zb3VyY2UudmFsdWUsXG4gIH0sXG5cbiAgLy8gSGFuZGxlIHNpZGUgZWZmZWN0ZnVsIHJlcXVpcmVzLCBlLmc6IGByZXF1aXJlKCdtb25rZXktcGF0Y2hlcycpO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gICAgZmlsdGVyczogW1xuICAgICAgaXNHbG9iYWwsXG4gICAgICBwYXRoID0+IGlzUmVxdWlyZUV4cHJlc3Npb24ocGF0aC5ub2RlKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogbm9kZSA9PlxuICAgICAgZ2V0TW9kdWxlTmFtZShub2RlLmV4cHJlc3Npb24pLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBzaWRlIGVmZmVjdGZ1bCBpbXBvcnRzLCBlLmc6IGBpbXBvcnQgJ21vbmtleS1wYXRjaGVzJztgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbcGF0aCA9PiBpc0JhcmVJbXBvcnQocGF0aC5ub2RlKV0sXG4gICAgZ2V0U291cmNlOiBub2RlID0+XG4gICAgICBnZXRNb2R1bGVOYW1lKG5vZGUpLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBVcHBlckNhc2UgcmVxdWlyZXMsIGUuZzogYGNvbnN0IFVwcGVyQ2FzZSA9IHJlcXVpcmUoJ1VwcGVyQ2FzZScpO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAgZmlsdGVyczogW1xuICAgICAgaXNHbG9iYWwsXG4gICAgICBwYXRoID0+IGlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24ocGF0aC5ub2RlKSxcbiAgICAgIChwYXRoLCBvcHRpb25zKSA9PiBpc0NhcGl0YWxpemVkUmVxdWlyZU5hbWUocGF0aC5ub2RlLCBvcHRpb25zKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogKG5vZGUsIG9wdGlvbnMpID0+XG4gICAgICBub3JtYWxpemVkUmVxdWlyZVNvdXJjZShub2RlLCBvcHRpb25zKSxcbiAgfSxcblxuICAvLyBIYW5kbGUgVXBwZXJDYXNlIGltcG9ydHMsIGUuZzogYGltcG9ydCBVcHBlckNhc2UgZnJvbSAnVXBwZXJDYXNlJztgXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbXG4gICAgICAocGF0aCwgb3B0aW9ucykgPT5cbiAgICAgICAgaXNDYXBpdGFsaXplZEltcG9ydE5hbWUocGF0aC5ub2RlLCBvcHRpb25zKSxcbiAgICBdLFxuICAgIGdldFNvdXJjZTogKG5vZGUsIG9wdGlvbnMpID0+XG4gICAgICBub3JtYWxpemVNb2R1bGVOYW1lKGdldE1vZHVsZU5hbWUobm9kZSksIG9wdGlvbnMpLFxuICB9LFxuXG4gIC8vIEhhbmRsZSBsb3dlckNhc2UgcmVxdWlyZXMsIGUuZzogYGNvbnN0IGxvd2VyQ2FzZSA9IHJlcXVpcmUoJ2xvd2VyQ2FzZScpO2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAgZmlsdGVyczogW1xuICAgICAgaXNHbG9iYWwsXG4gICAgICBwYXRoID0+IGlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24ocGF0aC5ub2RlKSxcbiAgICAgIChwYXRoLCBvcHRpb25zKSA9PiAhaXNDYXBpdGFsaXplZFJlcXVpcmVOYW1lKHBhdGgubm9kZSwgb3B0aW9ucyksXG4gICAgXSxcbiAgICBnZXRTb3VyY2U6IChub2RlLCBvcHRpb25zKSA9PlxuICAgICAgbm9ybWFsaXplZFJlcXVpcmVTb3VyY2Uobm9kZSwgb3B0aW9ucyksXG4gIH0sXG5cbiAgLy8gSGFuZGxlIGxvd2VyQ2FzZSBpbXBvcnRzLCBlLmc6IGBpbXBvcnQgbG93ZXJDYXNlIGZyb20gJ2xvd2VyQ2FzZSc7YFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuSW1wb3J0RGVjbGFyYXRpb24sXG4gICAgZmlsdGVyczogW1xuICAgICAgKHBhdGgsIG9wdGlvbnMpID0+XG4gICAgICAgICFpc0NhcGl0YWxpemVkSW1wb3J0TmFtZShwYXRoLm5vZGUsIG9wdGlvbnMpLFxuICAgIF0sXG4gICAgZ2V0U291cmNlOiAobm9kZSwgb3B0aW9ucykgPT5cbiAgICAgIG5vcm1hbGl6ZU1vZHVsZU5hbWUoZ2V0TW9kdWxlTmFtZShub2RlKSwgb3B0aW9ucyksXG4gIH0sXG5dO1xuXG4vKipcbiAqIFRoaXMgZm9ybWF0cyByZXF1aXJlcyBiYXNlZCBvbiB0aGUgcmlnaHQgaGFuZCBzaWRlIG9mIHRoZSByZXF1aXJlLlxuICpcbiAqIFRoZSBncm91cHMgYXJlOlxuICpcbiAqICAgLSBpbXBvcnQgdHlwZXM6IGltcG9ydCB0eXBlIEZvbyBmcm9tICdhbnl0aGluZyc7XG4gKiAgIC0gcmVxdWlyZSBleHByZXNzaW9uczogcmVxdWlyZSgnYW55dGhpbmcnKTtcbiAqICAgLSBjYXBpdGFsaXplZCByZXF1aXJlczogdmFyIEZvbyA9IHJlcXVpcmUoJ0FueXRoaW5nJyk7XG4gKiAgIC0gbm9uLWNhcGl0YWxpemVkIHJlcXVpcmVzOiB2YXIgZm9vID0gcmVxdWlyZSgnYW55dGhpbmcnKTtcbiAqXG4gKiBBcnJheSBhbmQgb2JqZWN0IGRlc3RydWN0dXJlcyBhcmUgYWxzbyB2YWxpZCBsZWZ0IGhhbmQgc2lkZXMuIE9iamVjdCBwYXR0ZXJuc1xuICogYXJlIHNvcnRlZC5cbiAqL1xuZnVuY3Rpb24gZm9ybWF0UmVxdWlyZXMocm9vdDogQ29sbGVjdGlvbiwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IHZvaWQge1xuICBjb25zdCBmaXJzdCA9IEZpcnN0Tm9kZS5nZXQocm9vdCk7XG4gIGlmICghZmlyc3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgX2ZpcnN0ID0gZmlyc3Q7IC8vIEZvciBmbG93LlxuICAvLyBDcmVhdGUgZ3JvdXBzIG9mIHJlcXVpcmVzIGZyb20gZWFjaCBjb25maWdcbiAgY29uc3Qgbm9kZUdyb3VwcyA9IENPTkZJRy5tYXAoY29uZmlnID0+IHtcbiAgICBjb25zdCBwYXRocyA9IHJvb3RcbiAgICAgIC5maW5kKGNvbmZpZy5ub2RlVHlwZSlcbiAgICAgIC5maWx0ZXIocGF0aCA9PiBjb25maWcuZmlsdGVycy5ldmVyeShmaWx0ZXIgPT4gZmlsdGVyKHBhdGgsIG9wdGlvbnMpKSk7XG5cbiAgICAvLyBTYXZlIHRoZSB1bmRlcmx5aW5nIG5vZGVzIGJlZm9yZSByZW1vdmluZyB0aGUgcGF0aHNcbiAgICBjb25zdCBub2RlcyA9IHBhdGhzLm5vZGVzKCkuc2xpY2UoKTtcbiAgICBwYXRocy5mb3JFYWNoKHBhdGggPT4ganNjcyhwYXRoKS5yZW1vdmUoKSk7XG4gICAgY29uc3Qgc291cmNlR3JvdXBzID0ge307XG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IGNvbmZpZy5nZXRTb3VyY2Uobm9kZSwgb3B0aW9ucyk7XG4gICAgICAoc291cmNlR3JvdXBzW3NvdXJjZV0gPSBzb3VyY2VHcm91cHNbc291cmNlXSB8fCBbXSkucHVzaChub2RlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlR3JvdXBzKVxuICAgICAgLnNvcnQoKHNvdXJjZTEsIHNvdXJjZTIpID0+IGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNGaXJzdChzb3VyY2UxLCBzb3VyY2UyKSlcbiAgICAgIC5tYXAoc291cmNlID0+IHJlcHJpbnRSZXF1aXJlKHNvdXJjZUdyb3Vwc1tzb3VyY2VdKSk7XG4gIH0pO1xuXG4gIGNvbnN0IHByb2dyYW1Cb2R5ID0gcm9vdC5nZXQoJ3Byb2dyYW0nKS5nZXQoJ2JvZHknKTtcbiAgY29uc3QgYWxsTm9kZXNSZW1vdmVkID0gcHJvZ3JhbUJvZHkudmFsdWUubGVuZ3RoID09PSAwO1xuXG4gIC8vIEJ1aWxkIGFsbCB0aGUgbm9kZXMgd2Ugd2FudCB0byBpbnNlcnQsIHRoZW4gYWRkIHRoZW1cbiAgY29uc3QgYWxsR3JvdXBzID0gW1tOZXdMaW5lLnN0YXRlbWVudF1dO1xuICBub2RlR3JvdXBzLmZvckVhY2goZ3JvdXAgPT4gYWxsR3JvdXBzLnB1c2goZ3JvdXAsIFtOZXdMaW5lLnN0YXRlbWVudF0pKTtcbiAgY29uc3Qgbm9kZXNUb0luc2VydCA9IFtdLmNvbmNhdCguLi5hbGxHcm91cHMpO1xuICBpZiAoYWxsTm9kZXNSZW1vdmVkKSB7XG4gICAgcHJvZ3JhbUJvZHkucHVzaCguLi5ub2Rlc1RvSW5zZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICBfZmlyc3QuaW5zZXJ0QmVmb3JlKC4uLm5vZGVzVG9JbnNlcnQpO1xuICB9XG59XG5cbi8qKlxuICogVGVzdHMgaWYgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBpcyBhIHZhbGlkIHJlcXVpcmUgZGVjbGFyYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRSZXF1aXJlRGVjbGFyYXRpb24obm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICBpZiAoIWhhc09uZVJlcXVpcmVEZWNsYXJhdGlvbk9yTW9kdWxlSW1wb3J0KG5vZGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGpzY3MuT2JqZWN0UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5ldmVyeShcbiAgICAgIHByb3AgPT4ganNjcy5JZGVudGlmaWVyLmNoZWNrKHByb3Aua2V5KSxcbiAgICApO1xuICB9XG4gIGlmIChqc2NzLkFycmF5UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICByZXR1cm4gZGVjbGFyYXRpb24uaWQuZWxlbWVudHMuZXZlcnkoXG4gICAgICBlbGVtZW50ID0+IGpzY3MuSWRlbnRpZmllci5jaGVjayhlbGVtZW50KSxcbiAgICApO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNDYXBpdGFsaXplZFJlcXVpcmVOYW1lKG5vZGU6IE5vZGUsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiBib29sZWFuIHtcbiAgY29uc3QgcmF3TmFtZSA9IGdldE1vZHVsZU5hbWUobm9kZS5kZWNsYXJhdGlvbnNbMF0uaW5pdCk7XG4gIHJldHVybiBpc0NhcGl0YWxpemVkKG5vcm1hbGl6ZU1vZHVsZU5hbWUocmF3TmFtZSwgb3B0aW9ucykpO1xufVxuXG5mdW5jdGlvbiBpc0NhcGl0YWxpemVkSW1wb3J0TmFtZShub2RlOiBOb2RlLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0NhcGl0YWxpemVkKG5vcm1hbGl6ZU1vZHVsZU5hbWUoZ2V0TW9kdWxlTmFtZShub2RlKSwgb3B0aW9ucykpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVkUmVxdWlyZVNvdXJjZShub2RlOiBOb2RlLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZU1vZHVsZU5hbWUoXG4gICAgdGFnUGF0dGVyblJlcXVpcmUoZ2V0TW9kdWxlTmFtZShub2RlLmRlY2xhcmF0aW9uc1swXS5pbml0KSwgbm9kZSksXG4gICAgb3B0aW9ucyxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZShyZXF1aXJlTm9kZTogTm9kZSk6IHN0cmluZyB7XG4gIGxldCByaHMgPSByZXF1aXJlTm9kZTtcbiAgY29uc3QgbmFtZXMgPSBbXTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAoanNjcy5JbXBvcnREZWNsYXJhdGlvbi5jaGVjayhyaHMpKSB7XG4gICAgICByZXR1cm4gcmhzLnNvdXJjZS52YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuTWVtYmVyRXhwcmVzc2lvbi5jaGVjayhyaHMpKSB7XG4gICAgICBuYW1lcy51bnNoaWZ0KHJocy5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgIHJocyA9IHJocy5vYmplY3Q7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGpzY3MuQ2FsbEV4cHJlc3Npb24uY2hlY2socmhzKSAmJlxuICAgICAgIWpzY3MuSWRlbnRpZmllci5jaGVjayhyaHMuY2FsbGVlKVxuICAgICkge1xuICAgICAgcmhzID0gcmhzLmNhbGxlZTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudC5jaGVjayhyaHMpKSB7XG4gICAgICByaHMgPSByaHMuZXhwcmVzc2lvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIG5hbWVzLnVuc2hpZnQocmhzLmFyZ3VtZW50c1swXS52YWx1ZSk7XG4gIHJldHVybiBuYW1lcy5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1vZHVsZU5hbWUobmFtZTogc3RyaW5nLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9wdGlvbnMubW9kdWxlTWFwLmdldEFsaWFzKG5hbWUpO1xufVxuXG4vLyBUYWcgcGF0dGVybiByZXF1aXJlcyBzbyB0aGV5IGFyZSBub3QgbWFuZ2xlZCBieSBub3JtYWwgaWQgcmVxdWlyZXMsXG4vLyBhbmQgdG8gbWFrZSB0aGUgb3JkZXJpbmcgZGV0ZXJtaW5pc3RpY1xuZnVuY3Rpb24gdGFnUGF0dGVyblJlcXVpcmUobmFtZTogc3RyaW5nLCBub2RlOiBOb2RlKTogc3RyaW5nIHtcbiAgY29uc3QgdGFnID0ganNjcy5JZGVudGlmaWVyLmNoZWNrKG5vZGUuZGVjbGFyYXRpb25zWzBdLmlkKVxuICAgICAgPyAnJ1xuICAgICAgOiAnfFBBVFRFUk4nO1xuICByZXR1cm4gbmFtZSArIHRhZztcbn1cblxuZnVuY3Rpb24gaXNCYXJlSW1wb3J0KGltcG9ydE5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIGltcG9ydE5vZGUuc3BlY2lmaWVycy5sZW5ndGggPT09IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0UmVxdWlyZXM7XG4iXX0=