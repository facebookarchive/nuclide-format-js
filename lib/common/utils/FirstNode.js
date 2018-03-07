'use strict';

var _NewLine;

function _load_NewLine() {
  return _NewLine = _interopRequireDefault(require('./NewLine'));
}

var _getRootIdentifierInExpression;

function _load_getRootIdentifierInExpression() {
  return _getRootIdentifierInExpression = _interopRequireDefault(require('./getRootIdentifierInExpression'));
}

var _isGlobal;

function _load_isGlobal() {
  return _isGlobal = _interopRequireDefault(require('./isGlobal'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var match = (_jscodeshift || _load_jscodeshift()).default.match; /*
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
    (_jscodeshift || _load_jscodeshift()).default.types.visit(root.nodes()[0], {
      visitNode: function visitNode(path) {
        if ((0, (_isGlobal || _load_isGlobal()).default)(path) && isValidFirstNode(path)) {
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
  if (match(path, { expression: { value: (_NewLine || _load_NewLine()).default.literal } })) {
    return true;
  }
  // Any other literal is not.
  if (match(path, { expression: { type: 'Literal' } })) {
    return false;
  }
  var rootIdentifier = (0, (_getRootIdentifierInExpression || _load_getRootIdentifierInExpression()).default)(path.node);
  if (rootIdentifier && (rootIdentifier.name === 'jest' || rootIdentifier.name === 'require' && (_jscodeshift || _load_jscodeshift()).default.MemberExpression.check(rootIdentifier.parent))) {
    return false;
  }
  return true;
}

module.exports = FirstNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvRmlyc3ROb2RlLmpzIl0sIm5hbWVzIjpbIm1hdGNoIiwiRmlyc3ROb2RlIiwiZ2V0Iiwicm9vdCIsImZpcnN0IiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicGF0aCIsImlzVmFsaWRGaXJzdE5vZGUiLCJ0cmF2ZXJzZSIsImV4cHJlc3Npb24iLCJ2YWx1ZSIsImxpdGVyYWwiLCJ0eXBlIiwicm9vdElkZW50aWZpZXIiLCJub2RlIiwibmFtZSIsIk1lbWJlckV4cHJlc3Npb24iLCJjaGVjayIsInBhcmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7SUFFT0EsSyxpREFBQUEsSyxFQWpCUDs7Ozs7Ozs7OztBQW1CQSxJQUFNQyxZQUFZO0FBQ2hCOzs7Ozs7QUFNQUMsS0FQZ0IsZUFPWkMsSUFQWSxFQU9pQjtBQUMvQixRQUFJQyxjQUFKO0FBQ0Esa0RBQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQkgsS0FBS0ksS0FBTCxHQUFhLENBQWIsQ0FBakIsRUFBa0M7QUFDaENDLGVBRGdDLHFCQUN0QkMsSUFEc0IsRUFDaEI7QUFDZCxZQUFJLDZDQUFTQSxJQUFULEtBQWtCQyxpQkFBaUJELElBQWpCLENBQXRCLEVBQThDO0FBQzVDLGNBQUksQ0FBQ0wsS0FBTCxFQUFZO0FBQ1ZBLG9CQUFRSyxJQUFSO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQLENBSjRDLENBSTlCO0FBQ2Y7QUFDRCxhQUFLRSxRQUFMLENBQWNGLElBQWQ7QUFDRDtBQVQrQixLQUFsQztBQVdBLFdBQU9MLEtBQVA7QUFDRDtBQXJCZSxDQUFsQjs7QUF3QkEsU0FBU00sZ0JBQVQsQ0FBMEJELElBQTFCLEVBQW1EO0FBQ2pEO0FBQ0EsTUFBSVQsTUFBTVMsSUFBTixFQUFZLEVBQUNHLFlBQVksRUFBQ0MsT0FBTyxzQ0FBUUMsT0FBaEIsRUFBYixFQUFaLENBQUosRUFBeUQ7QUFDdkQsV0FBTyxJQUFQO0FBQ0Q7QUFDRDtBQUNBLE1BQUlkLE1BQU1TLElBQU4sRUFBWSxFQUFDRyxZQUFZLEVBQUNHLE1BQU0sU0FBUCxFQUFiLEVBQVosQ0FBSixFQUFrRDtBQUNoRCxXQUFPLEtBQVA7QUFDRDtBQUNELE1BQU1DLGlCQUFpQix1RkFBOEJQLEtBQUtRLElBQW5DLENBQXZCO0FBQ0EsTUFDRUQsbUJBQ0VBLGVBQWVFLElBQWYsS0FBd0IsTUFBeEIsSUFDQ0YsZUFBZUUsSUFBZixLQUF3QixTQUF4QixJQUFxQyw4Q0FBS0MsZ0JBQUwsQ0FBc0JDLEtBQXRCLENBQTRCSixlQUFlSyxNQUEzQyxDQUZ4QyxDQURGLEVBS0U7QUFDQSxXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCdEIsU0FBakIiLCJmaWxlIjoiRmlyc3ROb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgTmV3TGluZSBmcm9tICcuL05ld0xpbmUnO1xuaW1wb3J0IGdldFJvb3RJZGVudGlmaWVySW5FeHByZXNzaW9uIGZyb20gJy4vZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24nO1xuaW1wb3J0IGlzR2xvYmFsIGZyb20gJy4vaXNHbG9iYWwnO1xuaW1wb3J0IGpzY3MgZnJvbSAnLi9qc2NvZGVzaGlmdCc7XG5cbmNvbnN0IHttYXRjaH0gPSBqc2NzO1xuXG5jb25zdCBGaXJzdE5vZGUgPSB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmaXJzdCBub2RlIHRoYXQgaXQncyBzYWZlIHRvIGluc2VydCBiZWZvcmUgb24uXG4gICAqXG4gICAqIE5vdGU6IFdlIG5ldmVyIG5lZWQgdG8gYWRkIGEgZmlyc3Qgbm9kZS4gSWYgYSBmaXJzdCBub2RlIGRvZXNuJ3QgZXhpc3RcbiAgICogdGhlbiB0aGVyZSBpc24ndCBldmVyIGNvZGUgdGhhdCB3b3VsZCByZXN1bHQgaW4gYSByZXF1aXJlIGJlaW5nIGNoYW5nZWQuXG4gICAqL1xuICBnZXQocm9vdDogQ29sbGVjdGlvbik6ID9Ob2RlUGF0aCB7XG4gICAgbGV0IGZpcnN0O1xuICAgIGpzY3MudHlwZXMudmlzaXQocm9vdC5ub2RlcygpWzBdLCB7XG4gICAgICB2aXNpdE5vZGUocGF0aCkge1xuICAgICAgICBpZiAoaXNHbG9iYWwocGF0aCkgJiYgaXNWYWxpZEZpcnN0Tm9kZShwYXRoKSkge1xuICAgICAgICAgIGlmICghZmlyc3QpIHtcbiAgICAgICAgICAgIGZpcnN0ID0gcGF0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBzdG9wIGl0ZXJhdGluZyB0aGUgQVNUXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9LFxufTtcblxuZnVuY3Rpb24gaXNWYWxpZEZpcnN0Tm9kZShwYXRoOiBOb2RlUGF0aCk6IGJvb2xlYW4ge1xuICAvLyBBIG5ldyBsaW5lIGxpdGVyYWwgaXMgb2theS5cbiAgaWYgKG1hdGNoKHBhdGgsIHtleHByZXNzaW9uOiB7dmFsdWU6IE5ld0xpbmUubGl0ZXJhbH19KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIEFueSBvdGhlciBsaXRlcmFsIGlzIG5vdC5cbiAgaWYgKG1hdGNoKHBhdGgsIHtleHByZXNzaW9uOiB7dHlwZTogJ0xpdGVyYWwnfX0pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHJvb3RJZGVudGlmaWVyID0gZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24ocGF0aC5ub2RlKTtcbiAgaWYgKFxuICAgIHJvb3RJZGVudGlmaWVyICYmIChcbiAgICAgIHJvb3RJZGVudGlmaWVyLm5hbWUgPT09ICdqZXN0JyB8fFxuICAgICAgKHJvb3RJZGVudGlmaWVyLm5hbWUgPT09ICdyZXF1aXJlJyAmJiBqc2NzLk1lbWJlckV4cHJlc3Npb24uY2hlY2socm9vdElkZW50aWZpZXIucGFyZW50KSlcbiAgICApXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaXJzdE5vZGU7XG4iXX0=