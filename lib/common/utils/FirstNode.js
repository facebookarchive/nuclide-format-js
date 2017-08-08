'use strict';

var _NewLine = require('./NewLine');

var _NewLine2 = _interopRequireDefault(_NewLine);

var _getRootIdentifierInExpression = require('./getRootIdentifierInExpression');

var _getRootIdentifierInExpression2 = _interopRequireDefault(_getRootIdentifierInExpression);

var _isGlobal = require('./isGlobal');

var _isGlobal2 = _interopRequireDefault(_isGlobal);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var match = _jscodeshift2.default.match; /*
                                          * Copyright (c) 2015-present, Facebook, Inc.
                                          * All rights reserved.
                                          *
                                          * This source code is licensed under the license found in the LICENSE file in
                                          * the root directory of this source tree.
                                          *
                                          * 
                                          */

var FirstNode = {
  /**
   * Gets the first node that it's safe to insert before on.
   *
   * Note: We never need to add a first node. If a first node doesn't exist
   * then there isn't ever code that would result in a require being changed.
   */
  get: function get(root) {
    var first = void 0;
    _jscodeshift2.default.types.visit(root.nodes()[0], {
      visitNode: function visitNode(path) {
        if ((0, _isGlobal2.default)(path) && isValidFirstNode(path)) {
          if (!first) {
            first = path;
          }
          return false; // stop iterating the AST
        }
        this.traverse(path);
      }
    });
    return first;
  }
};

function isValidFirstNode(path) {
  // A new line literal is okay.
  if (match(path, { expression: { value: _NewLine2.default.literal } })) {
    return true;
  }
  // Any other literal is not.
  if (match(path, { expression: { type: 'Literal' } })) {
    return false;
  }
  var rootIdentifier = (0, _getRootIdentifierInExpression2.default)(path.node);
  if (rootIdentifier && (rootIdentifier.name === 'jest' || rootIdentifier.name === 'require' && _jscodeshift2.default.MemberExpression.check(rootIdentifier.parent))) {
    return false;
  }
  return true;
}

