'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a hack to force an ObjectPattern node to be printed on one line
 */
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function oneLineObjectPattern(node) {
  if (!(_jscodeshift || _load_jscodeshift()).default.ObjectPattern.check(node)) {
    return node;
  }

  var props = node.properties;
  if (!props.every(function (prop) {
    return prop.shorthand && (_jscodeshift || _load_jscodeshift()).default.Identifier.check(prop.key);
  })) {
    return node;
  }

  var mySource = 'var {' + props.map(function (prop) {
    return prop.key.name;
  }).join(', ') + '} = _;';
  var myAst = (0, (_jscodeshift || _load_jscodeshift()).default)(mySource);
  return myAst.find((_jscodeshift || _load_jscodeshift()).default.ObjectPattern).nodes()[0];
}

module.exports = oneLineObjectPattern;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvb25lTGluZU9iamVjdFBhdHRlcm4uanMiXSwibmFtZXMiOlsib25lTGluZU9iamVjdFBhdHRlcm4iLCJub2RlIiwiT2JqZWN0UGF0dGVybiIsImNoZWNrIiwicHJvcHMiLCJwcm9wZXJ0aWVzIiwiZXZlcnkiLCJwcm9wIiwic2hvcnRoYW5kIiwiSWRlbnRpZmllciIsImtleSIsIm15U291cmNlIiwibWFwIiwibmFtZSIsImpvaW4iLCJteUFzdCIsImZpbmQiLCJub2RlcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTtBQUFBO0FBQUE7Ozs7QUFFQTs7O0FBZEE7Ozs7Ozs7Ozs7QUFpQkEsU0FBU0Esb0JBQVQsQ0FBOEJDLElBQTlCLEVBQWdEO0FBQzlDLE1BQUksQ0FBQyw4Q0FBS0MsYUFBTCxDQUFtQkMsS0FBbkIsQ0FBeUJGLElBQXpCLENBQUwsRUFBcUM7QUFDbkMsV0FBT0EsSUFBUDtBQUNEOztBQUVELE1BQU1HLFFBQVFILEtBQUtJLFVBQW5CO0FBQ0EsTUFBSSxDQUFDRCxNQUFNRSxLQUFOLENBQVk7QUFBQSxXQUFRQyxLQUFLQyxTQUFMLElBQWtCLDhDQUFLQyxVQUFMLENBQWdCTixLQUFoQixDQUFzQkksS0FBS0csR0FBM0IsQ0FBMUI7QUFBQSxHQUFaLENBQUwsRUFBNkU7QUFDM0UsV0FBT1QsSUFBUDtBQUNEOztBQUVELE1BQU1VLFdBQ0osVUFDQVAsTUFBTVEsR0FBTixDQUFVO0FBQUEsV0FBUUwsS0FBS0csR0FBTCxDQUFTRyxJQUFqQjtBQUFBLEdBQVYsRUFBaUNDLElBQWpDLENBQXNDLElBQXRDLENBREEsR0FFQSxRQUhGO0FBSUEsTUFBTUMsUUFBUSxtREFBS0osUUFBTCxDQUFkO0FBQ0EsU0FBT0ksTUFBTUMsSUFBTixDQUFXLDhDQUFLZCxhQUFoQixFQUErQmUsS0FBL0IsR0FBdUMsQ0FBdkMsQ0FBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCbkIsb0JBQWpCIiwiZmlsZSI6Im9uZUxpbmVPYmplY3RQYXR0ZXJuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcblxuLyoqXG4gKiBUaGlzIGlzIGEgaGFjayB0byBmb3JjZSBhbiBPYmplY3RQYXR0ZXJuIG5vZGUgdG8gYmUgcHJpbnRlZCBvbiBvbmUgbGluZVxuICovXG5mdW5jdGlvbiBvbmVMaW5lT2JqZWN0UGF0dGVybihub2RlOiBOb2RlKTogTm9kZSB7XG4gIGlmICghanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjb25zdCBwcm9wcyA9IG5vZGUucHJvcGVydGllcztcbiAgaWYgKCFwcm9wcy5ldmVyeShwcm9wID0+IHByb3Auc2hvcnRoYW5kICYmIGpzY3MuSWRlbnRpZmllci5jaGVjayhwcm9wLmtleSkpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjb25zdCBteVNvdXJjZSA9XG4gICAgJ3ZhciB7JyArXG4gICAgcHJvcHMubWFwKHByb3AgPT4gcHJvcC5rZXkubmFtZSkuam9pbignLCAnKSArXG4gICAgJ30gPSBfOyc7XG4gIGNvbnN0IG15QXN0ID0ganNjcyhteVNvdXJjZSk7XG4gIHJldHVybiBteUFzdC5maW5kKGpzY3MuT2JqZWN0UGF0dGVybikubm9kZXMoKVswXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvbmVMaW5lT2JqZWN0UGF0dGVybjtcbiJdfQ==