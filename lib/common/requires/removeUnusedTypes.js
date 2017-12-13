'use strict';

var _getDeclaredIdentifiers;

function _load_getDeclaredIdentifiers() {
  return _getDeclaredIdentifiers = _interopRequireDefault(require('../utils/getDeclaredIdentifiers'));
}

var _getDeclaredTypes;

function _load_getDeclaredTypes() {
  return _getDeclaredTypes = _interopRequireDefault(require('../utils/getDeclaredTypes'));
}

var _getNonDeclarationTypes;

function _load_getNonDeclarationTypes() {
  return _getNonDeclarationTypes = _interopRequireDefault(require('../utils/getNonDeclarationTypes'));
}

var _isGlobal;

function _load_isGlobal() {
  return _isGlobal = _interopRequireDefault(require('../utils/isGlobal'));
}

var _isTypeImport;

function _load_isTypeImport() {
  return _isTypeImport = _interopRequireDefault(require('../utils/isTypeImport'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

var match = (_jscodeshift || _load_jscodeshift()).default.match;

// These are the things we should try to remove.
var CONFIG = [
// import type Foo from 'Foo';
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  filters: [(_isGlobal || _load_isGlobal()).default, (_isTypeImport || _load_isTypeImport()).default],
  getNames: function getNames(node) {
    return node.specifiers.map(function (specifier) {
      return specifier.local.name;
    });
  }
}, {
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportSpecifier,
  filters: [function (path) {
    return (0, (_isGlobal || _load_isGlobal()).default)(path.parent) && (0, (_isTypeImport || _load_isTypeImport()).default)(path.parent);
  }],
  getNames: function getNames(node) {
    return [node.local.name];
  }
}];

function removeUnusedTypes(root, options) {
  var declared = (0, (_getDeclaredIdentifiers || _load_getDeclaredIdentifiers()).default)(root, options);
  var used = (0, (_getNonDeclarationTypes || _load_getNonDeclarationTypes()).default)(root);
  var nonTypeImport = (0, (_getDeclaredTypes || _load_getDeclaredTypes()).default)(root, options, [function (path) {
    return !isTypeImportDeclaration(path.node);
  }]);
  // Remove things based on the config.
  CONFIG.forEach(function (config) {
    root.find(config.nodeType).filter(function (path) {
      return config.filters.every(function (filter) {
        return filter(path);
      });
    }).filter(function (path) {
      return config.getNames(path.node).every(function (name) {
        return !used.has(name) || declared.has(name) || nonTypeImport.has(name);
      });
    }).map(function (x) {
      console.log(x);
      return x;
    }).remove();
  });
}

function isTypeImportDeclaration(node) {
  return match(node, {
    type: 'ImportDeclaration',
    importKind: 'type'
  });
}

module.exports = removeUnusedTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvcmVtb3ZlVW51c2VkVHlwZXMuanMiXSwibmFtZXMiOlsibWF0Y2giLCJDT05GSUciLCJub2RlVHlwZSIsIkltcG9ydERlY2xhcmF0aW9uIiwiZmlsdGVycyIsImdldE5hbWVzIiwibm9kZSIsInNwZWNpZmllcnMiLCJtYXAiLCJzcGVjaWZpZXIiLCJsb2NhbCIsIm5hbWUiLCJJbXBvcnRTcGVjaWZpZXIiLCJwYXRoIiwicGFyZW50IiwicmVtb3ZlVW51c2VkVHlwZXMiLCJyb290Iiwib3B0aW9ucyIsImRlY2xhcmVkIiwidXNlZCIsIm5vblR5cGVJbXBvcnQiLCJpc1R5cGVJbXBvcnREZWNsYXJhdGlvbiIsImZvckVhY2giLCJmaW5kIiwiY29uZmlnIiwiZmlsdGVyIiwiZXZlcnkiLCJoYXMiLCJjb25zb2xlIiwibG9nIiwieCIsInJlbW92ZSIsInR5cGUiLCJpbXBvcnRLaW5kIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQWFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQWxCQTs7Ozs7Ozs7OztJQW9CT0EsSyxpREFBQUEsSzs7QUFRUDtBQUNBLElBQU1DLFNBQTZCO0FBQ2pDO0FBQ0E7QUFDRUMsWUFBVSw4Q0FBS0MsaUJBRGpCO0FBRUVDLFdBQVMsMEZBRlg7QUFHRUMsWUFBVTtBQUFBLFdBQVFDLEtBQUtDLFVBQUwsQ0FBZ0JDLEdBQWhCLENBQW9CO0FBQUEsYUFBYUMsVUFBVUMsS0FBVixDQUFnQkMsSUFBN0I7QUFBQSxLQUFwQixDQUFSO0FBQUE7QUFIWixDQUZpQyxFQU9qQztBQUNFVCxZQUFVLDhDQUFLVSxlQURqQjtBQUVFUixXQUFTLENBQUM7QUFBQSxXQUFRLDZDQUFTUyxLQUFLQyxNQUFkLEtBQXlCLHFEQUFhRCxLQUFLQyxNQUFsQixDQUFqQztBQUFBLEdBQUQsQ0FGWDtBQUdFVCxZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLSSxLQUFMLENBQVdDLElBQVosQ0FBUjtBQUFBO0FBSFosQ0FQaUMsQ0FBbkM7O0FBY0EsU0FBU0ksaUJBQVQsQ0FBMkJDLElBQTNCLEVBQTZDQyxPQUE3QyxFQUEyRTtBQUN6RSxNQUFNQyxXQUFXLHlFQUF1QkYsSUFBdkIsRUFBNkJDLE9BQTdCLENBQWpCO0FBQ0EsTUFBTUUsT0FBTyx5RUFBdUJILElBQXZCLENBQWI7QUFDQSxNQUFNSSxnQkFBZ0IsNkRBQ3BCSixJQURvQixFQUVwQkMsT0FGb0IsRUFHcEIsQ0FBQztBQUFBLFdBQVEsQ0FBQ0ksd0JBQXdCUixLQUFLUCxJQUE3QixDQUFUO0FBQUEsR0FBRCxDQUhvQixDQUF0QjtBQUtBO0FBQ0FMLFNBQU9xQixPQUFQLENBQWUsa0JBQVU7QUFDdkJOLFNBQ0dPLElBREgsQ0FDUUMsT0FBT3RCLFFBRGYsRUFFR3VCLE1BRkgsQ0FFVTtBQUFBLGFBQVFELE9BQU9wQixPQUFQLENBQWVzQixLQUFmLENBQXFCO0FBQUEsZUFBVUQsT0FBT1osSUFBUCxDQUFWO0FBQUEsT0FBckIsQ0FBUjtBQUFBLEtBRlYsRUFHR1ksTUFISCxDQUdVO0FBQUEsYUFBUUQsT0FBT25CLFFBQVAsQ0FBZ0JRLEtBQUtQLElBQXJCLEVBQTJCb0IsS0FBM0IsQ0FDZDtBQUFBLGVBQVEsQ0FBQ1AsS0FBS1EsR0FBTCxDQUFTaEIsSUFBVCxDQUFELElBQW1CTyxTQUFTUyxHQUFULENBQWFoQixJQUFiLENBQW5CLElBQXlDUyxjQUFjTyxHQUFkLENBQWtCaEIsSUFBbEIsQ0FBakQ7QUFBQSxPQURjLENBQVI7QUFBQSxLQUhWLEVBTUdILEdBTkgsQ0FNTyxhQUFLO0FBQ1JvQixjQUFRQyxHQUFSLENBQVlDLENBQVo7QUFDQSxhQUFPQSxDQUFQO0FBQ0QsS0FUSCxFQVVHQyxNQVZIO0FBV0QsR0FaRDtBQWFEOztBQUVELFNBQVNWLHVCQUFULENBQWlDZixJQUFqQyxFQUEwRDtBQUN4RCxTQUFPTixNQUFNTSxJQUFOLEVBQVk7QUFDakIwQixVQUFNLG1CQURXO0FBRWpCQyxnQkFBWTtBQUZLLEdBQVosQ0FBUDtBQUlEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCcEIsaUJBQWpCIiwiZmlsZSI6InJlbW92ZVVudXNlZFR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXREZWNsYXJlZElkZW50aWZpZXJzIGZyb20gJy4uL3V0aWxzL2dldERlY2xhcmVkSWRlbnRpZmllcnMnO1xuaW1wb3J0IGdldERlY2xhcmVkVHlwZXMgZnJvbSAnLi4vdXRpbHMvZ2V0RGVjbGFyZWRUeXBlcyc7XG5pbXBvcnQgZ2V0Tm9uRGVjbGFyYXRpb25UeXBlcyBmcm9tICcuLi91dGlscy9nZXROb25EZWNsYXJhdGlvblR5cGVzJztcbmltcG9ydCBpc0dsb2JhbCBmcm9tICcuLi91dGlscy9pc0dsb2JhbCc7XG5pbXBvcnQgaXNUeXBlSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVHlwZUltcG9ydCc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5cbmNvbnN0IHttYXRjaH0gPSBqc2NzO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBub2RlVHlwZTogc3RyaW5nLFxuICBmaWx0ZXJzOiBBcnJheTwocGF0aDogTm9kZVBhdGgpID0+IGJvb2xlYW4+LFxuICBnZXROYW1lczogKG5vZGU6IE5vZGUpID0+IEFycmF5PHN0cmluZz4sXG59O1xuXG4vLyBUaGVzZSBhcmUgdGhlIHRoaW5ncyB3ZSBzaG91bGQgdHJ5IHRvIHJlbW92ZS5cbmNvbnN0IENPTkZJRzogQXJyYXk8Q29uZmlnRW50cnk+ID0gW1xuICAvLyBpbXBvcnQgdHlwZSBGb28gZnJvbSAnRm9vJztcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGZpbHRlcnM6IFtpc0dsb2JhbCwgaXNUeXBlSW1wb3J0XSxcbiAgICBnZXROYW1lczogbm9kZSA9PiBub2RlLnNwZWNpZmllcnMubWFwKHNwZWNpZmllciA9PiBzcGVjaWZpZXIubG9jYWwubmFtZSksXG4gIH0sXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnRTcGVjaWZpZXIsXG4gICAgZmlsdGVyczogW3BhdGggPT4gaXNHbG9iYWwocGF0aC5wYXJlbnQpICYmIGlzVHlwZUltcG9ydChwYXRoLnBhcmVudCldLFxuICAgIGdldE5hbWVzOiBub2RlID0+IFtub2RlLmxvY2FsLm5hbWVdLFxuICB9LFxuXTtcblxuZnVuY3Rpb24gcmVtb3ZlVW51c2VkVHlwZXMocm9vdDogQ29sbGVjdGlvbiwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IHZvaWQge1xuICBjb25zdCBkZWNsYXJlZCA9IGdldERlY2xhcmVkSWRlbnRpZmllcnMocm9vdCwgb3B0aW9ucyk7XG4gIGNvbnN0IHVzZWQgPSBnZXROb25EZWNsYXJhdGlvblR5cGVzKHJvb3QpO1xuICBjb25zdCBub25UeXBlSW1wb3J0ID0gZ2V0RGVjbGFyZWRUeXBlcyhcbiAgICByb290LFxuICAgIG9wdGlvbnMsXG4gICAgW3BhdGggPT4gIWlzVHlwZUltcG9ydERlY2xhcmF0aW9uKHBhdGgubm9kZSldLFxuICApO1xuICAvLyBSZW1vdmUgdGhpbmdzIGJhc2VkIG9uIHRoZSBjb25maWcuXG4gIENPTkZJRy5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgcm9vdFxuICAgICAgLmZpbmQoY29uZmlnLm5vZGVUeXBlKVxuICAgICAgLmZpbHRlcihwYXRoID0+IGNvbmZpZy5maWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXIocGF0aCkpKVxuICAgICAgLmZpbHRlcihwYXRoID0+IGNvbmZpZy5nZXROYW1lcyhwYXRoLm5vZGUpLmV2ZXJ5KFxuICAgICAgICBuYW1lID0+ICF1c2VkLmhhcyhuYW1lKSB8fCBkZWNsYXJlZC5oYXMobmFtZSkgfHwgbm9uVHlwZUltcG9ydC5oYXMobmFtZSksXG4gICAgICApKVxuICAgICAgLm1hcCh4ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coeCk7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSlcbiAgICAgIC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzVHlwZUltcG9ydERlY2xhcmF0aW9uKG5vZGU6IE5vZGVQYXRoKTogYm9vbGVhbiB7XG4gIHJldHVybiBtYXRjaChub2RlLCB7XG4gICAgdHlwZTogJ0ltcG9ydERlY2xhcmF0aW9uJyxcbiAgICBpbXBvcnRLaW5kOiAndHlwZScsXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZVVudXNlZFR5cGVzO1xuIl19