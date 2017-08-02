'use strict';

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

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
    return _jscodeshift2.default.block(node.value);
  } else if (node.type === 'Line') {
    return _jscodeshift2.default.line(node.value);
  }
  return node;
}

module.exports = reprintComment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludENvbW1lbnQuanMiXSwibmFtZXMiOlsicmVwcmludENvbW1lbnQiLCJub2RlIiwidHlwZSIsImJsb2NrIiwidmFsdWUiLCJsaW5lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFZQTs7Ozs7O0FBWkE7Ozs7Ozs7Ozs7QUFjQSxTQUFTQSxjQUFULENBQXdCQyxJQUF4QixFQUEwQztBQUN4QyxNQUFJQSxLQUFLQyxJQUFMLEtBQWMsT0FBbEIsRUFBMkI7QUFDekIsV0FBTyxzQkFBS0MsS0FBTCxDQUFXRixLQUFLRyxLQUFoQixDQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlILEtBQUtDLElBQUwsS0FBYyxNQUFsQixFQUEwQjtBQUMvQixXQUFPLHNCQUFLRyxJQUFMLENBQVVKLEtBQUtHLEtBQWYsQ0FBUDtBQUNEO0FBQ0QsU0FBT0gsSUFBUDtBQUNEOztBQUVESyxPQUFPQyxPQUFQLEdBQWlCUCxjQUFqQiIsImZpbGUiOiJyZXByaW50Q29tbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5cbmZ1bmN0aW9uIHJlcHJpbnRDb21tZW50KG5vZGU6IE5vZGUpOiBOb2RlIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gJ0Jsb2NrJykge1xuICAgIHJldHVybiBqc2NzLmJsb2NrKG5vZGUudmFsdWUpO1xuICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ0xpbmUnKSB7XG4gICAgcmV0dXJuIGpzY3MubGluZShub2RlLnZhbHVlKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXByaW50Q29tbWVudDtcbiJdfQ==