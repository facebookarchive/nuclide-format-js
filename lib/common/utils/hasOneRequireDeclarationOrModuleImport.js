'use strict';

var _hasOneDeclaration;

function _load_hasOneDeclaration() {
  return _hasOneDeclaration = _interopRequireDefault(require('./hasOneDeclaration'));
}

var _isRequireExpression;

function _load_isRequireExpression() {
  return _isRequireExpression = _interopRequireDefault(require('./isRequireExpression'));
}

var _isValueImport;

function _load_isValueImport() {
  return _isValueImport = _interopRequireDefault(require('../utils/isValueImport'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasOneRequireDeclarationOrModuleImport(node) {
  if ((_jscodeshift || _load_jscodeshift()).default.ImportDeclaration.check(node) && (0, (_isValueImport || _load_isValueImport()).default)(node) && node.specifiers.length > 0) {
    return true;
  }
  if (!(0, (_hasOneDeclaration || _load_hasOneDeclaration()).default)(node)) {
    return false;
  }
  var declaration = node.declarations[0];
  return (0, (_isRequireExpression || _load_isRequireExpression()).default)(declaration.init);
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = hasOneRequireDeclarationOrModuleImport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQuanMiXSwibmFtZXMiOlsiaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQiLCJub2RlIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJjaGVjayIsInNwZWNpZmllcnMiLCJsZW5ndGgiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsImluaXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBRUEsU0FBU0Esc0NBQVQsQ0FBZ0RDLElBQWhELEVBQXFFO0FBQ25FLE1BQ0UsOENBQUtDLGlCQUFMLENBQXVCQyxLQUF2QixDQUE2QkYsSUFBN0IsS0FDQSx1REFBY0EsSUFBZCxDQURBLElBRUFBLEtBQUtHLFVBQUwsQ0FBZ0JDLE1BQWhCLEdBQXlCLENBSDNCLEVBSUU7QUFDQSxXQUFPLElBQVA7QUFDRDtBQUNELE1BQUksQ0FBQywrREFBa0JKLElBQWxCLENBQUwsRUFBOEI7QUFDNUIsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxNQUFNSyxjQUFjTCxLQUFLTSxZQUFMLENBQWtCLENBQWxCLENBQXBCO0FBQ0EsU0FBTyxtRUFBb0JELFlBQVlFLElBQWhDLENBQVA7QUFDRCxDLENBOUJEOzs7Ozs7Ozs7O0FBZ0NBQyxPQUFPQyxPQUFQLEdBQWlCVixzQ0FBakIiLCJmaWxlIjoiaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZX0gZnJvbSAnLi4vdHlwZXMvYXN0JztcblxuaW1wb3J0IGhhc09uZURlY2xhcmF0aW9uIGZyb20gJy4vaGFzT25lRGVjbGFyYXRpb24nO1xuaW1wb3J0IGlzUmVxdWlyZUV4cHJlc3Npb24gZnJvbSAnLi9pc1JlcXVpcmVFeHByZXNzaW9uJztcbmltcG9ydCBpc1ZhbHVlSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVmFsdWVJbXBvcnQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG5mdW5jdGlvbiBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydChub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIGlmIChcbiAgICBqc2NzLkltcG9ydERlY2xhcmF0aW9uLmNoZWNrKG5vZGUpICYmXG4gICAgaXNWYWx1ZUltcG9ydChub2RlKSAmJlxuICAgIG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPiAwXG4gICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICghaGFzT25lRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgcmV0dXJuIGlzUmVxdWlyZUV4cHJlc3Npb24oZGVjbGFyYXRpb24uaW5pdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQ7XG4iXX0=