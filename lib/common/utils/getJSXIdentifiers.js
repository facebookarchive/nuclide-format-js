'use strict';

var _getJSXIdentifierName = require('./getJSXIdentifierName');

var _getJSXIdentifierName2 = _interopRequireDefault(_getJSXIdentifierName);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This will get a list of identifiers for JSXElements in the AST
 */
function getJSXIdentifiers(root) {
  var ids = new Set();
  root
  // There should be an opening element for every single closing element so
  // we can just look for opening ones
  .find(_jscodeshift2.default.JSXOpeningElement).forEach(function (path) {
    (0, _getJSXIdentifierName2.default)(path).forEach(function (node) {
      ids.add(node.name);
    });
  });
  return ids;
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = getJSXIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0SlNYSWRlbnRpZmllcnMuanMiXSwibmFtZXMiOlsiZ2V0SlNYSWRlbnRpZmllcnMiLCJyb290IiwiaWRzIiwiU2V0IiwiZmluZCIsIkpTWE9wZW5pbmdFbGVtZW50IiwiZm9yRWFjaCIsInBhdGgiLCJhZGQiLCJub2RlIiwibmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBWUE7Ozs7QUFDQTs7Ozs7O0FBRUE7OztBQUdBLFNBQVNBLGlCQUFULENBQTJCQyxJQUEzQixFQUEwRDtBQUN4RCxNQUFNQyxNQUFNLElBQUlDLEdBQUosRUFBWjtBQUNBRjtBQUNFO0FBQ0E7QUFGRixHQUdHRyxJQUhILENBR1Esc0JBQUtDLGlCQUhiLEVBSUdDLE9BSkgsQ0FJVyxnQkFBUTtBQUNmLHdDQUFxQkMsSUFBckIsRUFBMkJELE9BQTNCLENBQW1DLGdCQUFRO0FBQ3pDSixVQUFJTSxHQUFKLENBQVFDLEtBQUtDLElBQWI7QUFDRCxLQUZEO0FBR0QsR0FSSDtBQVNBLFNBQU9SLEdBQVA7QUFDRCxDLENBOUJEOzs7Ozs7Ozs7O0FBZ0NBUyxPQUFPQyxPQUFQLEdBQWlCWixpQkFBakIiLCJmaWxlIjoiZ2V0SlNYSWRlbnRpZmllcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbn0gZnJvbSAnLi4vdHlwZXMvYXN0JztcblxuaW1wb3J0IGdldEpTWElkZW50aWZpZXJOYW1lIGZyb20gJy4vZ2V0SlNYSWRlbnRpZmllck5hbWUnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG4vKipcbiAqIFRoaXMgd2lsbCBnZXQgYSBsaXN0IG9mIGlkZW50aWZpZXJzIGZvciBKU1hFbGVtZW50cyBpbiB0aGUgQVNUXG4gKi9cbmZ1bmN0aW9uIGdldEpTWElkZW50aWZpZXJzKHJvb3Q6IENvbGxlY3Rpb24pOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgcm9vdFxuICAgIC8vIFRoZXJlIHNob3VsZCBiZSBhbiBvcGVuaW5nIGVsZW1lbnQgZm9yIGV2ZXJ5IHNpbmdsZSBjbG9zaW5nIGVsZW1lbnQgc29cbiAgICAvLyB3ZSBjYW4ganVzdCBsb29rIGZvciBvcGVuaW5nIG9uZXNcbiAgICAuZmluZChqc2NzLkpTWE9wZW5pbmdFbGVtZW50KVxuICAgIC5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgZ2V0SlNYSWRlbnRpZmllck5hbWUocGF0aCkuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgaWRzLmFkZChub2RlLm5hbWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SlNYSWRlbnRpZmllcnM7XG4iXX0=