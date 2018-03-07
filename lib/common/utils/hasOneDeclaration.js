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

var match = (_jscodeshift || _load_jscodeshift()).default.match;

function hasOneDeclaration(node) {
  if (!match(node, { type: 'VariableDeclaration' })) {
    return false;
  }
  return node.declarations.length === 1;
}

module.exports = hasOneDeclaration;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvaGFzT25lRGVjbGFyYXRpb24uanMiXSwibmFtZXMiOlsibWF0Y2giLCJoYXNPbmVEZWNsYXJhdGlvbiIsIm5vZGUiLCJ0eXBlIiwiZGVjbGFyYXRpb25zIiwibGVuZ3RoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBO0FBQUE7QUFBQTs7OztBQVpBOzs7Ozs7Ozs7O0lBY09BLEssaURBQUFBLEs7O0FBRVAsU0FBU0MsaUJBQVQsQ0FBMkJDLElBQTNCLEVBQWdEO0FBQzlDLE1BQUksQ0FBQ0YsTUFBTUUsSUFBTixFQUFZLEVBQUNDLE1BQU0scUJBQVAsRUFBWixDQUFMLEVBQWlEO0FBQy9DLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBT0QsS0FBS0UsWUFBTCxDQUFrQkMsTUFBbEIsS0FBNkIsQ0FBcEM7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQk4saUJBQWpCIiwiZmlsZSI6Imhhc09uZURlY2xhcmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJy4vanNjb2Rlc2hpZnQnO1xuXG5jb25zdCB7bWF0Y2h9ID0ganNjcztcblxuZnVuY3Rpb24gaGFzT25lRGVjbGFyYXRpb24obm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICBpZiAoIW1hdGNoKG5vZGUsIHt0eXBlOiAnVmFyaWFibGVEZWNsYXJhdGlvbid9KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gbm9kZS5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc09uZURlY2xhcmF0aW9uO1xuIl19