'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.observeSettings = observeSettings;
exports.calculateOptions = calculateOptions;

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

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

var createModuleMap = _common2.default.createModuleMap;
// We need this in array formats.

var defaultAliases = Array.from(_common2.default.defaultAliases);
var defaultBuiltIns = Array.from(_common2.default.defaultBuiltIns);
var defaultBuiltInTypes = Array.from(_common2.default.defaultBuiltInTypes);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbIm9ic2VydmVTZXR0aW5ncyIsImNhbGN1bGF0ZU9wdGlvbnMiLCJjcmVhdGVNb2R1bGVNYXAiLCJkZWZhdWx0QWxpYXNlcyIsIkFycmF5IiwiZnJvbSIsImRlZmF1bHRCdWlsdElucyIsImRlZmF1bHRCdWlsdEluVHlwZXMiLCJjYWxsYmFjayIsImF0b20iLCJjb25maWciLCJvYnNlcnZlIiwic2V0dGluZ3MiLCJhbGlhc2VzIiwiZml4QWxpYXNlcyIsImJsYWNrbGlzdCIsImNhbGN1bGF0ZUJsYWNrbGlzdCIsIm1vZHVsZU1hcCIsImNhbGN1bGF0ZU1vZHVsZU1hcCIsImpzeFN1ZmZpeCIsImpzeE5vblJlYWN0TmFtZXMiLCJTZXQiLCJNYXAiLCJlbnRyeSIsImtleSIsInZhbHVlIiwiaGFzIiwic2V0IiwiYnVpbHRJbnMiLCJidWlsdEluIiwiYWRkIiwiYnVpbHRJblR5cGVzIiwiYnVpbHRJblR5cGUiLCJwYXRocyIsInBhdGhzVG9SZWxhdGl2aXplIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIm51Y2xpZGVGaXhIZWFkZXIiLCJyZXF1aXJlc1RyYW5zZmVyQ29tbWVudHMiLCJyZXF1aXJlc1JlbW92ZVVudXNlZFJlcXVpcmVzIiwicmVxdWlyZXNBZGRNaXNzaW5nUmVxdWlyZXMiLCJyZXF1aXJlc1JlbW92ZVVudXNlZFR5cGVzIiwicmVxdWlyZXNBZGRNaXNzaW5nVHlwZXMiLCJyZXF1aXJlc0Zvcm1hdFJlcXVpcmVzIiwiYWxpYXNlc18iLCJwYWlycyIsImkiLCJsZW5ndGgiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBOENnQkEsZSxHQUFBQSxlO1FBYUFDLGdCLEdBQUFBLGdCOztBQTNDaEI7Ozs7OztBQUVBO0FBQ0E7QUFuQkE7Ozs7Ozs7Ozs7QUFVQTs7SUEyQk9DLGUsb0JBQUFBLGU7QUFDUDs7QUFDQSxJQUFNQyxpQkFBaUJDLE1BQU1DLElBQU4sQ0FBVyxpQkFB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QUFWLENBQWMsK0JBQWQ7QUFDRDtBQUNELE1BQUksQ0FBQ2xCLFNBQVMyQiwwQkFBZCxFQUEwQztBQUN4Q3hCLGNBQVVlLEdBQVYsQ0FBYyw2QkFBZDtBQUNEO0FBQ0QsTUFBSSxDQUFDbEIsU0FBUzRCLHlCQUFkLEVBQXlDO0FBQ3ZDekIsY0FBVWUsR0FBVixDQUFjLDRCQUFkO0FBQ0Q7QUFDRCxNQUFJLENBQUNsQixTQUFTNkIsdUJBQWQsRUFBdUM7QUFDckMxQixjQUFVZSxHQUFWLENBQWMsMEJBQWQ7QUFDRDtBQUNELE1BQUksQ0FBQ2xCLFNBQVM4QixzQkFBZCxFQUFzQztBQUNwQzNCLGNBQVVlLEdBQVYsQ0FBYyx5QkFBZDtBQUNEO0FBQ0QsU0FBT2YsU0FBUDtBQUNEOztBQUVEOztBQUVBOzs7O0FBSUEsU0FBU0QsVUFBVCxDQUFvQjZCLFFBQXBCLEVBQXVFO0FBQ3JFLE1BQUk5QixVQUFVOEIsUUFBZDtBQUNBOUIsWUFBVUEsV0FBVyxFQUFyQjtBQUNBLE1BQU0rQixRQUFRLEVBQWQ7QUFDQSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSWhDLFFBQVFpQyxNQUFSLEdBQWlCLENBQXJDLEVBQXdDRCxLQUFLLENBQTdDLEVBQWdEO0FBQzlDRCxVQUFNRyxJQUFOLENBQVcsQ0FBQ2xDLFFBQVFnQyxDQUFSLENBQUQsRUFBYWhDLFFBQVFnQyxJQUFJLENBQVosQ0FBYixDQUFYO0FBQ0Q7QUFDRCxTQUFPRCxLQUFQO0FBQ0QiLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUgTW9kdWxlTWFwIGZyb20gJy4uL2NvbW1vbi9zdGF0ZS9Nb2R1bGVNYXAnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1RyYW5zZm9ybUtleX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3RyYW5zZm9ybXMnO1xuXG5pbXBvcnQgZm9ybWF0SlNCYXNlIGZyb20gJy4uL2NvbW1vbic7XG5cbi8vIE51Y2xpZGUgcGFja2FnZSBzZXR0aW5ncyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgbW9kdWxlIG1hcCxcbi8vIHRoZSBibGFja2xpc3QsIGFuZCBjb250cm9sIHRoZSBwbHVnaW4gYmVoYXZpb3IuXG5leHBvcnQgdHlwZSBTZXR0aW5ncyA9IHtcbiAgYWxpYXNlczogQXJyYXk8W3N0cmluZywgc3RyaW5nXT4sXG4gIGJ1aWx0SW5zOiBBcnJheTxzdHJpbmc+LFxuICBidWlsdEluVHlwZXM6IEFycmF5PHN0cmluZz4sXG4gIGpzeE5vblJlYWN0TmFtZXM6IEFycmF5PHN0cmluZz4sXG4gIGpzeFN1ZmZpeDogYm9vbGVhbixcbiAgbnVjbGlkZUZpeEhlYWRlcjogYm9vbGVhbixcbiAgcmVxdWlyZXNUcmFuc2ZlckNvbW1lbnRzOiBib29sZWFuLFxuICByZXF1aXJlc1JlbW92ZVVudXNlZFJlcXVpcmVzOiBib29sZWFuLFxuICByZXF1aXJlc0FkZE1pc3NpbmdSZXF1aXJlczogYm9vbGVhbixcbiAgcmVxdWlyZXNSZW1vdmVVbnVzZWRUeXBlczogYm9vbGVhbixcbiAgcmVxdWlyZXNBZGRNaXNzaW5nVHlwZXM6IGJvb2xlYW4sXG4gIHJlcXVpcmVzRm9ybWF0UmVxdWlyZXM6IGJvb2xlYW4sXG4gIHJ1bk9uU2F2ZTogYm9vbGVhbixcbiAgdXNlQXNTZXJ2aWNlOiBib29sZWFuLFxufTtcblxuY29uc3Qge2NyZWF0ZU1vZHVsZU1hcH0gPSBmb3JtYXRKU0Jhc2U7XG4vLyBXZSBuZWVkIHRoaXMgaW4gYXJyYXkgZm9ybWF0cy5cbmNvbnN0IGRlZmF1bHRBbGlhc2VzID0gQXJyYXkuZnJvbShmb3JtYXRKU0Jhc2UuZGVmYXVsdEFsaWFzZXMpO1xuY29uc3QgZGVmYXVsdEJ1aWx0SW5zID0gQXJyYXkuZnJvbShmb3JtYXRKU0Jhc2UuZGVmYXVsdEJ1aWx0SW5zKTtcbmNvbnN0IGRlZmF1bHRCdWlsdEluVHlwZXMgPSBBcnJheS5mcm9tKGZvcm1hdEpTQmFzZS5kZWZhdWx0QnVpbHRJblR5cGVzKTtcblxuLyoqXG4gKiBPYnNlcnZlcyB0aGUgcmVsZXZhbnQgTnVjbGlkZSBwYWNrYWdlIHNldHRpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZVNldHRpbmdzKGNhbGxiYWNrOiAodmFsdWU6IFNldHRpbmdzKSA9PiB2b2lkKTogSURpc3Bvc2FibGUge1xuICByZXR1cm4gYXRvbS5jb25maWcub2JzZXJ2ZSgnbnVjbGlkZS1mb3JtYXQtanMnLCBzZXR0aW5ncyA9PlxuICAgIGNhbGxiYWNrKHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgYWxpYXNlczogZml4QWxpYXNlcyhzZXR0aW5ncy5hbGlhc2VzKSxcbiAgICB9KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBjdXJyZW50IG9wdGlvbnMgYWNjb3JkaW5nIHRvIHRoZSBOdWNsaWRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICogVGhpcyBtYXkgZ2V0IGV4cGVuc2l2ZSBpbiB0aGUgZnV0dXJlIGFzIHRoZSBtb2R1bGUgbWFwIGJlY29tZXMgc21hcnRlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZU9wdGlvbnMoc2V0dGluZ3M6IFNldHRpbmdzKTogU291cmNlT3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgYmxhY2tsaXN0OiBjYWxjdWxhdGVCbGFja2xpc3Qoc2V0dGluZ3MpLFxuICAgIG1vZHVsZU1hcDogY2FsY3VsYXRlTW9kdWxlTWFwKHNldHRpbmdzKSxcbiAgICBqc3hTdWZmaXg6IHNldHRpbmdzLmpzeFN1ZmZpeCxcbiAgICBqc3hOb25SZWFjdE5hbWVzOiBuZXcgU2V0KHNldHRpbmdzLmpzeE5vblJlYWN0TmFtZXMpLFxuICB9O1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgYSBtb2R1bGUgbWFwIGZyb20gdGhlIHNldHRpbmdzLlxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVNb2R1bGVNYXAoc2V0dGluZ3M6IFNldHRpbmdzKTogTW9kdWxlTWFwIHtcbiAgLy8gQ29uc3RydWN0IHRoZSBhbGlhc2VzLlxuICBjb25zdCBhbGlhc2VzID0gbmV3IE1hcChzZXR0aW5ncy5hbGlhc2VzKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBkZWZhdWx0QWxpYXNlcykge1xuICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IGVudHJ5O1xuICAgIGlmICghYWxpYXNlcy5oYXMoa2V5KSkge1xuICAgICAgYWxpYXNlcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29uc3RydWN0IHRoZSBidWlsdCBpbnMuXG4gIGNvbnN0IGJ1aWx0SW5zID0gbmV3IFNldChkZWZhdWx0QnVpbHRJbnMpO1xuICBmb3IgKGNvbnN0IGJ1aWx0SW4gb2Ygc2V0dGluZ3MuYnVpbHRJbnMpIHtcbiAgICBidWlsdElucy5hZGQoYnVpbHRJbik7XG4gIH1cblxuICAvLyBDb25zdHJ1Y3QgYnVpbHQgaW4gdHlwZXMuXG4gIGNvbnN0IGJ1aWx0SW5UeXBlcyA9IG5ldyBTZXQoZGVmYXVsdEJ1aWx0SW5UeXBlcyk7XG4gIGZvciAoY29uc3QgYnVpbHRJblR5cGUgb2Ygc2V0dGluZ3MuYnVpbHRJblR5cGVzKSB7XG4gICAgYnVpbHRJblR5cGVzLmFkZChidWlsdEluVHlwZSk7XG4gIH1cblxuICAvLyBBbmQgdGhlbiBjYWxjdWxhdGUgdGhlIG1vZHVsZSBtYXAuXG4gIHJldHVybiBjcmVhdGVNb2R1bGVNYXAoe1xuICAgIHBhdGhzOiBbXSxcbiAgICBwYXRoc1RvUmVsYXRpdml6ZTogW10sXG4gICAgYWxpYXNlcyxcbiAgICBhbGlhc2VzVG9SZWxhdGl2aXplOiBuZXcgTWFwKCksXG4gICAgYnVpbHRJbnMsXG4gICAgYnVpbHRJblR5cGVzLFxuICB9KTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBibGFja2xpc3QgZnJvbSB0aGUgc2V0dGluZ3MuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZUJsYWNrbGlzdChzZXR0aW5nczogU2V0dGluZ3MpOiBTZXQ8VHJhbnNmb3JtS2V5PiB7XG4gIGNvbnN0IGJsYWNrbGlzdCA9IG5ldyBTZXQoKTtcbiAgaWYgKCFzZXR0aW5ncy5udWNsaWRlRml4SGVhZGVyKSB7XG4gICAgYmxhY2tsaXN0LmFkZCgnbnVjbGlkZS5maXhIZWFkZXInKTtcbiAgfVxuICBpZiAoIXNldHRpbmdzLnJlcXVpcmVzVHJhbnNmZXJDb21tZW50cykge1xuICAgIGJsYWNrbGlzdC5hZGQoJ3JlcXVpcmVzLnRyYW5zZmVyQ29tbWVudHMnKTtcbiAgfVxuICBpZiAoIXNldHRpbmdzLnJlcXVpcmVzUmVtb3ZlVW51c2VkUmVxdWlyZXMpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5yZW1vdmVVbnVzZWRSZXF1aXJlcycpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNBZGRNaXNzaW5nUmVxdWlyZXMpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nUmVxdWlyZXMnKTtcbiAgfVxuICBpZiAoIXNldHRpbmdzLnJlcXVpcmVzUmVtb3ZlVW51c2VkVHlwZXMpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5yZW1vdmVVbnVzZWRUeXBlcycpO1xuICB9XG4gIGlmICghc2V0dGluZ3MucmVxdWlyZXNBZGRNaXNzaW5nVHlwZXMpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nVHlwZXMnKTtcbiAgfVxuICBpZiAoIXNldHRpbmdzLnJlcXVpcmVzRm9ybWF0UmVxdWlyZXMpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5mb3JtYXRSZXF1aXJlcycpO1xuICB9XG4gIHJldHVybiBibGFja2xpc3Q7XG59XG5cbi8vIFNvbWUgc21hbGwgaGVscGVyIGZ1bmN0aW9ucy5cblxuLyoqXG4gKiBOdWNsaWRlIGNhbid0IGhhbmRsZSBuZXN0ZWQgYXJyYXlzIHdlbGwgaW4gc2V0dGluZ3MsIHNvIHdlIHNhdmUgaXQgaW4gYVxuICogZmxhdCBhcnJheSBhbmQgZml4IHVwIGVhY2ggcGFpciBvciBlbnRyaWVzIGJlZm9yZSB1c2luZyBpdCBpbiB0aGUgdHJhbnNmb3JtXG4gKi9cbmZ1bmN0aW9uIGZpeEFsaWFzZXMoYWxpYXNlc186ID9BcnJheTxzdHJpbmc+KTogQXJyYXk8W3N0cmluZywgc3RyaW5nXT4ge1xuICBsZXQgYWxpYXNlcyA9IGFsaWFzZXNfO1xuICBhbGlhc2VzID0gYWxpYXNlcyB8fCBbXTtcbiAgY29uc3QgcGFpcnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGlhc2VzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgIHBhaXJzLnB1c2goW2FsaWFzZXNbaV0sIGFsaWFzZXNbaSArIDFdXSk7XG4gIH1cbiAgcmV0dXJuIHBhaXJzO1xufVxuIl19