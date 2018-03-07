'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
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

function reprintComment(node) {
  if (node.type === 'Block') {
    return (_jscodeshift || _load_jscodeshift()).default.block(node.value);
  } else if (node.type === 'Line') {
    return (_jscodeshift || _load_jscodeshift()).default.line(node.value);
  }
  return node;
}

module.exports = reprintComment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludENvbW1lbnQuanMiXSwibmFtZXMiOlsicmVwcmludENvbW1lbnQiLCJub2RlIiwidHlwZSIsImJsb2NrIiwidmFsdWUiLCJsaW5lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBO0FBQUE7QUFBQTs7OztBQVpBOzs7Ozs7Ozs7O0FBY0EsU0FBU0EsY0FBVCxDQUF3QkMsSUFBeEIsRUFBMEM7QUFDeEMsTUFBSUEsS0FBS0MsSUFBTCxLQUFjLE9BQWxCLEVBQTJCO0FBQ3pCLFdBQU8sOENBQUtDLEtBQUwsQ0FBV0YsS0FBS0csS0FBaEIsQ0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJSCxLQUFLQyxJQUFMLEtBQWMsTUFBbEIsRUFBMEI7QUFDL0IsV0FBTyw4Q0FBS0csSUFBTCxDQUFVSixLQUFLRyxLQUFmLENBQVA7QUFDRDtBQUNELFNBQU9ILElBQVA7QUFDRDs7QUFFREssT0FBT0MsT0FBUCxHQUFpQlAsY0FBakIiLCJmaWxlIjoicmVwcmludENvbW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZX0gZnJvbSAnLi4vdHlwZXMvYXN0JztcblxuaW1wb3J0IGpzY3MgZnJvbSAnLi9qc2NvZGVzaGlmdCc7XG5cbmZ1bmN0aW9uIHJlcHJpbnRDb21tZW50KG5vZGU6IE5vZGUpOiBOb2RlIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gJ0Jsb2NrJykge1xuICAgIHJldHVybiBqc2NzLmJsb2NrKG5vZGUudmFsdWUpO1xuICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ0xpbmUnKSB7XG4gICAgcmV0dXJuIGpzY3MubGluZShub2RlLnZhbHVlKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXByaW50Q29tbWVudDtcbiJdfQ==