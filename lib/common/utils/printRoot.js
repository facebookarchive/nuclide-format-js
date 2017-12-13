'use strict';

var _NewLine;

function _load_NewLine() {
  return _NewLine = _interopRequireDefault(require('./NewLine'));
}

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
    if (lines[i].indexOf((_NewLine || _load_NewLine()).default.literal) !== -1) {
      first = Math.min(first, i);
      last = Math.max(last, i);
    }
  }

  // Filter out the empty lines that are between NewLine markers.
  output = lines.filter(function (line, index) {
    return line || index < first || index > last;
  }).join('\n');

  // Remove the NewLine markers.
  output = (_NewLine || _load_NewLine()).default.replace(output);

  // Remove new lines at the start.
  output = output.replace(/^\n{1,}/, '');

  // Remove spurious semicolon after 'use strict'
  output = output.replace("'use strict';;", "'use strict';");

  // Make sure 'use strict' is separated why new line
  output = output.replace(/'use strict';\n([^\n])/, "'use strict';\n\n$1");

  // Make sure there is a new line at the end.
  if (!/^[\w\W]*\n$/.test(output)) {
    output += '\n';
  }

  // Remove spurious newline at the end.
  output = output.replace(/\n\n$/, '\n');

  return output;
}

module.exports = printRoot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcHJpbnRSb290LmpzIl0sIm5hbWVzIjpbInByaW50Um9vdCIsInJvb3QiLCJvdXRwdXQiLCJ0b1NvdXJjZSIsIm9iamVjdEN1cmx5U3BhY2luZyIsInF1b3RlIiwidHJhaWxpbmdDb21tYSIsImxpbmVzIiwic3BsaXQiLCJmaXJzdCIsImxlbmd0aCIsImxhc3QiLCJpIiwiaW5kZXhPZiIsImxpdGVyYWwiLCJNYXRoIiwibWluIiwibWF4IiwiZmlsdGVyIiwibGluZSIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJ0ZXN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBO0FBQUE7QUFBQTs7OztBQVpBOzs7Ozs7Ozs7O0FBY0EsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBNkM7QUFDM0M7QUFDQSxNQUFJQyxTQUFTRCxLQUFLRSxRQUFMLENBQWM7QUFDekJDLHdCQUFvQixLQURLO0FBRXpCQyxXQUFPLFFBRmtCO0FBR3pCQyxtQkFBZTtBQUhVLEdBQWQsQ0FBYjs7QUFNQTtBQUNBO0FBQ0EsTUFBTUMsUUFBUUwsT0FBT00sS0FBUCxDQUFhLElBQWIsQ0FBZDtBQUNBLE1BQUlDLFFBQVFGLE1BQU1HLE1BQU4sR0FBZSxDQUEzQjtBQUNBLE1BQUlDLE9BQU8sQ0FBWDtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxNQUFNRyxNQUExQixFQUFrQ0UsR0FBbEMsRUFBdUM7QUFDckMsUUFBSUwsTUFBTUssQ0FBTixFQUFTQyxPQUFULENBQWlCLHNDQUFRQyxPQUF6QixNQUFzQyxDQUFDLENBQTNDLEVBQThDO0FBQzVDTCxjQUFRTSxLQUFLQyxHQUFMLENBQVNQLEtBQVQsRUFBZ0JHLENBQWhCLENBQVI7QUFDQUQsYUFBT0ksS0FBS0UsR0FBTCxDQUFTTixJQUFULEVBQWVDLENBQWYsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQVYsV0FBU0ssTUFDTlcsTUFETSxDQUNDLFVBQUNDLElBQUQsRUFBT0MsS0FBUDtBQUFBLFdBQWlCRCxRQUFRQyxRQUFRWCxLQUFoQixJQUF5QlcsUUFBUVQsSUFBbEQ7QUFBQSxHQURELEVBRU5VLElBRk0sQ0FFRCxJQUZDLENBQVQ7O0FBS0E7QUFDQW5CLFdBQVMsc0NBQVFvQixPQUFSLENBQWdCcEIsTUFBaEIsQ0FBVDs7QUFFQTtBQUNBQSxXQUFTQSxPQUFPb0IsT0FBUCxDQUFlLFNBQWYsRUFBMEIsRUFBMUIsQ0FBVDs7QUFFQTtBQUNBcEIsV0FBU0EsT0FBT29CLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxlQUFqQyxDQUFUOztBQUVBO0FBQ0FwQixXQUFTQSxPQUFPb0IsT0FBUCxDQUFlLHdCQUFmLEVBQXlDLHFCQUF6QyxDQUFUOztBQUVBO0FBQ0EsTUFBSSxDQUFDLGNBQWNDLElBQWQsQ0FBbUJyQixNQUFuQixDQUFMLEVBQWlDO0FBQy9CQSxjQUFVLElBQVY7QUFDRDs7QUFFRDtBQUNBQSxXQUFTQSxPQUFPb0IsT0FBUCxDQUFlLE9BQWYsRUFBd0IsSUFBeEIsQ0FBVDs7QUFFQSxTQUFPcEIsTUFBUDtBQUNEOztBQUVEc0IsT0FBT0MsT0FBUCxHQUFpQnpCLFNBQWpCIiwiZmlsZSI6InByaW50Um9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9ufSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgTmV3TGluZSBmcm9tICcuL05ld0xpbmUnO1xuXG5mdW5jdGlvbiBwcmludFJvb3Qocm9vdDogQ29sbGVjdGlvbik6IHN0cmluZyB7XG4gIC8vIFByaW50IHRoZSBuZXcgc291cmNlLlxuICBsZXQgb3V0cHV0ID0gcm9vdC50b1NvdXJjZSh7XG4gICAgb2JqZWN0Q3VybHlTcGFjaW5nOiBmYWxzZSxcbiAgICBxdW90ZTogJ3NpbmdsZScsXG4gICAgdHJhaWxpbmdDb21tYTogdHJ1ZSxcbiAgfSk7XG5cbiAgLy8gUmVtb3ZlIGFsbCBuZXcgbGluZXMgYmV0d2VlbiByZXF1aXJlIGZlbmNlcyB0aGF0IGFyZSBub3QgZXhwbGljaXRseSBhZGRlZFxuICAvLyBieSB0aGUgTmV3TGluZSBtb2R1bGUuXG4gIGNvbnN0IGxpbmVzID0gb3V0cHV0LnNwbGl0KCdcXG4nKTtcbiAgbGV0IGZpcnN0ID0gbGluZXMubGVuZ3RoIC0gMTtcbiAgbGV0IGxhc3QgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGxpbmVzW2ldLmluZGV4T2YoTmV3TGluZS5saXRlcmFsKSAhPT0gLTEpIHtcbiAgICAgIGZpcnN0ID0gTWF0aC5taW4oZmlyc3QsIGkpO1xuICAgICAgbGFzdCA9IE1hdGgubWF4KGxhc3QsIGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbHRlciBvdXQgdGhlIGVtcHR5IGxpbmVzIHRoYXQgYXJlIGJldHdlZW4gTmV3TGluZSBtYXJrZXJzLlxuICBvdXRwdXQgPSBsaW5lc1xuICAgIC5maWx0ZXIoKGxpbmUsIGluZGV4KSA9PiBsaW5lIHx8IGluZGV4IDwgZmlyc3QgfHwgaW5kZXggPiBsYXN0KVxuICAgIC5qb2luKCdcXG4nKTtcblxuXG4gIC8vIFJlbW92ZSB0aGUgTmV3TGluZSBtYXJrZXJzLlxuICBvdXRwdXQgPSBOZXdMaW5lLnJlcGxhY2Uob3V0cHV0KTtcblxuICAvLyBSZW1vdmUgbmV3IGxpbmVzIGF0IHRoZSBzdGFydC5cbiAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL15cXG57MSx9LywgJycpO1xuXG4gIC8vIFJlbW92ZSBzcHVyaW91cyBzZW1pY29sb24gYWZ0ZXIgJ3VzZSBzdHJpY3QnXG4gIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKFwiJ3VzZSBzdHJpY3QnOztcIiwgXCIndXNlIHN0cmljdCc7XCIpO1xuXG4gIC8vIE1ha2Ugc3VyZSAndXNlIHN0cmljdCcgaXMgc2VwYXJhdGVkIHdoeSBuZXcgbGluZVxuICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvJ3VzZSBzdHJpY3QnO1xcbihbXlxcbl0pLywgXCIndXNlIHN0cmljdCc7XFxuXFxuJDFcIik7XG5cbiAgLy8gTWFrZSBzdXJlIHRoZXJlIGlzIGEgbmV3IGxpbmUgYXQgdGhlIGVuZC5cbiAgaWYgKCEvXltcXHdcXFddKlxcbiQvLnRlc3Qob3V0cHV0KSkge1xuICAgIG91dHB1dCArPSAnXFxuJztcbiAgfVxuXG4gIC8vIFJlbW92ZSBzcHVyaW91cyBuZXdsaW5lIGF0IHRoZSBlbmQuXG4gIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKC9cXG5cXG4kLywgJ1xcbicpO1xuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJpbnRSb290O1xuIl19