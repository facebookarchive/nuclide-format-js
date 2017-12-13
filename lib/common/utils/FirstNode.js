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
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvRmlyc3ROb2RlLmpzIl0sIm5hbWVzIjpbIm1hdGNoIiwiRmlyc3ROb2RlIiwiZ2V0Iiwicm9vdCIsImZpcnN0IiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicGF0aCIsImlzVmFsaWRGaXJzdE5vZGUiLCJ0cmF2ZXJzZSIsImV4cHJlc3Npb24iLCJ2YWx1ZSIsImxpdGVyYWwiLCJ0eXBlIiwicm9vdElkZW50aWZpZXIiLCJub2RlIiwibmFtZSIsIk1lbWJlckV4cHJlc3Npb24iLCJjaGVjayIsInBhcmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7SUFFT0EsSyxpREFBQUEsSyxFQWpCUDs7Ozs7Ozs7OztBQW1CQSxJQUFNQyxZQUFZO0FBQ2hCOzs7Ozs7QUFNQUMsS0FQZ0IsZUFPWkMsSUFQWSxFQU9pQjtBQUMvQixRQUFJQyxjQUFKO0FBQ0Esa0RBQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQkgsS0FBS0ksS0FBTCxHQUFhLENBQWIsQ0FBakIsRUFBa0M7QUFDaENDLGVBRGdDLHFCQUN0QkMsSUFEc0IsRUFDaEI7QUFDZCxZQUFJLDZDQUFTQSxJQUFULEtBQWtCQyxpQkFBaUJELElBQWpCLENBQXRCLEVBQThDO0FBQzVDLGNBQUksQ0FBQ0wsS0FBTCxFQUFZO0FBQ1ZBLG9CQUFRSyxJQUFSO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQLENBSjRDLENBSTlCO0FBQ2Y7QUFDRCxhQUFLRSxRQUFMLENBQWNGLElBQWQ7QUFDRDtBQVQrQixLQUFsQztBQVdBLFdBQU9MLEtBQVA7QUFDRDtBQXJCZSxDQUFsQjs7QUF3QkEsU0FBU00sZ0JBQVQsQ0FBMEJELElBQTFCLEVBQW1EO0FBQ2pEO0FBQ0EsTUFBSVQsTUFBTVMsSUFBTixFQUFZLEVBQUNHLFlBQVksRUFBQ0MsT0FBTyxzQ0FBUUMsT0FBaEIsRUFBYixFQUFaLENBQUosRUFBeUQ7QUFDdkQsV0FBTyxJQUFQO0FBQ0Q7QUFDRDtBQUNBLE1BQUlkLE1BQU1TLElBQU4sRUFBWSxFQUFDRyxZQUFZLEVBQUNHLE1BQU0sU0FBUCxFQUFiLEVBQVosQ0FBSixFQUFrRDtBQUNoRCxXQUFPLEtBQVA7QUFDRDtBQUNELE1BQU1DLGlCQUFpQix1RkFBOEJQLEtBQUtRLElBQW5DLENBQXZCO0FBQ0EsTUFDRUQsbUJBQ0VBLGVBQWVFLElBQWYsS0FBd0IsTUFBeEIsSUFDQ0YsZUFBZUUsSUFBZixLQUF3QixTQUF4QixJQUFxQyw4Q0FBS0MsZ0JBQUwsQ0FBc0JDLEtBQXRCLENBQTRCSixlQUFlSyxNQUEzQyxDQUZ4QyxDQURGLEVBS0U7QUFDQSxXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCdEIsU0FBakIiLCJmaWxlIjoiRmlyc3ROb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgTmV3TGluZSBmcm9tICcuL05ld0xpbmUnO1xuaW1wb3J0IGdldFJvb3RJZGVudGlmaWVySW5FeHByZXNzaW9uIGZyb20gJy4vZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24nO1xuaW1wb3J0IGlzR2xvYmFsIGZyb20gJy4vaXNHbG9iYWwnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG5jb25zdCB7bWF0Y2h9ID0ganNjcztcblxuY29uc3QgRmlyc3ROb2RlID0ge1xuICAvKipcbiAgICogR2V0cyB0aGUgZmlyc3Qgbm9kZSB0aGF0IGl0J3Mgc2FmZSB0byBpbnNlcnQgYmVmb3JlIG9uLlxuICAgKlxuICAgKiBOb3RlOiBXZSBuZXZlciBuZWVkIHRvIGFkZCBhIGZpcnN0IG5vZGUuIElmIGEgZmlyc3Qgbm9kZSBkb2Vzbid0IGV4aXN0XG4gICAqIHRoZW4gdGhlcmUgaXNuJ3QgZXZlciBjb2RlIHRoYXQgd291bGQgcmVzdWx0IGluIGEgcmVxdWlyZSBiZWluZyBjaGFuZ2VkLlxuICAgKi9cbiAgZ2V0KHJvb3Q6IENvbGxlY3Rpb24pOiA/Tm9kZVBhdGgge1xuICAgIGxldCBmaXJzdDtcbiAgICBqc2NzLnR5cGVzLnZpc2l0KHJvb3Qubm9kZXMoKVswXSwge1xuICAgICAgdmlzaXROb2RlKHBhdGgpIHtcbiAgICAgICAgaWYgKGlzR2xvYmFsKHBhdGgpICYmIGlzVmFsaWRGaXJzdE5vZGUocGF0aCkpIHtcbiAgICAgICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgICAgICBmaXJzdCA9IHBhdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gc3RvcCBpdGVyYXRpbmcgdGhlIEFTVFxuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJhdmVyc2UocGF0aCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBmaXJzdDtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGlzVmFsaWRGaXJzdE5vZGUocGF0aDogTm9kZVBhdGgpOiBib29sZWFuIHtcbiAgLy8gQSBuZXcgbGluZSBsaXRlcmFsIGlzIG9rYXkuXG4gIGlmIChtYXRjaChwYXRoLCB7ZXhwcmVzc2lvbjoge3ZhbHVlOiBOZXdMaW5lLmxpdGVyYWx9fSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyBBbnkgb3RoZXIgbGl0ZXJhbCBpcyBub3QuXG4gIGlmIChtYXRjaChwYXRoLCB7ZXhwcmVzc2lvbjoge3R5cGU6ICdMaXRlcmFsJ319KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCByb290SWRlbnRpZmllciA9IGdldFJvb3RJZGVudGlmaWVySW5FeHByZXNzaW9uKHBhdGgubm9kZSk7XG4gIGlmIChcbiAgICByb290SWRlbnRpZmllciAmJiAoXG4gICAgICByb290SWRlbnRpZmllci5uYW1lID09PSAnamVzdCcgfHxcbiAgICAgIChyb290SWRlbnRpZmllci5uYW1lID09PSAncmVxdWlyZScgJiYganNjcy5NZW1iZXJFeHByZXNzaW9uLmNoZWNrKHJvb3RJZGVudGlmaWVyLnBhcmVudCkpXG4gICAgKVxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyc3ROb2RlO1xuIl19