module.exports = FirstNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvRmlyc3ROb2RlLmpzIl0sIm5hbWVzIjpbIm1hdGNoIiwiRmlyc3ROb2RlIiwiZ2V0Iiwicm9vdCIsImZpcnN0IiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicGF0aCIsImlzVmFsaWRGaXJzdE5vZGUiLCJ0cmF2ZXJzZSIsImV4cHJlc3Npb24iLCJ2YWx1ZSIsImxpdGVyYWwiLCJ0eXBlIiwicm9vdElkZW50aWZpZXIiLCJub2RlIiwibmFtZSIsIk1lbWJlckV4cHJlc3Npb24iLCJjaGVjayIsInBhcmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBWUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVPQSxLLHlCQUFBQSxLLEVBakJQOzs7Ozs7Ozs7O0FBbUJBLElBQU1DLFlBQVk7QUFDaEI7Ozs7OztBQU1BQyxLQVBnQixlQU9aQyxJQVBZLEVBT2lCO0FBQy9CLFFBQUlDLGNBQUo7QUFDQSwwQkFBS0MsS0FBTCxDQUFXQyxLQUFYLENBQWlCSCxLQUFLSSxLQUFMLEdBQWEsQ0FBYixDQUFqQixFQUFrQztBQUNoQ0MsZUFEZ0MscUJBQ3RCQyxJQURzQixFQUNoQjtBQUNkLFlBQUksd0JBQVNBLElBQVQsS0FBa0JDLGlCQUFpQkQsSUFBakIsQ0FBdEIsRUFBOEM7QUFDNUMsY0FBSSxDQUFDTCxLQUFMLEVBQVk7QUFDVkEsb0JBQVFLLElBQVI7QUFDRDtBQUNELGlCQUFPLEtBQVAsQ0FKNEMsQ0FJOUI7QUFDZjtBQUNELGFBQUtFLFFBQUwsQ0FBY0YsSUFBZDtBQUNEO0FBVCtCLEtBQWxDO0FBV0EsV0FBT0wsS0FBUDtBQUNEO0FBckJlLENBQWxCOztBQXdCQSxTQUFTTSxnQkFBVCxDQUEwQkQsSUFBMUIsRUFBbUQ7QUFDakQ7QUFDQSxNQUFJVCxNQUFNUyxJQUFOLEVBQVksRUFBQ0csWUFBWSxFQUFDQyxPQUFPLGtCQUFRQyxPQUFoQixFQUFiLEVBQVosQ0FBSixFQUF5RDtBQUN2RCxXQUFPLElBQVA7QUFDRDtBQUNEO0FBQ0EsTUFBSWQsTUFBTVMsSUFBTixFQUFZLEVBQUNHLFlBQVksRUFBQ0csTUFBTSxTQUFQLEVBQWIsRUFBWixDQUFKLEVBQWtEO0FBQ2hELFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBTUMsaUJBQWlCLDZDQUE4QlAsS0FBS1EsSUFBbkMsQ0FBdkI7QUFDQSxNQUNFRCxtQkFDRUEsZUFBZUUsSUFBZixLQUF3QixNQUF4QixJQUNDRixlQUFlRSxJQUFmLEtBQXdCLFNBQXhCLElBQXFDLHNCQUFLQyxnQkFBTCxDQUFzQkMsS0FBdEIsQ0FBNEJKLGVBQWVLLE1BQTNDLENBRnhDLENBREYsRUFLRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUJ0QixTQUFqQiIsImZpbGUiOiJGaXJzdE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbiwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBOZXdMaW5lIGZyb20gJy4vTmV3TGluZSc7XG5pbXBvcnQgZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24gZnJvbSAnLi9nZXRSb290SWRlbnRpZmllckluRXhwcmVzc2lvbic7XG5pbXBvcnQgaXNHbG9iYWwgZnJvbSAnLi9pc0dsb2JhbCc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5cbmNvbnN0IHttYXRjaH0gPSBqc2NzO1xuXG5jb25zdCBGaXJzdE5vZGUgPSB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmaXJzdCBub2RlIHRoYXQgaXQncyBzYWZlIHRvIGluc2VydCBiZWZvcmUgb24uXG4gICAqXG4gICAqIE5vdGU6IFdlIG5ldmVyIG5lZWQgdG8gYWRkIGEgZmlyc3Qgbm9kZS4gSWYgYSBmaXJzdCBub2RlIGRvZXNuJ3QgZXhpc3RcbiAgICogdGhlbiB0aGVyZSBpc24ndCBldmVyIGNvZGUgdGhhdCB3b3VsZCByZXN1bHQgaW4gYSByZXF1aXJlIGJlaW5nIGNoYW5nZWQuXG4gICAqL1xuICBnZXQocm9vdDogQ29sbGVjdGlvbik6ID9Ob2RlUGF0aCB7XG4gICAgbGV0IGZpcnN0O1xuICAgIGpzY3MudHlwZXMudmlzaXQocm9vdC5ub2RlcygpWzBdLCB7XG4gICAgICB2aXNpdE5vZGUocGF0aCkge1xuICAgICAgICBpZiAoaXNHbG9iYWwocGF0aCkgJiYgaXNWYWxpZEZpcnN0Tm9kZShwYXRoKSkge1xuICAgICAgICAgIGlmICghZmlyc3QpIHtcbiAgICAgICAgICAgIGZpcnN0ID0gcGF0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBzdG9wIGl0ZXJhdGluZyB0aGUgQVNUXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9LFxufTtcblxuZnVuY3Rpb24gaXNWYWxpZEZpcnN0Tm9kZShwYXRoOiBOb2RlUGF0aCk6IGJvb2xlYW4ge1xuICAvLyBBIG5ldyBsaW5lIGxpdGVyYWwgaXMgb2theS5cbiAgaWYgKG1hdGNoKHBhdGgsIHtleHByZXNzaW9uOiB7dmFsdWU6IE5ld0xpbmUubGl0ZXJhbH19KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIEFueSBvdGhlciBsaXRlcmFsIGlzIG5vdC5cbiAgaWYgKG1hdGNoKHBhdGgsIHtleHByZXNzaW9uOiB7dHlwZTogJ0xpdGVyYWwnfX0pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHJvb3RJZGVudGlmaWVyID0gZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24ocGF0aC5ub2RlKTtcbiAgaWYgKFxuICAgIHJvb3RJZGVudGlmaWVyICYmIChcbiAgICAgIHJvb3RJZGVudGlmaWVyLm5hbWUgPT09ICdqZXN0JyB8fFxuICAgICAgKHJvb3RJZGVudGlmaWVyLm5hbWUgPT09ICdyZXF1aXJlJyAmJiBqc2NzLk1lbWJlckV4cHJlc3Npb24uY2hlY2socm9vdElkZW50aWZpZXIucGFyZW50KSlcbiAgICApXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaXJzdE5vZGU7XG4iXX0=