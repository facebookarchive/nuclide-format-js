'use strict';

var _NewLine = require('./NewLine');

var _NewLine2 = _interopRequireDefault(_NewLine);

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

function printRoot(root) {
  // Print the new source.
  var output = root.toSource({
    objectCurlySpacing: false,
    quote: 'single',
    trailingComma: true
  });

  // Remove all new lines between require fences that are not explicitly added
  // by the NewLine module.
  var lines = output.split('\n');
  var first = lines.length - 1;
  var last = 0;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(_NewLine2.default.literal) !== -1) {
      first = Math.min(first, i);
      last = Math.max(last, i);
    }
  }

  // Filter out the empty lines that are between NewLine markers.
  output = lines.filter(function (line, index) {
    return line || index < first || index > last;
  }).join('\n');

  // Remove the NewLine markers.
  output = _NewLine2.default.replace(output);

  // Remove new lines at the start.
  output = output.replace(/^\n{1,}/, '');

  // Remove spurious semicolon after 'use strict'
  output = output.replace("'use strict';;", "'use strict';");

  // Make sure there is a new line at the end.
  if (!/^[\w\W]*\n$/.test(output)) {
    output += '\n';
  }

  // Remove spurious newline at the end.
  output = output.replace(/\n\n$/, '\n');

  return output;
}

