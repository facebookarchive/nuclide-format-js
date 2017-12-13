'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.observeSettings = observeSettings;
exports.calculateOptions = calculateOptions;

var _common;

function _load_common() {
  return _common = _interopRequireDefault(require('../common'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Nuclide package settings used to calculate the module map,
// the blacklist, and control the plugin behavior.
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

/* globals atom */

var createModuleMap = (_common || _load_common()).default.createModuleMap;
// We need this in array formats.


var defaultAliases = Array.from((_common || _load_common()).default.defaultAliases);
var defaultBuiltIns = Array.from((_common || _load_common()).default.defaultBuiltIns);
var defaultBuiltInTypes = Array.from((_common || _load_common()).default.defaultBuiltInTypes);

/**
 * Observes the relevant Nuclide package settings.
 */
function observeSettings(callback) {
  return atom.config.observe('nuclide-format-js', function (settings) {
    return callback(_extends({}, settings, {
      aliases: fixAliases(settings.aliases)
    }));
  });
}

/**
 * Calculates the current options according to the Nuclide configuration object.
 * This may get expensive in the future as the module map becomes smarter.
 */
function calculateOptions(settings) {
  return {
    blacklist: calculateBlacklist(settings),
    moduleMap: calculateModuleMap(settings),
    jsxSuffix: settings.jsxSuffix,
    jsxNonReactNames: new Set(settings.jsxNonReactNames)
  };
}

/**
 * Calculates a module map from the settings.
 */
function calculateModuleMap(settings) {
  // Construct the aliases.
  var aliases = new Map(settings.aliases);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = defaultAliases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var entry = _step.value;

      var _entry = _slicedToArray(entry, 2),
          key = _entry[0],
          _value = _entry[1];

      if (!aliases.has(key)) {
        aliases.set(key, _value);
      }
    }

    // Construct the built ins.
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var builtIns = new Set(defaultBuiltIns);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = settings.builtIns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var builtIn = _step2.value;

      builtIns.add(builtIn);
    }

    // Construct built in types.
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var builtInTypes = new Set(defaultBuiltInTypes);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = settings.builtInTypes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var builtInType = _step3.value;

      builtInTypes.add(builtInType);
    }

    // And then calculate the module map.
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return createModuleMap({
    paths: [],
    pathsToRelativize: [],
    aliases: aliases,
    aliasesToRelativize: new Map(),
    builtIns: builtIns,
    builtInTypes: builtInTypes
  });
}

/**
 * Calculates the blacklist from the settings.
 */
function calculateBlacklist(settings) {
  var blacklist = new Set();
  if (!settings.nuclideFixHeader) {
    blacklist.add('nuclide.fixHeader');
  }
  if (!settings.requiresTransferComments) {
    blacklist.add('requires.transferComments');
  }
  if (!settings.requiresRemoveUnusedRequires) {
    blacklist.add('requires.removeUnusedRequires');
  }
  if (!settings.requiresAddMissingRequires) {
    blacklist.add('requires.addMissingRequires');
  }
  if (!settings.requiresRemoveUnusedTypes) {
    blacklist.add('requires.removeUnusedTypes');
  }
  if (!settings.requiresAddMissingTypes) {
    blacklist.add('requires.addMissingTypes');
  }
  if (!settings.requiresFormatRequires) {
    blacklist.add('requires.formatRequires');
  }
  return blacklist;
}

// Some small helper functions.

/**
 * Nuclide can't handle nested arrays well in settings, so we save it in a
 * flat array and fix up each pair or entries before using it in the transform
 */
