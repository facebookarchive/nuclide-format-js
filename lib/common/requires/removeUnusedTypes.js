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
  return _jscodeshift = _interopRequireDefault(require('../utils/jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvcmVtb3ZlVW51c2VkVHlwZXMuanMiXSwibmFtZXMiOlsibWF0Y2giLCJDT05GSUciLCJub2RlVHlwZSIsIkltcG9ydERlY2xhcmF0aW9uIiwiZmlsdGVycyIsImdldE5hbWVzIiwibm9kZSIsInNwZWNpZmllcnMiLCJtYXAiLCJzcGVjaWZpZXIiLCJsb2NhbCIsIm5hbWUiLCJJbXBvcnRTcGVjaWZpZXIiLCJwYXRoIiwicGFyZW50IiwicmVtb3ZlVW51c2VkVHlwZXMiLCJyb290Iiwib3B0aW9ucyIsImRlY2xhcmVkIiwidXNlZCIsIm5vblR5cGVJbXBvcnQiLCJpc1R5cGVJbXBvcnREZWNsYXJhdGlvbiIsImZvckVhY2giLCJmaW5kIiwiY29uZmlnIiwiZmlsdGVyIiwiZXZlcnkiLCJoYXMiLCJyZW1vdmUiLCJ0eXBlIiwiaW1wb3J0S2luZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFsQkE7Ozs7Ozs7Ozs7SUFvQk9BLEssaURBQUFBLEs7O0FBUVA7QUFDQSxJQUFNQyxTQUE2QjtBQUNqQztBQUNBO0FBQ0VDLFlBQVUsOENBQUtDLGlCQURqQjtBQUVFQyxXQUFTLDBGQUZYO0FBR0VDLFlBQVU7QUFBQSxXQUFRQyxLQUFLQyxVQUFMLENBQWdCQyxHQUFoQixDQUFvQjtBQUFBLGFBQWFDLFVBQVVDLEtBQVYsQ0FBZ0JDLElBQTdCO0FBQUEsS0FBcEIsQ0FBUjtBQUFBO0FBSFosQ0FGaUMsRUFPakM7QUFDRVQsWUFBVSw4Q0FBS1UsZUFEakI7QUFFRVIsV0FBUyxDQUFDO0FBQUEsV0FBUSw2Q0FBU1MsS0FBS0MsTUFBZCxLQUF5QixxREFBYUQsS0FBS0MsTUFBbEIsQ0FBakM7QUFBQSxHQUFELENBRlg7QUFHRVQsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0ksS0FBTCxDQUFXQyxJQUFaLENBQVI7QUFBQTtBQUhaLENBUGlDLENBQW5DOztBQWNBLFNBQVNJLGlCQUFULENBQTJCQyxJQUEzQixFQUE2Q0MsT0FBN0MsRUFBMkU7QUFDekUsTUFBTUMsV0FBVyx5RUFBdUJGLElBQXZCLEVBQTZCQyxPQUE3QixDQUFqQjtBQUNBLE1BQU1FLE9BQU8seUVBQXVCSCxJQUF2QixDQUFiO0FBQ0EsTUFBTUksZ0JBQWdCLDZEQUNwQkosSUFEb0IsRUFFcEJDLE9BRm9CLEVBR3BCLENBQUM7QUFBQSxXQUFRLENBQUNJLHdCQUF3QlIsS0FBS1AsSUFBN0IsQ0FBVDtBQUFBLEdBQUQsQ0FIb0IsQ0FBdEI7QUFLQTtBQUNBTCxTQUFPcUIsT0FBUCxDQUFlLGtCQUFVO0FBQ3ZCTixTQUNHTyxJQURILENBQ1FDLE9BQU90QixRQURmLEVBRUd1QixNQUZILENBRVU7QUFBQSxhQUFRRCxPQUFPcEIsT0FBUCxDQUFlc0IsS0FBZixDQUFxQjtBQUFBLGVBQVVELE9BQU9aLElBQVAsQ0FBVjtBQUFBLE9BQXJCLENBQVI7QUFBQSxLQUZWLEVBR0dZLE1BSEgsQ0FHVTtBQUFBLGFBQVFELE9BQU9uQixRQUFQLENBQWdCUSxLQUFLUCxJQUFyQixFQUEyQm9CLEtBQTNCLENBQ2Q7QUFBQSxlQUFRLENBQUNQLEtBQUtRLEdBQUwsQ0FBU2hCLElBQVQsQ0FBRCxJQUFtQk8sU0FBU1MsR0FBVCxDQUFhaEIsSUFBYixDQUFuQixJQUF5Q1MsY0FBY08sR0FBZCxDQUFrQmhCLElBQWxCLENBQWpEO0FBQUEsT0FEYyxDQUFSO0FBQUEsS0FIVixFQU1HaUIsTUFOSDtBQU9ELEdBUkQ7QUFTRDs7QUFFRCxTQUFTUCx1QkFBVCxDQUFpQ2YsSUFBakMsRUFBMEQ7QUFDeEQsU0FBT04sTUFBTU0sSUFBTixFQUFZO0FBQ2pCdUIsVUFBTSxtQkFEVztBQUVqQkMsZ0JBQVk7QUFGSyxHQUFaLENBQVA7QUFJRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQmpCLGlCQUFqQiIsImZpbGUiOiJyZW1vdmVVbnVzZWRUeXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9uLCBOb2RlLCBOb2RlUGF0aH0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgZ2V0RGVjbGFyZWRJZGVudGlmaWVycyBmcm9tICcuLi91dGlscy9nZXREZWNsYXJlZElkZW50aWZpZXJzJztcbmltcG9ydCBnZXREZWNsYXJlZFR5cGVzIGZyb20gJy4uL3V0aWxzL2dldERlY2xhcmVkVHlwZXMnO1xuaW1wb3J0IGdldE5vbkRlY2xhcmF0aW9uVHlwZXMgZnJvbSAnLi4vdXRpbHMvZ2V0Tm9uRGVjbGFyYXRpb25UeXBlcyc7XG5pbXBvcnQgaXNHbG9iYWwgZnJvbSAnLi4vdXRpbHMvaXNHbG9iYWwnO1xuaW1wb3J0IGlzVHlwZUltcG9ydCBmcm9tICcuLi91dGlscy9pc1R5cGVJbXBvcnQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnLi4vdXRpbHMvanNjb2Rlc2hpZnQnO1xuXG5jb25zdCB7bWF0Y2h9ID0ganNjcztcblxudHlwZSBDb25maWdFbnRyeSA9IHtcbiAgbm9kZVR5cGU6IHN0cmluZyxcbiAgZmlsdGVyczogQXJyYXk8KHBhdGg6IE5vZGVQYXRoKSA9PiBib29sZWFuPixcbiAgZ2V0TmFtZXM6IChub2RlOiBOb2RlKSA9PiBBcnJheTxzdHJpbmc+LFxufTtcblxuLy8gVGhlc2UgYXJlIHRoZSB0aGluZ3Mgd2Ugc2hvdWxkIHRyeSB0byByZW1vdmUuXG5jb25zdCBDT05GSUc6IEFycmF5PENvbmZpZ0VudHJ5PiA9IFtcbiAgLy8gaW1wb3J0IHR5cGUgRm9vIGZyb20gJ0Zvbyc7XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBmaWx0ZXJzOiBbaXNHbG9iYWwsIGlzVHlwZUltcG9ydF0sXG4gICAgZ2V0TmFtZXM6IG5vZGUgPT4gbm9kZS5zcGVjaWZpZXJzLm1hcChzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmxvY2FsLm5hbWUpLFxuICB9LFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuSW1wb3J0U3BlY2lmaWVyLFxuICAgIGZpbHRlcnM6IFtwYXRoID0+IGlzR2xvYmFsKHBhdGgucGFyZW50KSAmJiBpc1R5cGVJbXBvcnQocGF0aC5wYXJlbnQpXSxcbiAgICBnZXROYW1lczogbm9kZSA9PiBbbm9kZS5sb2NhbC5uYW1lXSxcbiAgfSxcbl07XG5cbmZ1bmN0aW9uIHJlbW92ZVVudXNlZFR5cGVzKHJvb3Q6IENvbGxlY3Rpb24sIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiB2b2lkIHtcbiAgY29uc3QgZGVjbGFyZWQgPSBnZXREZWNsYXJlZElkZW50aWZpZXJzKHJvb3QsIG9wdGlvbnMpO1xuICBjb25zdCB1c2VkID0gZ2V0Tm9uRGVjbGFyYXRpb25UeXBlcyhyb290KTtcbiAgY29uc3Qgbm9uVHlwZUltcG9ydCA9IGdldERlY2xhcmVkVHlwZXMoXG4gICAgcm9vdCxcbiAgICBvcHRpb25zLFxuICAgIFtwYXRoID0+ICFpc1R5cGVJbXBvcnREZWNsYXJhdGlvbihwYXRoLm5vZGUpXSxcbiAgKTtcbiAgLy8gUmVtb3ZlIHRoaW5ncyBiYXNlZCBvbiB0aGUgY29uZmlnLlxuICBDT05GSUcuZm9yRWFjaChjb25maWcgPT4ge1xuICAgIHJvb3RcbiAgICAgIC5maW5kKGNvbmZpZy5ub2RlVHlwZSlcbiAgICAgIC5maWx0ZXIocGF0aCA9PiBjb25maWcuZmlsdGVycy5ldmVyeShmaWx0ZXIgPT4gZmlsdGVyKHBhdGgpKSlcbiAgICAgIC5maWx0ZXIocGF0aCA9PiBjb25maWcuZ2V0TmFtZXMocGF0aC5ub2RlKS5ldmVyeShcbiAgICAgICAgbmFtZSA9PiAhdXNlZC5oYXMobmFtZSkgfHwgZGVjbGFyZWQuaGFzKG5hbWUpIHx8IG5vblR5cGVJbXBvcnQuaGFzKG5hbWUpLFxuICAgICAgKSlcbiAgICAgIC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzVHlwZUltcG9ydERlY2xhcmF0aW9uKG5vZGU6IE5vZGVQYXRoKTogYm9vbGVhbiB7XG4gIHJldHVybiBtYXRjaChub2RlLCB7XG4gICAgdHlwZTogJ0ltcG9ydERlY2xhcmF0aW9uJyxcbiAgICBpbXBvcnRLaW5kOiAndHlwZScsXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZVVudXNlZFR5cGVzO1xuIl19