module.exports = printRoot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcHJpbnRSb290LmpzIl0sIm5hbWVzIjpbInByaW50Um9vdCIsInJvb3QiLCJvdXRwdXQiLCJ0b1NvdXJjZSIsIm9iamVjdEN1cmx5U3BhY2luZyIsInF1b3RlIiwidHJhaWxpbmdDb21tYSIsImxpbmVzIiwic3BsaXQiLCJmaXJzdCIsImxlbmd0aCIsImxhc3QiLCJpIiwiaW5kZXhPZiIsImxpdGVyYWwiLCJNYXRoIiwibWluIiwibWF4IiwiZmlsdGVyIiwibGluZSIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJ0ZXN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFZQTs7Ozs7O0FBWkE7Ozs7Ozs7Ozs7QUFjQSxTQUFTQSxTQUFULENBQW1CQyxJQUFuQixFQUE2QztBQUMzQztBQUNBLE1BQUlDLFNBQVNELEtBQUtFLFFBQUwsQ0FBYztBQUN6QkMsd0JBQW9CLEtBREs7QUFFekJDLFdBQU8sUUFGa0I7QUFHekJDLG1CQUFlO0FBSFUsR0FBZCxDQUFiOztBQU1BO0FBQ0E7QUFDQSxNQUFNQyxRQUFRTCxPQUFPTSxLQUFQLENBQWEsSUFBYixDQUFkO0FBQ0EsTUFBSUMsUUFBUUYsTUFBTUcsTUFBTixHQUFlLENBQTNCO0FBQ0EsTUFBSUMsT0FBTyxDQUFYO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlMLE1BQU1HLE1BQTFCLEVBQWtDRSxHQUFsQyxFQUF1QztBQUNyQyxRQUFJTCxNQUFNSyxDQUFOLEVBQVNDLE9BQVQsQ0FBaUIsa0JBQVFDLE9BQXpCLE1BQXNDLENBQUMsQ0FBM0MsRUFBOEM7QUFDNUNMLGNBQVFNLEtBQUtDLEdBQUwsQ0FBU1AsS0FBVCxFQUFnQkcsQ0FBaEIsQ0FBUjtBQUNBRCxhQUFPSSxLQUFLRSxHQUFMLENBQVNOLElBQVQsRUFBZUMsQ0FBZixDQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBVixXQUFTSyxNQUNOVyxNQURNLENBQ0MsVUFBQ0MsSUFBRCxFQUFPQyxLQUFQO0FBQUEsV0FBaUJELFFBQVFDLFFBQVFYLEtBQWhCLElBQXlCVyxRQUFRVCxJQUFsRDtBQUFBLEdBREQsRUFFTlUsSUFGTSxDQUVELElBRkMsQ0FBVDs7QUFJQTtBQUNBbkIsV0FBUyxrQkFBUW9CLE9BQVIsQ0FBZ0JwQixNQUFoQixDQUFUOztBQUVBO0FBQ0FBLFdBQVNBLE9BQU9vQixPQUFQLENBQWUsU0FBZixFQUEwQixFQUExQixDQUFUOztBQUVBO0FBQ0FwQixXQUFTQSxPQUFPb0IsT0FBUCxDQUFlLGdCQUFmLEVBQWlDLGVBQWpDLENBQVQ7O0FBRUE7QUFDQSxNQUFJLENBQUMsY0FBY0MsSUFBZCxDQUFtQnJCLE1BQW5CLENBQUwsRUFBaUM7QUFDL0JBLGNBQVUsSUFBVjtBQUNEOztBQUVEO0FBQ0FBLFdBQVNBLE9BQU9vQixPQUFQLENBQWUsT0FBZixFQUF3QixJQUF4QixDQUFUOztBQUVBLFNBQU9wQixNQUFQO0FBQ0Q7O0FBRURzQixPQUFPQyxPQUFQLEdBQWlCekIsU0FBakIiLCJmaWxlIjoicHJpbnRSb290LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb259IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBOZXdMaW5lIGZyb20gJy4vTmV3TGluZSc7XG5cbmZ1bmN0aW9uIHByaW50Um9vdChyb290OiBDb2xsZWN0aW9uKTogc3RyaW5nIHtcbiAgLy8gUHJpbnQgdGhlIG5ldyBzb3VyY2UuXG4gIGxldCBvdXRwdXQgPSByb290LnRvU291cmNlKHtcbiAgICBvYmplY3RDdXJseVNwYWNpbmc6IGZhbHNlLFxuICAgIHF1b3RlOiAnc2luZ2xlJyxcbiAgICB0cmFpbGluZ0NvbW1hOiB0cnVlLFxuICB9KTtcblxuICAvLyBSZW1vdmUgYWxsIG5ldyBsaW5lcyBiZXR3ZWVuIHJlcXVpcmUgZmVuY2VzIHRoYXQgYXJlIG5vdCBleHBsaWNpdGx5IGFkZGVkXG4gIC8vIGJ5IHRoZSBOZXdMaW5lIG1vZHVsZS5cbiAgY29uc3QgbGluZXMgPSBvdXRwdXQuc3BsaXQoJ1xcbicpO1xuICBsZXQgZmlyc3QgPSBsaW5lcy5sZW5ndGggLSAxO1xuICBsZXQgbGFzdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobGluZXNbaV0uaW5kZXhPZihOZXdMaW5lLmxpdGVyYWwpICE9PSAtMSkge1xuICAgICAgZmlyc3QgPSBNYXRoLm1pbihmaXJzdCwgaSk7XG4gICAgICBsYXN0ID0gTWF0aC5tYXgobGFzdCwgaSk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmlsdGVyIG91dCB0aGUgZW1wdHkgbGluZXMgdGhhdCBhcmUgYmV0d2VlbiBOZXdMaW5lIG1hcmtlcnMuXG4gIG91dHB1dCA9IGxpbmVzXG4gICAgLmZpbHRlcigobGluZSwgaW5kZXgpID0+IGxpbmUgfHwgaW5kZXggPCBmaXJzdCB8fCBpbmRleCA+IGxhc3QpXG4gICAgLmpvaW4oJ1xcbicpO1xuXG4gIC8vIFJlbW92ZSB0aGUgTmV3TGluZSBtYXJrZXJzLlxuICBvdXRwdXQgPSBOZXdMaW5lLnJlcGxhY2Uob3V0cHV0KTtcblxuICAvLyBSZW1vdmUgbmV3IGxpbmVzIGF0IHRoZSBzdGFydC5cbiAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL15cXG57MSx9LywgJycpO1xuXG4gIC8vIFJlbW92ZSBzcHVyaW91cyBzZW1pY29sb24gYWZ0ZXIgJ3VzZSBzdHJpY3QnXG4gIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKFwiJ3VzZSBzdHJpY3QnOztcIiwgXCIndXNlIHN0cmljdCc7XCIpO1xuXG4gIC8vIE1ha2Ugc3VyZSB0aGVyZSBpcyBhIG5ldyBsaW5lIGF0IHRoZSBlbmQuXG4gIGlmICghL15bXFx3XFxXXSpcXG4kLy50ZXN0KG91dHB1dCkpIHtcbiAgICBvdXRwdXQgKz0gJ1xcbic7XG4gIH1cblxuICAvLyBSZW1vdmUgc3B1cmlvdXMgbmV3bGluZSBhdCB0aGUgZW5kLlxuICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvXFxuXFxuJC8sICdcXG4nKTtcblxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByaW50Um9vdDtcbiJdfQ==