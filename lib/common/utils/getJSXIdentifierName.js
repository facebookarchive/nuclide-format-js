'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0SlNYSWRlbnRpZmllck5hbWUuanMiXSwibmFtZXMiOlsiTE9XRVJfQ0FTRV9XSElURV9MSVNUIiwiU2V0IiwiZ2V0SlNYSWRlbnRpZmllck5hbWUiLCJwYXRoIiwiSlNYSWRlbnRpZmllciIsImNoZWNrIiwibm9kZSIsIm5hbWUiLCJoYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBRUE7QUFDQTtBQUNBLElBQU1BLHdCQUF3QixJQUFJQyxHQUFKLENBQVEsQ0FBQyxLQUFELENBQVIsQ0FBOUI7O0FBRUE7OztBQW5CQTs7Ozs7Ozs7OztBQXNCQSxTQUFTQyxvQkFBVCxDQUE4QkMsSUFBOUIsRUFBMkQ7QUFDekQsTUFBSSw4Q0FBS0MsYUFBTCxDQUFtQkMsS0FBbkIsQ0FBeUJGLEtBQUtHLElBQUwsQ0FBVUMsSUFBbkMsQ0FBSixFQUE4QztBQUM1QyxRQUFNQSxPQUFPSixLQUFLRyxJQUFMLENBQVVDLElBQVYsQ0FBZUEsSUFBNUI7QUFDQTtBQUNBLFFBQUksQ0FBQyx1REFBWUEsSUFBWixDQUFELElBQXNCUCxzQkFBc0JRLEdBQXRCLENBQTBCRCxJQUExQixDQUExQixFQUEyRDtBQUN6RCxhQUFPLENBQUNKLEtBQUtHLElBQUwsQ0FBVUMsSUFBWCxDQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCUixvQkFBakIiLCJmaWxlIjoiZ2V0SlNYSWRlbnRpZmllck5hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZSwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJy4vanNjb2Rlc2hpZnQnO1xuaW1wb3J0IHtpc0xvd2VyQ2FzZX0gZnJvbSAnLi9TdHJpbmdVdGlscyc7XG5cbi8vIFRPRE86IG1ha2UgdGhpcyBjb25maWd1cmFibGUgc29tZWhvdywgd2UgcHJvYmFibHkgZG9uJ3Qgd2FudCB0byBleHBsaWNpdGx5XG4vLyBsaXN0IG91dCBhbGwgb2YgdGhlIGxvd2VyY2FzZSBodG1sIHRhZ3MgdGhhdCBhcmUgYnVpbHQtaW5cbmNvbnN0IExPV0VSX0NBU0VfV0hJVEVfTElTVCA9IG5ldyBTZXQoWydmYnQnXSk7XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBub2RlcyBmb3IgY29udmVuaWVuY2UuXG4gKi9cbmZ1bmN0aW9uIGdldEpTWElkZW50aWZpZXJOYW1lKHBhdGg6IE5vZGVQYXRoKTogQXJyYXk8Tm9kZT4ge1xuICBpZiAoanNjcy5KU1hJZGVudGlmaWVyLmNoZWNrKHBhdGgubm9kZS5uYW1lKSkge1xuICAgIGNvbnN0IG5hbWUgPSBwYXRoLm5vZGUubmFtZS5uYW1lO1xuICAgIC8vIFRPRE86IHNob3VsZCB0aGlzIGJlIGhlcmUgb3IgaW4gYWRkTWlzc2luZ1JlcXVpcmVzP1xuICAgIGlmICghaXNMb3dlckNhc2UobmFtZSkgfHwgTE9XRVJfQ0FTRV9XSElURV9MSVNULmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIFtwYXRoLm5vZGUubmFtZV07XG4gICAgfVxuICB9XG4gIHJldHVybiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRKU1hJZGVudGlmaWVyTmFtZTtcbiJdfQ==