function fixAliases(aliases_) {
  var aliases = aliases_;
  aliases = aliases || [];
  var pairs = [];
  for (var i = 0; i < aliases.length - 1; i += 2) {
    pairs.push([aliases[i], aliases[i + 1]]);
  }
  return pairs;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbIm9ic2VydmVTZXR0aW5ncyIsImNhbGN1bGF0ZU9wdGlvbnMiLCJjcmVhdGVNb2R1bGVNYXAiLCJkZWZhdWx0QWxpYXNlcyIsIkFycmF5IiwiZnJvbSIsImRlZmF1bHRCdWlsdElucyIsImRlZmF1bHRCdWlsdEluVHlwZXMiLCJjYWxsYmFjayIsImF0b20iLCJjb25maWciLCJvYnNlcnZlIiwic2V0dGluZ3MiLCJhbGlhc2VzIiwiZml4QWxpYXNlcyIsImJsYWNrbGlzdCIsImNhbGN1bGF0ZUJsYWNrbGlzdCIsIm1vZHVsZU1hcCIsImNhbGN1bGF0ZU1vZHVsZU1hcCIsImpzeFN1ZmZpeCIsImpzeE5vblJlYWN0TmFtZXMiLCJTZXQiLCJNYXAiLCJlbnRyeSIsImtleSIsInZhbHVlIiwiaGFzIiwic2V0IiwiYnVpbHRJbnMiLCJidWlsdEluIiwiYWRkIiwiYnVpbHRJblR5cGVzIiwiYnVpbHRJblR5cGUiLCJwYXRocyIsInBhdGhzVG9SZWxhdGl2aXplIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIm51Y2xpZGVGaXhIZWFkZXIiLCJyZXF1aXJlc1RyYW5zZmVyQ29tbWVudHMiLCJyZXF1aXJlc1JlbW92ZVVudXNlZFJlcXVpcmVzIiwicmVxdWlyZXNBZGRNaXNzaW5nUmVxdWlyZXMiLCJyZXF1aXJlc1JlbW92ZVVudXNlZFR5cGVzIiwicmVxdWlyZXNBZGRNaXNzaW5nVHlwZXMiLCJyZXF1aXJlc0Zvcm1hdFJlcXVpcmVzIiwiYWxpYXNlc18iLCJwYWlycyIsImkiLCJsZW5ndGgiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBOENnQkEsZSxHQUFBQSxlO1FBYUFDLGdCLEdBQUFBLGdCOzs7O0FBM0NoQjtBQUFBO0FBQUE7Ozs7QUFFQTtBQUNBO0FBbkJBOzs7Ozs7Ozs7O0FBVUE7O0lBMkJPQyxlLHVDQUFBQSxlO0FBQ1A7OztBQUNBLElBQU1DLGlCQUFpQkMsTUFBTUMsSUFB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Q3ZCLGNBQVVlLEdBQVYsQ0FBYywrQkFBZDtBQUNEO0FBQ0QsTUFBSSxDQUFDbEIsU0FBUzJCLDBCQUFkLEVBQTBDO0FBQ3hDeEIsY0FBVWUsR0FBVixDQUFjLDZCQUFkO0FBQ0Q7QUFDRCxNQUFJLENBQUNsQixTQUFTNEIseUJBQWQsRUFBeUM7QUFDdkN6QixjQUFVZSxHQUFWLENBQWMsNEJBQWQ7QUFDRDtBQUNELE1BQUksQ0FBQ2xCLFNBQVM2Qix1QkFBZCxFQUF1QztBQUNyQzFCLGNBQVVlLEdBQVYsQ0FBYywwQkFBZDtBQUNEO0FBQ0QsTUFBSSxDQUFDbEIsU0FBUzhCLHNCQUFkLEVBQXNDO0FBQ3BDM0IsY0FBVWUsR0FBVixDQUFjLHlCQUFkO0FBQ0Q7QUFDRCxTQUFPZixTQUFQO0FBQ0Q7O0FBRUQ7O0FBRUE7Ozs7QUFJQSxTQUFTRCxVQUFULENBQW9CNkIsUUFBcEIsRUFBdUU7QUFDckUsTUFBSTlCLFVBQVU4QixRQUFkO0FBQ0E5QixZQUFVQSxXQUFXLEVBQXJCO0FBQ0EsTUFBTStCLFFBQVEsRUFBZDtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJaEMsUUFBUWlDLE1BQVIsR0FBaUIsQ0FBckMsRUFBd0NELEtBQUssQ0FBN0MsRUFBZ0Q7QUFDOUNELFVBQU1HLElBQU4sQ0FBVyxDQUFDbEMsUUFBUWdDLENBQVIsQ0FBRCxFQUFhaEMsUUFBUWdDLElBQUksQ0FBWixDQUFiLENBQVg7QUFDRDtBQUNELFNBQU9ELEtBQVA7QUFDRCIsImZpbGUiOiJzZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSBNb2R1bGVNYXAgZnJvbSAnLi4vY29tbW9uL3N0YXRlL01vZHVsZU1hcCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7VHJhbnNmb3JtS2V5fSBmcm9tICcuLi9jb21tb24vdHlwZXMvdHJhbnNmb3Jtcyc7XG5cbmltcG9ydCBmb3JtYXRKU0Jhc2UgZnJvbSAnLi4vY29tbW9uJztcblxuLy8gTnVjbGlkZSBwYWNrYWdlIHNldHRpbmdzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBtb2R1bGUgbWFwLFxuLy8gdGhlIGJsYWNrbGlzdCwgYW5kIGNvbnRyb2wgdGhlIHBsdWdpbiBiZWhhdmlvci5cbmV4cG9ydCB0eXBlIFNldHRpbmdzID0ge1xuICBhbGlhc2VzOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPixcbiAgYnVpbHRJbnM6IEFycmF5PHN0cmluZz4sXG4gIGJ1aWx0SW5UeXBlczogQXJyYXk8c3RyaW5nPixcbiAganN4Tm9uUmVhY3ROYW1lczogQXJyYXk8c3RyaW5nPixcbiAganN4U3VmZml4OiBib29sZWFuLFxuICBudWNsaWRlRml4SGVhZGVyOiBib29sZWFuLFxuICByZXF1aXJlc1RyYW5zZmVyQ29tbWVudHM6IGJvb2xlYW4sXG4gIHJlcXVpcmVzUmVtb3ZlVW51c2VkUmVxdWlyZXM6IGJvb2xlYW4sXG4gIHJlcXVpcmVzQWRkTWlzc2luZ1JlcXVpcmVzOiBib29sZWFuLFxuICByZXF1aXJlc1JlbW92ZVVudXNlZFR5cGVzOiBib29sZWFuLFxuICByZXF1aXJlc0FkZE1pc3NpbmdUeXBlczogYm9vbGVhbixcbiAgcmVxdWlyZXNGb3JtYXRSZXF1aXJlczogYm9vbGVhbixcbiAgcnVuT25TYXZlOiBib29sZWFuLFxuICB1c2VBc1NlcnZpY2U6IGJvb2xlYW4sXG59O1xuXG5jb25zdCB7Y3JlYXRlTW9kdWxlTWFwfSA9IGZvcm1hdEpTQmFzZTtcbi8vIFdlIG5lZWQgdGhpcyBpbiBhcnJheSBmb3JtYXRzLlxuY29uc3QgZGVmYXVsdEFsaWFzZXMgPSBBcnJheS5mcm9tKGZvcm1hdEpTQmFzZS5kZWZhdWx0QWxpYXNlcyk7XG5jb25zdCBkZWZhdWx0QnVpbHRJbnMgPSBBcnJheS5mcm9tKGZvcm1hdEpTQmFzZS5kZWZhdWx0QnVpbHRJbnMpO1xuY29uc3QgZGVmYXVsdEJ1aWx0SW5UeXBlcyA9IEFycmF5LmZyb20oZm9ybWF0SlNCYXNlLmRlZmF1bHRCdWlsdEluVHlwZXMpO1xuXG4vKipcbiAqIE9ic2VydmVzIHRoZSByZWxldmFudCBOdWNsaWRlIHBhY2thZ2Ugc2V0dGluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlU2V0dGluZ3MoY2FsbGJhY2s6ICh2YWx1ZTogU2V0dGluZ3MpID0+IHZvaWQpOiBJRGlzcG9zYWJsZSB7XG4gIHJldHVybiBhdG9tLmNvbmZpZy5vYnNlcnZlKCdudWNsaWRlLWZvcm1hdC1qcycsIHNldHRpbmdzID0+XG4gICAgY2FsbGJhY2soe1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBhbGlhc2VzOiBmaXhBbGlhc2VzKHNldHRpbmdzLmFsaWFzZXMpLFxuICAgIH0pLFxuICApO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGN1cnJlbnQgb3B0aW9ucyBhY2NvcmRpbmcgdG8gdGhlIE51Y2xpZGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKiBUaGlzIG1heSBnZXQgZXhwZW5zaXZlIGluIHRoZSBmdXR1cmUgYXMgdGhlIG1vZHVsZSBtYXAgYmVjb21lcyBzbWFydGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlT3B0aW9ucyhzZXR0aW5nczogU2V0dGluZ3MpOiBTb3VyY2VPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBibGFja2xpc3Q6IGNhbGN1bGF0ZUJsYWNrbGlzdChzZXR0aW5ncyksXG4gICAgbW9kdWxlTWFwOiBjYWxjdWxhdGVNb2R1bGVNYXAoc2V0dGluZ3MpLFxuICAgIGpzeFN1ZmZpeDogc2V0dGluZ3MuanN4U3VmZml4LFxuICAgIGpzeE5vblJlYWN0TmFtZXM6IG5ldyBTZXQoc2V0dGluZ3MuanN4Tm9uUmVhY3ROYW1lcyksXG4gIH07XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBhIG1vZHVsZSBtYXAgZnJvbSB0aGUgc2V0dGluZ3MuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZU1vZHVsZU1hcChzZXR0aW5nczogU2V0dGluZ3MpOiBNb2R1bGVNYXAge1xuICAvLyBDb25zdHJ1Y3QgdGhlIGFsaWFzZXMuXG4gIGNvbnN0IGFsaWFzZXMgPSBuZXcgTWFwKHNldHRpbmdzLmFsaWFzZXMpO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGRlZmF1bHRBbGlhc2VzKSB7XG4gICAgY29uc3QgW2tleSwgdmFsdWVdID0gZW50cnk7XG4gICAgaWYgKCFhbGlhc2VzLmhhcyhrZXkpKSB7XG4gICAgICBhbGlhc2VzLnNldChrZXksIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb25zdHJ1Y3QgdGhlIGJ1aWx0IGlucy5cbiAgY29uc3QgYnVpbHRJbnMgPSBuZXcgU2V0KGRlZmF1bHRCdWlsdElucyk7XG4gIGZvciAoY29uc3QgYnVpbHRJbiBvZiBzZXR0aW5ncy5idWlsdElucykge1xuICAgIGJ1aWx0SW5zLmFkZChidWlsdEluKTtcbiAgfVxuXG4gIC8vIENvbnN0cnVjdCBidWlsdCBpbiB0eXBlcy5cbiAgY29uc3QgYnVpbHRJblR5cGVzID0gbmV3IFNldChkZWZhdWx0QnVpbHRJblR5cGVzKTtcbiAgZm9yIChjb25zdCBidWlsdEluVHlwZSBvZiBzZXR0aW5ncy5idWlsdEluVHlwZXMpIHtcbiAgICBidWlsdEluVHlwZXMuYWRkKGJ1aWx0SW5UeXBlKTtcbiAgfVxuXG4gIC8vIEFuZCB0aGVuIGNhbGN1bGF0ZSB0aGUgbW9kdWxlIG1hcC5cbiAgcmV0dXJuIGNyZWF0ZU1vZHVsZU1hcCh7XG4gICAgcGF0aHM6IFtdLFxuICAgIHBhdGhzVG9SZWxhdGl2aXplOiBbXSxcbiAgICBhbGlhc2VzLFxuICAgIGFsaWFzZXNUb1JlbGF0aXZpemU6IG5ldyBNYXAoKSxcbiAgICBidWlsdElucyxcbiAgICBidWlsdEluVHlwZXMsXG4gIH0pO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGJsYWNrbGlzdCBmcm9tIHRoZSBzZXR0aW5ncy5cbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlQmxhY2tsaXN0KHNldHRpbmdzOiBTZXR0aW5ncyk6IFNldDxUcmFuc2Zvcm1LZXk+IHtcbiAgY29uc3QgYmxhY2tsaXN0ID0gbmV3IFNldCgpO1xuICBpZiAoIXNldHRpbmdzLm51Y2xpZGVGaXhIZWFkZXIpIHtcbiAgICBibGFja2xpc3QuYWRkKCdudWNsaWRlLmZpeEhlYWRlcicpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNUcmFuc2ZlckNvbW1lbnRzKSB7XG4gICAgYmxhY2tsaXN0LmFkZCgncmVxdWlyZXMudHJhbnNmZXJDb21tZW50cycpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNSZW1vdmVVbnVzZWRSZXF1aXJlcykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLnJlbW92ZVVudXNlZFJlcXVpcmVzJyk7XG4gIH1cbiAgaWYgKCFzZXR0aW5ncy5yZXF1aXJlc0FkZE1pc3NpbmdSZXF1aXJlcykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLmFkZE1pc3NpbmdSZXF1aXJlcycpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNSZW1vdmVVbnVzZWRUeXBlcykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLnJlbW92ZVVudXNlZFR5cGVzJyk7XG4gIH1cbiAgaWYgKCFzZXR0aW5ncy5yZXF1aXJlc0FkZE1pc3NpbmdUeXBlcykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLmFkZE1pc3NpbmdUeXBlcycpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNGb3JtYXRSZXF1aXJlcykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLmZvcm1hdFJlcXVpcmVzJyk7XG4gIH1cbiAgcmV0dXJuIGJsYWNrbGlzdDtcbn1cblxuLy8gU29tZSBzbWFsbCBoZWxwZXIgZnVuY3Rpb25zLlxuXG4vKipcbiAqIE51Y2xpZGUgY2FuJ3QgaGFuZGxlIG5lc3RlZCBhcnJheXMgd2VsbCBpbiBzZXR0aW5ncywgc28gd2Ugc2F2ZSBpdCBpbiBhXG4gKiBmbGF0IGFycmF5IGFuZCBmaXggdXAgZWFjaCBwYWlyIG9yIGVudHJpZXMgYmVmb3JlIHVzaW5nIGl0IGluIHRoZSB0cmFuc2Zvcm1cbiAqL1xuZnVuY3Rpb24gZml4QWxpYXNlcyhhbGlhc2VzXzogP0FycmF5PHN0cmluZz4pOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPiB7XG4gIGxldCBhbGlhc2VzID0gYWxpYXNlc187XG4gIGFsaWFzZXMgPSBhbGlhc2VzIHx8IFtdO1xuICBjb25zdCBwYWlycyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsaWFzZXMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgcGFpcnMucHVzaChbYWxpYXNlc1tpXSwgYWxpYXNlc1tpICsgMV1dKTtcbiAgfVxuICByZXR1cm4gcGFpcnM7XG59XG4iXX0=