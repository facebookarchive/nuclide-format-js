'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

var _StringUtils;

function _load_StringUtils() {
  return _StringUtils = require('./StringUtils');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: make this configurable somehow, we probably don't want to explicitly
// list out all of the lowercase html tags that are built-in
var LOWER_CASE_WHITE_LIST = new Set(['fbt']);

/**
 * Returns an array of nodes for convenience.
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

function getJSXIdentifierName(path) {
  if ((_jscodeshift || _load_jscodeshift()).default.JSXIdentifier.check(path.node.name)) {
    var name = path.node.name.name;
    // TODO: should this be here or in addMissingRequires?
    if (!(0, (_StringUtils || _load_StringUtils()).isLowerCase)(name) || LOWER_CASE_WHITE_LIST.has(name)) {
      return [path.node.name];
    }
  }
  return [];
}

module.exports = getJSXIdentifierName;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0SlNYSWRlbnRpZmllck5hbWUuanMiXSwibmFtZXMiOlsiTE9XRVJfQ0FTRV9XSElURV9MSVNUIiwiU2V0IiwiZ2V0SlNYSWRlbnRpZmllck5hbWUiLCJwYXRoIiwiSlNYSWRlbnRpZmllciIsImNoZWNrIiwibm9kZSIsIm5hbWUiLCJoYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBRUE7QUFDQTtBQUNBLElBQU1BLHdCQUF3QixJQUFJQyxHQUFKLENBQVEsQ0FBQyxLQUFELENBQVIsQ0FBOUI7O0FBRUE7OztBQW5CQTs7Ozs7Ozs7OztBQXNCQSxTQUFTQyxvQkFBVCxDQUE4QkMsSUFBOUIsRUFBMkQ7QUFDekQsTUFBSSw4Q0FBS0MsYUFBTCxDQUFtQkMsS0FBbkIsQ0FBeUJGLEtBQUtHLElBQUwsQ0FBVUMsSUFBbkMsQ0FBSixFQUE4QztBQUM1QyxRQUFNQSxPQUFPSixLQUFLRyxJQUFMLENBQVVDLElBQVYsQ0FBZUEsSUFBNUI7QUFDQTtBQUNBLFFBQUksQ0FBQyx1REFBWUEsSUFBWixDQUFELElBQXNCUCxzQkFBc0JRLEdBQXRCLENBQTBCRCxJQUExQixDQUExQixFQUEyRDtBQUN6RCxhQUFPLENBQUNKLEtBQUtHLElBQUwsQ0FBVUMsSUFBWCxDQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCUixvQkFBakIiLCJmaWxlIjoiZ2V0SlNYSWRlbnRpZmllck5hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZSwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcbmltcG9ydCB7aXNMb3dlckNhc2V9IGZyb20gJy4vU3RyaW5nVXRpbHMnO1xuXG4vLyBUT0RPOiBtYWtlIHRoaXMgY29uZmlndXJhYmxlIHNvbWVob3csIHdlIHByb2JhYmx5IGRvbid0IHdhbnQgdG8gZXhwbGljaXRseVxuLy8gbGlzdCBvdXQgYWxsIG9mIHRoZSBsb3dlcmNhc2UgaHRtbCB0YWdzIHRoYXQgYXJlIGJ1aWx0LWluXG5jb25zdCBMT1dFUl9DQVNFX1dISVRFX0xJU1QgPSBuZXcgU2V0KFsnZmJ0J10pO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2Ygbm9kZXMgZm9yIGNvbnZlbmllbmNlLlxuICovXG5mdW5jdGlvbiBnZXRKU1hJZGVudGlmaWVyTmFtZShwYXRoOiBOb2RlUGF0aCk6IEFycmF5PE5vZGU+IHtcbiAgaWYgKGpzY3MuSlNYSWRlbnRpZmllci5jaGVjayhwYXRoLm5vZGUubmFtZSkpIHtcbiAgICBjb25zdCBuYW1lID0gcGF0aC5ub2RlLm5hbWUubmFtZTtcbiAgICAvLyBUT0RPOiBzaG91bGQgdGhpcyBiZSBoZXJlIG9yIGluIGFkZE1pc3NpbmdSZXF1aXJlcz9cbiAgICBpZiAoIWlzTG93ZXJDYXNlKG5hbWUpIHx8IExPV0VSX0NBU0VfV0hJVEVfTElTVC5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiBbcGF0aC5ub2RlLm5hbWVdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SlNYSWRlbnRpZmllck5hbWU7XG4iXX0=