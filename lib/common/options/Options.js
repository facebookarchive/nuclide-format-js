'use strict';

var _assert = _interopRequireDefault(require('assert'));

var _path = _interopRequireDefault(require('path'));

var _url = _interopRequireDefault(require('url'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Valides the options used to construct a module map.
 */
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function validateModuleMapOptions(options) {
  (0, _assert.default)(options, 'Invalid (undefined) ModuleMapOptions given.');

  // Validate presence of correct fields.
  (0, _assert.default)(options.paths, '`paths` must be provided.');
  (0, _assert.default)(options.pathsToRelativize, '`pathsToRelativze` must be provided.');
  (0, _assert.default)(options.aliases, '`aliases` must be provided.');
  (0, _assert.default)(options.aliasesToRelativize, '`aliasesToRelativze` must be provided.');
  (0, _assert.default)(options.builtIns, '`builtIns` must be provided.');
  (0, _assert.default)(options.builtInTypes, '`builtInTypes` must be provided.');

  // TODO: Use let.
  var filePath = void 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = options.paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      filePath = _step.value;

      (0, _assert.default)(isAbsolute(filePath), 'All paths must be absolute.');
    }
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = options.pathsToRelativize[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      filePath = _step2.value;

      (0, _assert.default)(isAbsolute(filePath), 'All paths must be absolute.');
    }
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
}

/**
 * Valides the options used to get requires out of a module map.
 */
function validateRequireOptions(options) {
  (0, _assert.default)(options, 'Invalid (undefined) RequireOptions given.');
}

/**
 * Validates the options given as input to transform.
 */
function validateSourceOptions(options) {
  (0, _assert.default)(options, 'Invalid (undefined) SourceOptions given.');
  if (options.sourcePath != null) {
    (0, _assert.default)(isAbsolute(options.sourcePath), 'If a "sourcePath" is given it must be an absolute path.');
  }
  (0, _assert.default)(options.moduleMap, 'A "moduleMap" must be provided in order to transform the source.');
}

/**
 * Small helper function to validate that a path is absolute. We also need to
 * allow remote nuclide files.
 */
function isAbsolute(sourcePath) {
  if (sourcePath.startsWith('nuclide:/')) {
    var parsedUri = _url.default.parse(sourcePath);
    (0, _assert.default)(parsedUri.path != null, 'uri path missing');
    return _path.default.isAbsolute(parsedUri.path);
  } else {
    return _path.default.isAbsolute(sourcePath);
  }
}

var Options = {
  validateModuleMapOptions: validateModuleMapOptions,
  validateRequireOptions: validateRequireOptions,
  validateSourceOptions: validateSourceOptions
};

module.exports = Options;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vb3B0aW9ucy9PcHRpb25zLmpzIl0sIm5hbWVzIjpbInZhbGlkYXRlTW9kdWxlTWFwT3B0aW9ucyIsIm9wdGlvbnMiLCJwYXRocyIsInBhdGhzVG9SZWxhdGl2aXplIiwiYWxpYXNlcyIsImFsaWFzZXNUb1JlbGF0aXZpemUiLCJidWlsdElucyIsImJ1aWx0SW5UeXBlcyIsImZpbGVQYXRoIiwiaXNBYnNvbHV0ZSIsInZhbGlkYXRlUmVxdWlyZU9wdGlvbnMiLCJ2YWxpZGF0ZVNvdXJjZU9wdGlvbnMiLCJzb3VyY2VQYXRoIiwibW9kdWxlTWFwIiwic3RhcnRzV2l0aCIsInBhcnNlZFVyaSIsInBhcnNlIiwicGF0aCIsIk9wdGlvbnMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQWNBOztBQUNBOztBQUNBOzs7O0FBRUE7OztBQWxCQTs7Ozs7Ozs7OztBQXFCQSxTQUFTQSx3QkFBVCxDQUFrQ0MsT0FBbEMsRUFBbUU7QUFDakUsdUJBQVVBLE9BQVYsRUFBbUIsNkNBQW5COztBQUVBO0FBQ0EsdUJBQVVBLFFBQVFDLEtBQWxCLEVBQXlCLDJCQUF6QjtBQUNBLHVCQUFVRCxRQUFRRSxpQkFBbEIsRUFBcUMsc0NBQXJDO0FBQ0EsdUJBQVVGLFFBQVFHLE9BQWxCLEVBQTJCLDZCQUEzQjtBQUNBLHVCQUNFSCxRQUFRSSxtQkFEVixFQUVFLHdDQUZGO0FBSUEsdUJBQVVKLFFBQVFLLFFBQWxCLEVBQTRCLDhCQUE1QjtBQUNBLHVCQUFVTCxRQUFRTSxZQUFsQixFQUFnQyxrQ0FBaEM7O0FBRUE7QUFDQSxNQUFJQyxpQkFBSjtBQWZpRTtBQUFBO0FBQUE7O0FBQUE7QUFnQmpFLHlCQUFpQlAsUUFBUUMsS0FBekIsOEhBQWdDO0FBQTNCTSxjQUEyQjs7QUFDOUIsMkJBQVVDLFdBQVdELFFBQVgsQ0FBVixFQUFnQyw2QkFBaEM7QUFDRDtBQWxCZ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFtQmpFLDBCQUFpQlAsUUFBUUUsaUJBQXpCLG1JQUE0QztBQUF2Q0ssY0FBdUM7O0FBQzFDLDJCQUFVQyxXQUFXRCxRQUFYLENBQVYsRUFBZ0MsNkJBQWhDO0FBQ0Q7QUFyQmdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFzQmxFOztBQUVEOzs7QUFHQSxTQUFTRSxzQkFBVCxDQUFnQ1QsT0FBaEMsRUFBK0Q7QUFDN0QsdUJBQVVBLE9BQVYsRUFBbUIsMkNBQW5CO0FBQ0Q7O0FBRUQ7OztBQUdBLFNBQVNVLHFCQUFULENBQStCVixPQUEvQixFQUE2RDtBQUMzRCx1QkFBVUEsT0FBVixFQUFtQiwwQ0FBbkI7QUFDQSxNQUFJQSxRQUFRVyxVQUFSLElBQXNCLElBQTFCLEVBQWdDO0FBQzlCLHlCQUNFSCxXQUFXUixRQUFRVyxVQUFuQixDQURGLEVBRUUseURBRkY7QUFJRDtBQUNELHVCQUNFWCxRQUFRWSxTQURWLEVBRUUsa0VBRkY7QUFJRDs7QUFFRDs7OztBQUlBLFNBQVNKLFVBQVQsQ0FBb0JHLFVBQXBCLEVBQWlEO0FBQy9DLE1BQUlBLFdBQVdFLFVBQVgsQ0FBc0IsV0FBdEIsQ0FBSixFQUF3QztBQUN0QyxRQUFNQyxZQUFZLGFBQUlDLEtBQUosQ0FBVUosVUFBVixDQUFsQjtBQUNBLHlCQUFVRyxVQUFVRSxJQUFWLElBQWtCLElBQTVCLEVBQWtDLGtCQUFsQztBQUNBLFdBQU8sY0FBS1IsVUFBTCxDQUFnQk0sVUFBVUUsSUFBMUIsQ0FBUDtBQUNELEdBSkQsTUFJTztBQUNMLFdBQU8sY0FBS1IsVUFBTCxDQUFnQkcsVUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsSUFBTU0sVUFBVTtBQUNkbEIsb0RBRGM7QUFFZFUsZ0RBRmM7QUFHZEM7QUFIYyxDQUFoQjs7QUFNQVEsT0FBT0MsT0FBUCxHQUFpQkYsT0FBakIiLCJmaWxlIjoiT3B0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtNb2R1bGVNYXBPcHRpb25zfSBmcm9tICcuL01vZHVsZU1hcE9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1JlcXVpcmVPcHRpb25zfSBmcm9tICcuL1JlcXVpcmVPcHRpb25zJztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuLyoqXG4gKiBWYWxpZGVzIHRoZSBvcHRpb25zIHVzZWQgdG8gY29uc3RydWN0IGEgbW9kdWxlIG1hcC5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVNb2R1bGVNYXBPcHRpb25zKG9wdGlvbnM6IE1vZHVsZU1hcE9wdGlvbnMpOiB2b2lkIHtcbiAgaW52YXJpYW50KG9wdGlvbnMsICdJbnZhbGlkICh1bmRlZmluZWQpIE1vZHVsZU1hcE9wdGlvbnMgZ2l2ZW4uJyk7XG5cbiAgLy8gVmFsaWRhdGUgcHJlc2VuY2Ugb2YgY29ycmVjdCBmaWVsZHMuXG4gIGludmFyaWFudChvcHRpb25zLnBhdGhzLCAnYHBhdGhzYCBtdXN0IGJlIHByb3ZpZGVkLicpO1xuICBpbnZhcmlhbnQob3B0aW9ucy5wYXRoc1RvUmVsYXRpdml6ZSwgJ2BwYXRoc1RvUmVsYXRpdnplYCBtdXN0IGJlIHByb3ZpZGVkLicpO1xuICBpbnZhcmlhbnQob3B0aW9ucy5hbGlhc2VzLCAnYGFsaWFzZXNgIG11c3QgYmUgcHJvdmlkZWQuJyk7XG4gIGludmFyaWFudChcbiAgICBvcHRpb25zLmFsaWFzZXNUb1JlbGF0aXZpemUsXG4gICAgJ2BhbGlhc2VzVG9SZWxhdGl2emVgIG11c3QgYmUgcHJvdmlkZWQuJyxcbiAgKTtcbiAgaW52YXJpYW50KG9wdGlvbnMuYnVpbHRJbnMsICdgYnVpbHRJbnNgIG11c3QgYmUgcHJvdmlkZWQuJyk7XG4gIGludmFyaWFudChvcHRpb25zLmJ1aWx0SW5UeXBlcywgJ2BidWlsdEluVHlwZXNgIG11c3QgYmUgcHJvdmlkZWQuJyk7XG5cbiAgLy8gVE9ETzogVXNlIGxldC5cbiAgbGV0IGZpbGVQYXRoO1xuICBmb3IgKGZpbGVQYXRoIG9mIG9wdGlvbnMucGF0aHMpIHtcbiAgICBpbnZhcmlhbnQoaXNBYnNvbHV0ZShmaWxlUGF0aCksICdBbGwgcGF0aHMgbXVzdCBiZSBhYnNvbHV0ZS4nKTtcbiAgfVxuICBmb3IgKGZpbGVQYXRoIG9mIG9wdGlvbnMucGF0aHNUb1JlbGF0aXZpemUpIHtcbiAgICBpbnZhcmlhbnQoaXNBYnNvbHV0ZShmaWxlUGF0aCksICdBbGwgcGF0aHMgbXVzdCBiZSBhYnNvbHV0ZS4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkZXMgdGhlIG9wdGlvbnMgdXNlZCB0byBnZXQgcmVxdWlyZXMgb3V0IG9mIGEgbW9kdWxlIG1hcC5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVSZXF1aXJlT3B0aW9ucyhvcHRpb25zOiBSZXF1aXJlT3B0aW9ucyk6IHZvaWQge1xuICBpbnZhcmlhbnQob3B0aW9ucywgJ0ludmFsaWQgKHVuZGVmaW5lZCkgUmVxdWlyZU9wdGlvbnMgZ2l2ZW4uJyk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoZSBvcHRpb25zIGdpdmVuIGFzIGlucHV0IHRvIHRyYW5zZm9ybS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVTb3VyY2VPcHRpb25zKG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiB2b2lkIHtcbiAgaW52YXJpYW50KG9wdGlvbnMsICdJbnZhbGlkICh1bmRlZmluZWQpIFNvdXJjZU9wdGlvbnMgZ2l2ZW4uJyk7XG4gIGlmIChvcHRpb25zLnNvdXJjZVBhdGggIT0gbnVsbCkge1xuICAgIGludmFyaWFudChcbiAgICAgIGlzQWJzb2x1dGUob3B0aW9ucy5zb3VyY2VQYXRoKSxcbiAgICAgICdJZiBhIFwic291cmNlUGF0aFwiIGlzIGdpdmVuIGl0IG11c3QgYmUgYW4gYWJzb2x1dGUgcGF0aC4nLFxuICAgICk7XG4gIH1cbiAgaW52YXJpYW50KFxuICAgIG9wdGlvbnMubW9kdWxlTWFwLFxuICAgICdBIFwibW9kdWxlTWFwXCIgbXVzdCBiZSBwcm92aWRlZCBpbiBvcmRlciB0byB0cmFuc2Zvcm0gdGhlIHNvdXJjZS4nLFxuICApO1xufVxuXG4vKipcbiAqIFNtYWxsIGhlbHBlciBmdW5jdGlvbiB0byB2YWxpZGF0ZSB0aGF0IGEgcGF0aCBpcyBhYnNvbHV0ZS4gV2UgYWxzbyBuZWVkIHRvXG4gKiBhbGxvdyByZW1vdGUgbnVjbGlkZSBmaWxlcy5cbiAqL1xuZnVuY3Rpb24gaXNBYnNvbHV0ZShzb3VyY2VQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKHNvdXJjZVBhdGguc3RhcnRzV2l0aCgnbnVjbGlkZTovJykpIHtcbiAgICBjb25zdCBwYXJzZWRVcmkgPSB1cmwucGFyc2Uoc291cmNlUGF0aCk7XG4gICAgaW52YXJpYW50KHBhcnNlZFVyaS5wYXRoICE9IG51bGwsICd1cmkgcGF0aCBtaXNzaW5nJyk7XG4gICAgcmV0dXJuIHBhdGguaXNBYnNvbHV0ZShwYXJzZWRVcmkucGF0aCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGguaXNBYnNvbHV0ZShzb3VyY2VQYXRoKTtcbiAgfVxufVxuXG5jb25zdCBPcHRpb25zID0ge1xuICB2YWxpZGF0ZU1vZHVsZU1hcE9wdGlvbnMsXG4gIHZhbGlkYXRlUmVxdWlyZU9wdGlvbnMsXG4gIHZhbGlkYXRlU291cmNlT3B0aW9ucyxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW9ucztcbiJdfQ==