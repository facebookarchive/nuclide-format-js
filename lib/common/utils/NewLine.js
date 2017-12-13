'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module helps support a hack to easily introduce new lines into the AST.
 */
var NewLine = {
  literal: '$$newline$$',
  replace: function replace(input) {
    /**
     * This regex functions by matching:
     *
     *   - contiguous new lines
     *   - non new line characters
     *   - the string "$$newline$$" and surrounding characters
     *   - non new line characters
     *   - contiguous new lines
     *
     * This way it only removes extra new lines around the explicit new lines
     * we have added in the file. It does not remove arbitrary extra new lines.
     */
    return input.replace(/(\n*[^\n]*\$\$newline\$\$[^\n]*\n*){1,}/g, '\n\n');
  },

  get statement() {
    return (_jscodeshift || _load_jscodeshift()).default.expressionStatement((_jscodeshift || _load_jscodeshift()).default.literal(NewLine.literal));
  }
}; /*
    * Copyright (c) 2015-present, Facebook, Inc.
    * All rights reserved.
    *
    * This source code is licensed under the license found in the LICENSE file in
    * the root directory of this source tree.
    *
    * 
    */

module.exports = NewLine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvTmV3TGluZS5qcyJdLCJuYW1lcyI6WyJOZXdMaW5lIiwibGl0ZXJhbCIsInJlcGxhY2UiLCJpbnB1dCIsInN0YXRlbWVudCIsImV4cHJlc3Npb25TdGF0ZW1lbnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBVUE7QUFBQTtBQUFBOzs7O0FBRUE7OztBQUdBLElBQU1BLFVBQVU7QUFDZEMsV0FBUyxhQURLO0FBRWRDLFNBRmMsbUJBRU5DLEtBRk0sRUFFaUI7QUFDN0I7Ozs7Ozs7Ozs7OztBQVlBLFdBQU9BLE1BQU1ELE9BQU4sQ0FBYywwQ0FBZCxFQUEwRCxNQUExRCxDQUFQO0FBQ0QsR0FoQmE7O0FBaUJkLE1BQUlFLFNBQUosR0FBZ0I7QUFDZCxXQUFPLDhDQUFLQyxtQkFBTCxDQUF5Qiw4Q0FBS0osT0FBTCxDQUFhRCxRQUFRQyxPQUFyQixDQUF6QixDQUFQO0FBQ0Q7QUFuQmEsQ0FBaEIsQyxDQWZBOzs7Ozs7Ozs7O0FBcUNBSyxPQUFPQyxPQUFQLEdBQWlCUCxPQUFqQiIsImZpbGUiOiJOZXdMaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGhlbHBzIHN1cHBvcnQgYSBoYWNrIHRvIGVhc2lseSBpbnRyb2R1Y2UgbmV3IGxpbmVzIGludG8gdGhlIEFTVC5cbiAqL1xuY29uc3QgTmV3TGluZSA9IHtcbiAgbGl0ZXJhbDogJyQkbmV3bGluZSQkJyxcbiAgcmVwbGFjZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvKipcbiAgICAgKiBUaGlzIHJlZ2V4IGZ1bmN0aW9ucyBieSBtYXRjaGluZzpcbiAgICAgKlxuICAgICAqICAgLSBjb250aWd1b3VzIG5ldyBsaW5lc1xuICAgICAqICAgLSBub24gbmV3IGxpbmUgY2hhcmFjdGVyc1xuICAgICAqICAgLSB0aGUgc3RyaW5nIFwiJCRuZXdsaW5lJCRcIiBhbmQgc3Vycm91bmRpbmcgY2hhcmFjdGVyc1xuICAgICAqICAgLSBub24gbmV3IGxpbmUgY2hhcmFjdGVyc1xuICAgICAqICAgLSBjb250aWd1b3VzIG5ldyBsaW5lc1xuICAgICAqXG4gICAgICogVGhpcyB3YXkgaXQgb25seSByZW1vdmVzIGV4dHJhIG5ldyBsaW5lcyBhcm91bmQgdGhlIGV4cGxpY2l0IG5ldyBsaW5lc1xuICAgICAqIHdlIGhhdmUgYWRkZWQgaW4gdGhlIGZpbGUuIEl0IGRvZXMgbm90IHJlbW92ZSBhcmJpdHJhcnkgZXh0cmEgbmV3IGxpbmVzLlxuICAgICAqL1xuICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC8oXFxuKlteXFxuXSpcXCRcXCRuZXdsaW5lXFwkXFwkW15cXG5dKlxcbiopezEsfS9nLCAnXFxuXFxuJyk7XG4gIH0sXG4gIGdldCBzdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIGpzY3MuZXhwcmVzc2lvblN0YXRlbWVudChqc2NzLmxpdGVyYWwoTmV3TGluZS5saXRlcmFsKSk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0xpbmU7XG4iXX0=