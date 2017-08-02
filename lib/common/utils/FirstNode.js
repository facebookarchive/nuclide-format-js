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
  var firstObject = (0, _getRootIdentifierInExpression2.default)(path.node);
  if (firstObject && match(firstObject, { name: 'jest' })) {
    return false;
  }
  return true;
}

module.exports = FirstNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvRmlyc3ROb2RlLmpzIl0sIm5hbWVzIjpbIm1hdGNoIiwiRmlyc3ROb2RlIiwiZ2V0Iiwicm9vdCIsImZpcnN0IiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicGF0aCIsImlzVmFsaWRGaXJzdE5vZGUiLCJ0cmF2ZXJzZSIsImV4cHJlc3Npb24iLCJ2YWx1ZSIsImxpdGVyYWwiLCJ0eXBlIiwiZmlyc3RPYmplY3QiLCJub2RlIiwibmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBWUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVPQSxLLHlCQUFBQSxLLEVBakJQOzs7Ozs7Ozs7O0FBbUJBLElBQU1DLFlBQVk7QUFDaEI7Ozs7OztBQU1BQyxLQVBnQixlQU9aQyxJQVBZLEVBT2lCO0FBQy9CLFFBQUlDLGNBQUo7QUFDQSwwQkFBS0MsS0FBTCxDQUFXQyxLQUFYLENBQWlCSCxLQUFLSSxLQUFMLEdBQWEsQ0FBYixDQUFqQixFQUFrQztBQUNoQ0MsZUFEZ0MscUJBQ3RCQyxJQURzQixFQUNoQjtBQUNkLFlBQUksd0JBQVNBLElBQVQsS0FBa0JDLGlCQUFpQkQsSUFBakIsQ0FBdEIsRUFBOEM7QUFDNUMsY0FBSSxDQUFDTCxLQUFMLEVBQVk7QUFDVkEsb0JBQVFLLElBQVI7QUFDRDtBQUNELGlCQUFPLEtBQVAsQ0FKNEMsQ0FJOUI7QUFDZjtBQUNELGFBQUtFLFFBQUwsQ0FBY0YsSUFBZDtBQUNEO0FBVCtCLEtBQWxDO0FBV0EsV0FBT0wsS0FBUDtBQUNEO0FBckJlLENBQWxCOztBQXdCQSxTQUFTTSxnQkFBVCxDQUEwQkQsSUFBMUIsRUFBbUQ7QUFDakQ7QUFDQSxNQUFJVCxNQUFNUyxJQUFOLEVBQVksRUFBQ0csWUFBWSxFQUFDQyxPQUFPLGtCQUFRQyxPQUFoQixFQUFiLEVBQVosQ0FBSixFQUF5RDtBQUN2RCxXQUFPLElBQVA7QUFDRDtBQUNEO0FBQ0EsTUFBSWQsTUFBTVMsSUFBTixFQUFZLEVBQUNHLFlBQVksRUFBQ0csTUFBTSxTQUFQLEVBQWIsRUFBWixDQUFKLEVBQWtEO0FBQ2hELFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBTUMsY0FBYyw2Q0FBOEJQLEtBQUtRLElBQW5DLENBQXBCO0FBQ0EsTUFBSUQsZUFBZWhCLE1BQU1nQixXQUFOLEVBQW1CLEVBQUNFLE1BQU0sTUFBUCxFQUFuQixDQUFuQixFQUF1RDtBQUNyRCxXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCbkIsU0FBakIiLCJmaWxlIjoiRmlyc3ROb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgTmV3TGluZSBmcm9tICcuL05ld0xpbmUnO1xuaW1wb3J0IGdldFJvb3RJZGVudGlmaWVySW5FeHByZXNzaW9uIGZyb20gJy4vZ2V0Um9vdElkZW50aWZpZXJJbkV4cHJlc3Npb24nO1xuaW1wb3J0IGlzR2xvYmFsIGZyb20gJy4vaXNHbG9iYWwnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG5jb25zdCB7bWF0Y2h9ID0ganNjcztcblxuY29uc3QgRmlyc3ROb2RlID0ge1xuICAvKipcbiAgICogR2V0cyB0aGUgZmlyc3Qgbm9kZSB0aGF0IGl0J3Mgc2FmZSB0byBpbnNlcnQgYmVmb3JlIG9uLlxuICAgKlxuICAgKiBOb3RlOiBXZSBuZXZlciBuZWVkIHRvIGFkZCBhIGZpcnN0IG5vZGUuIElmIGEgZmlyc3Qgbm9kZSBkb2Vzbid0IGV4aXN0XG4gICAqIHRoZW4gdGhlcmUgaXNuJ3QgZXZlciBjb2RlIHRoYXQgd291bGQgcmVzdWx0IGluIGEgcmVxdWlyZSBiZWluZyBjaGFuZ2VkLlxuICAgKi9cbiAgZ2V0KHJvb3Q6IENvbGxlY3Rpb24pOiA/Tm9kZVBhdGgge1xuICAgIGxldCBmaXJzdDtcbiAgICBqc2NzLnR5cGVzLnZpc2l0KHJvb3Qubm9kZXMoKVswXSwge1xuICAgICAgdmlzaXROb2RlKHBhdGgpIHtcbiAgICAgICAgaWYgKGlzR2xvYmFsKHBhdGgpICYmIGlzVmFsaWRGaXJzdE5vZGUocGF0aCkpIHtcbiAgICAgICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgICAgICBmaXJzdCA9IHBhdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gc3RvcCBpdGVyYXRpbmcgdGhlIEFTVFxuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJhdmVyc2UocGF0aCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBmaXJzdDtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGlzVmFsaWRGaXJzdE5vZGUocGF0aDogTm9kZVBhdGgpOiBib29sZWFuIHtcbiAgLy8gQSBuZXcgbGluZSBsaXRlcmFsIGlzIG9rYXkuXG4gIGlmIChtYXRjaChwYXRoLCB7ZXhwcmVzc2lvbjoge3ZhbHVlOiBOZXdMaW5lLmxpdGVyYWx9fSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyBBbnkgb3RoZXIgbGl0ZXJhbCBpcyBub3QuXG4gIGlmIChtYXRjaChwYXRoLCB7ZXhwcmVzc2lvbjoge3R5cGU6ICdMaXRlcmFsJ319KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBmaXJzdE9iamVjdCA9IGdldFJvb3RJZGVudGlmaWVySW5FeHByZXNzaW9uKHBhdGgubm9kZSk7XG4gIGlmIChmaXJzdE9iamVjdCAmJiBtYXRjaChmaXJzdE9iamVjdCwge25hbWU6ICdqZXN0J30pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcnN0Tm9kZTtcbiJdfQ==