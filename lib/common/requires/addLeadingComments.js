'use strict';

var _FirstNode;

function _load_FirstNode() {
  return _FirstNode = _interopRequireDefault(require('../utils/FirstNode'));
}

var _reprintComment;

function _load_reprintComment() {
  return _reprintComment = _interopRequireDefault(require('../utils/reprintComment'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addLeadingComments(root, comments) {
  if (!comments || comments.length === 0) {
    return;
  }

  var firstPath = (_FirstNode || _load_FirstNode()).default.get(root);
  if (!firstPath) {
    return;
  }
  var first = firstPath.node;
  first.comments = first.comments ? comments.concat(first.comments) : comments;
  first.comments = first.comments.map(function (comment) {
    return (0, (_reprintComment || _load_reprintComment()).default)(comment);
  });
  firstPath.replace(first);
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = addLeadingComments;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvYWRkTGVhZGluZ0NvbW1lbnRzLmpzIl0sIm5hbWVzIjpbImFkZExlYWRpbmdDb21tZW50cyIsInJvb3QiLCJjb21tZW50cyIsImxlbmd0aCIsImZpcnN0UGF0aCIsImdldCIsImZpcnN0Iiwibm9kZSIsImNvbmNhdCIsIm1hcCIsImNvbW1lbnQiLCJyZXBsYWNlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBLFNBQVNBLGtCQUFULENBQTRCQyxJQUE1QixFQUE4Q0MsUUFBOUMsRUFBNEU7QUFDMUUsTUFBSSxDQUFDQSxRQUFELElBQWFBLFNBQVNDLE1BQVQsS0FBb0IsQ0FBckMsRUFBd0M7QUFDdEM7QUFDRDs7QUFFRCxNQUFNQyxZQUFZLDBDQUFVQyxHQUFWLENBQWNKLElBQWQsQ0FBbEI7QUFDQSxNQUFJLENBQUNHLFNBQUwsRUFBZ0I7QUFDZDtBQUNEO0FBQ0QsTUFBTUUsUUFBUUYsVUFBVUcsSUFBeEI7QUFDQUQsUUFBTUosUUFBTixHQUFpQkksTUFBTUosUUFBTixHQUFpQkEsU0FBU00sTUFBVCxDQUFnQkYsTUFBTUosUUFBdEIsQ0FBakIsR0FBbURBLFFBQXBFO0FBQ0FJLFFBQU1KLFFBQU4sR0FBaUJJLE1BQU1KLFFBQU4sQ0FBZU8sR0FBZixDQUFtQjtBQUFBLFdBQVcseURBQWVDLE9BQWYsQ0FBWDtBQUFBLEdBQW5CLENBQWpCO0FBQ0FOLFlBQVVPLE9BQVYsQ0FBa0JMLEtBQWxCO0FBQ0QsQyxDQTVCRDs7Ozs7Ozs7OztBQThCQU0sT0FBT0MsT0FBUCxHQUFpQmIsa0JBQWpCIiwiZmlsZSI6ImFkZExlYWRpbmdDb21tZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9uLCBOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgRmlyc3ROb2RlIGZyb20gJy4uL3V0aWxzL0ZpcnN0Tm9kZSc7XG5pbXBvcnQgcmVwcmludENvbW1lbnQgZnJvbSAnLi4vdXRpbHMvcmVwcmludENvbW1lbnQnO1xuXG5mdW5jdGlvbiBhZGRMZWFkaW5nQ29tbWVudHMocm9vdDogQ29sbGVjdGlvbiwgY29tbWVudHM6ID9BcnJheTxOb2RlPik6IHZvaWQge1xuICBpZiAoIWNvbW1lbnRzIHx8IGNvbW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGZpcnN0UGF0aCA9IEZpcnN0Tm9kZS5nZXQocm9vdCk7XG4gIGlmICghZmlyc3RQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGZpcnN0ID0gZmlyc3RQYXRoLm5vZGU7XG4gIGZpcnN0LmNvbW1lbnRzID0gZmlyc3QuY29tbWVudHMgPyBjb21tZW50cy5jb25jYXQoZmlyc3QuY29tbWVudHMpIDogY29tbWVudHM7XG4gIGZpcnN0LmNvbW1lbnRzID0gZmlyc3QuY29tbWVudHMubWFwKGNvbW1lbnQgPT4gcmVwcmludENvbW1lbnQoY29tbWVudCkpO1xuICBmaXJzdFBhdGgucmVwbGFjZShmaXJzdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTGVhZGluZ0NvbW1lbnRzO1xuIl19