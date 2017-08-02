'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

if (typeof atom !== 'undefined' && typeof atom.getCurrentWindow === 'function') {
  module.exports = require('./atom');
} else {
  module.exports = _extends({}, require('./common'));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhdG9tIiwiZ2V0Q3VycmVudFdpbmRvdyIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7QUFFQSxJQUFJLE9BQU9BLElBQVAsS0FBZ0IsV0FBaEIsSUFBK0IsT0FBT0EsS0FBS0MsZ0JBQVosS0FBaUMsVUFBcEUsRUFBZ0Y7QUFDOUVDLFNBQU9DLE9BQVAsR0FBaUJDLFFBQVEsUUFBUixDQUFqQjtBQUNELENBRkQsTUFFTztBQUNMRixTQUFPQyxPQUFQLGdCQUNLQyxRQUFRLFVBQVIsQ0FETDtBQUdEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuLyogZ2xvYmFscyBhdG9tICovXG5cbmlmICh0eXBlb2YgYXRvbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGF0b20uZ2V0Q3VycmVudFdpbmRvdyA9PT0gJ2Z1bmN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYXRvbScpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLi4ucmVxdWlyZSgnLi9jb21tb24nKSxcbiAgfTtcbn1cbiJdfQ==