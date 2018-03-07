'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvb25lTGluZU9iamVjdFBhdHRlcm4uanMiXSwibmFtZXMiOlsib25lTGluZU9iamVjdFBhdHRlcm4iLCJub2RlIiwiT2JqZWN0UGF0dGVybiIsImNoZWNrIiwicHJvcHMiLCJwcm9wZXJ0aWVzIiwiZXZlcnkiLCJwcm9wIiwic2hvcnRoYW5kIiwiSWRlbnRpZmllciIsImtleSIsIm15U291cmNlIiwibWFwIiwibmFtZSIsImpvaW4iLCJteUFzdCIsImZpbmQiLCJub2RlcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTtBQUFBO0FBQUE7Ozs7QUFFQTs7O0FBZEE7Ozs7Ozs7Ozs7QUFpQkEsU0FBU0Esb0JBQVQsQ0FBOEJDLElBQTlCLEVBQWdEO0FBQzlDLE1BQUksQ0FBQyw4Q0FBS0MsYUFBTCxDQUFtQkMsS0FBbkIsQ0FBeUJGLElBQXpCLENBQUwsRUFBcUM7QUFDbkMsV0FBT0EsSUFBUDtBQUNEOztBQUVELE1BQU1HLFFBQVFILEtBQUtJLFVBQW5CO0FBQ0EsTUFBSSxDQUFDRCxNQUFNRSxLQUFOLENBQVk7QUFBQSxXQUFRQyxLQUFLQyxTQUFMLElBQWtCLDhDQUFLQyxVQUFMLENBQWdCTixLQUFoQixDQUFzQkksS0FBS0csR0FBM0IsQ0FBMUI7QUFBQSxHQUFaLENBQUwsRUFBNkU7QUFDM0UsV0FBT1QsSUFBUDtBQUNEOztBQUVELE1BQU1VLFdBQ0osVUFDQVAsTUFBTVEsR0FBTixDQUFVO0FBQUEsV0FBUUwsS0FBS0csR0FBTCxDQUFTRyxJQUFqQjtBQUFBLEdBQVYsRUFBaUNDLElBQWpDLENBQXNDLElBQXRDLENBREEsR0FFQSxRQUhGO0FBSUEsTUFBTUMsUUFBUSxtREFBS0osUUFBTCxDQUFkO0FBQ0EsU0FBT0ksTUFBTUMsSUFBTixDQUFXLDhDQUFLZCxhQUFoQixFQUErQmUsS0FBL0IsR0FBdUMsQ0FBdkMsQ0FBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCbkIsb0JBQWpCIiwiZmlsZSI6Im9uZUxpbmVPYmplY3RQYXR0ZXJuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJy4vanNjb2Rlc2hpZnQnO1xuXG4vKipcbiAqIFRoaXMgaXMgYSBoYWNrIHRvIGZvcmNlIGFuIE9iamVjdFBhdHRlcm4gbm9kZSB0byBiZSBwcmludGVkIG9uIG9uZSBsaW5lXG4gKi9cbmZ1bmN0aW9uIG9uZUxpbmVPYmplY3RQYXR0ZXJuKG5vZGU6IE5vZGUpOiBOb2RlIHtcbiAgaWYgKCFqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNvbnN0IHByb3BzID0gbm9kZS5wcm9wZXJ0aWVzO1xuICBpZiAoIXByb3BzLmV2ZXJ5KHByb3AgPT4gcHJvcC5zaG9ydGhhbmQgJiYganNjcy5JZGVudGlmaWVyLmNoZWNrKHByb3Aua2V5KSkpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNvbnN0IG15U291cmNlID1cbiAgICAndmFyIHsnICtcbiAgICBwcm9wcy5tYXAocHJvcCA9PiBwcm9wLmtleS5uYW1lKS5qb2luKCcsICcpICtcbiAgICAnfSA9IF87JztcbiAgY29uc3QgbXlBc3QgPSBqc2NzKG15U291cmNlKTtcbiAgcmV0dXJuIG15QXN0LmZpbmQoanNjcy5PYmplY3RQYXR0ZXJuKS5ub2RlcygpWzBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uZUxpbmVPYmplY3RQYXR0ZXJuO1xuIl19