'use strict';

var _addLeadingComments;

function _load_addLeadingComments() {
  return _addLeadingComments = _interopRequireDefault(require('./addLeadingComments'));
}

var _addMissingRequires;

function _load_addMissingRequires() {
  return _addMissingRequires = _interopRequireDefault(require('./addMissingRequires'));
}

var _addMissingTypes;

function _load_addMissingTypes() {
  return _addMissingTypes = _interopRequireDefault(require('./addMissingTypes'));
}

var _formatRequires;

function _load_formatRequires() {
  return _formatRequires = _interopRequireDefault(require('./formatRequires'));
}

var _removeLeadingComments;

function _load_removeLeadingComments() {
  return _removeLeadingComments = _interopRequireDefault(require('./removeLeadingComments'));
}

var _removeUnusedRequires;

function _load_removeUnusedRequires() {
  return _removeUnusedRequires = _interopRequireDefault(require('./removeUnusedRequires'));
}

var _removeUnusedTypes;

function _load_removeUnusedTypes() {
  return _removeUnusedTypes = _interopRequireDefault(require('./removeUnusedTypes'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is the collection of transforms that affect requires.
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

function transform(root, options) {
  var blacklist = options.blacklist || new Set();
  var comments = void 0;
  if (!blacklist.has('requires.transferComments')) {
    comments = (0, (_removeLeadingComments || _load_removeLeadingComments()).default)(root);
  }
  if (!blacklist.has('requires.removeUnusedRequires')) {
    (0, (_removeUnusedRequires || _load_removeUnusedRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.addMissingRequires')) {
    (0, (_addMissingRequires || _load_addMissingRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.removeUnusedTypes')) {
    (0, (_removeUnusedTypes || _load_removeUnusedTypes()).default)(root, options);
  }
  if (!blacklist.has('requires.addMissingTypes')) {
    (0, (_addMissingTypes || _load_addMissingTypes()).default)(root, options);
  }
  if (!blacklist.has('requires.formatRequires')) {
    (0, (_formatRequires || _load_formatRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.transferComments')) {
    (0, (_addLeadingComments || _load_addLeadingComments()).default)(root, comments);
  }
}

module.exports = transform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInJvb3QiLCJvcHRpb25zIiwiYmxhY2tsaXN0IiwiU2V0IiwiY29tbWVudHMiLCJoYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBY0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBRUE7OztBQXRCQTs7Ozs7Ozs7OztBQXlCQSxTQUFTQSxTQUFULENBQW1CQyxJQUFuQixFQUFxQ0MsT0FBckMsRUFBbUU7QUFDakUsTUFBTUMsWUFBK0JELFFBQVFDLFNBQVIsSUFBcUIsSUFBSUMsR0FBSixFQUExRDtBQUNBLE1BQUlDLGlCQUFKO0FBQ0EsTUFBSSxDQUFDRixVQUFVRyxHQUFWLENBQWMsMkJBQWQsQ0FBTCxFQUFpRDtBQUMvQ0QsZUFBVyx1RUFBc0JKLElBQXRCLENBQVg7QUFDRDtBQUNELE1BQUksQ0FBQ0UsVUFBVUcsR0FBVixDQUFjLCtCQUFkLENBQUwsRUFBcUQ7QUFDbkQseUVBQXFCTCxJQUFyQixFQUEyQkMsT0FBM0I7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUcsR0FBVixDQUFjLDZCQUFkLENBQUwsRUFBbUQ7QUFDakQscUVBQW1CTCxJQUFuQixFQUF5QkMsT0FBekI7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUcsR0FBVixDQUFjLDRCQUFkLENBQUwsRUFBa0Q7QUFDaEQsbUVBQWtCTCxJQUFsQixFQUF3QkMsT0FBeEI7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUcsR0FBVixDQUFjLDBCQUFkLENBQUwsRUFBZ0Q7QUFDOUMsK0RBQWdCTCxJQUFoQixFQUFzQkMsT0FBdEI7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUcsR0FBVixDQUFjLHlCQUFkLENBQUwsRUFBK0M7QUFDN0MsNkRBQWVMLElBQWYsRUFBcUJDLE9BQXJCO0FBQ0Q7QUFDRCxNQUFJLENBQUNDLFVBQVVHLEdBQVYsQ0FBYywyQkFBZCxDQUFMLEVBQWlEO0FBQy9DLHFFQUFtQkwsSUFBbkIsRUFBeUJJLFFBQXpCO0FBQ0Q7QUFDRjs7QUFFREUsT0FBT0MsT0FBUCxHQUFpQlIsU0FBakIiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb259IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcbmltcG9ydCB0eXBlIHtUcmFuc2Zvcm1LZXl9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybXMnO1xuXG5pbXBvcnQgYWRkTGVhZGluZ0NvbW1lbnRzIGZyb20gJy4vYWRkTGVhZGluZ0NvbW1lbnRzJztcbmltcG9ydCBhZGRNaXNzaW5nUmVxdWlyZXMgZnJvbSAnLi9hZGRNaXNzaW5nUmVxdWlyZXMnO1xuaW1wb3J0IGFkZE1pc3NpbmdUeXBlcyBmcm9tICcuL2FkZE1pc3NpbmdUeXBlcyc7XG5pbXBvcnQgZm9ybWF0UmVxdWlyZXMgZnJvbSAnLi9mb3JtYXRSZXF1aXJlcyc7XG5pbXBvcnQgcmVtb3ZlTGVhZGluZ0NvbW1lbnRzIGZyb20gJy4vcmVtb3ZlTGVhZGluZ0NvbW1lbnRzJztcbmltcG9ydCByZW1vdmVVbnVzZWRSZXF1aXJlcyBmcm9tICcuL3JlbW92ZVVudXNlZFJlcXVpcmVzJztcbmltcG9ydCByZW1vdmVVbnVzZWRUeXBlcyBmcm9tICcuL3JlbW92ZVVudXNlZFR5cGVzJztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb2xsZWN0aW9uIG9mIHRyYW5zZm9ybXMgdGhhdCBhZmZlY3QgcmVxdWlyZXMuXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybShyb290OiBDb2xsZWN0aW9uLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogdm9pZCB7XG4gIGNvbnN0IGJsYWNrbGlzdDogU2V0PFRyYW5zZm9ybUtleT4gPSBvcHRpb25zLmJsYWNrbGlzdCB8fCBuZXcgU2V0KCk7XG4gIGxldCBjb21tZW50cztcbiAgaWYgKCFibGFja2xpc3QuaGFzKCdyZXF1aXJlcy50cmFuc2ZlckNvbW1lbnRzJykpIHtcbiAgICBjb21tZW50cyA9IHJlbW92ZUxlYWRpbmdDb21tZW50cyhyb290KTtcbiAgfVxuICBpZiAoIWJsYWNrbGlzdC5oYXMoJ3JlcXVpcmVzLnJlbW92ZVVudXNlZFJlcXVpcmVzJykpIHtcbiAgICByZW1vdmVVbnVzZWRSZXF1aXJlcyhyb290LCBvcHRpb25zKTtcbiAgfVxuICBpZiAoIWJsYWNrbGlzdC5oYXMoJ3JlcXVpcmVzLmFkZE1pc3NpbmdSZXF1aXJlcycpKSB7XG4gICAgYWRkTWlzc2luZ1JlcXVpcmVzKHJvb3QsIG9wdGlvbnMpO1xuICB9XG4gIGlmICghYmxhY2tsaXN0LmhhcygncmVxdWlyZXMucmVtb3ZlVW51c2VkVHlwZXMnKSkge1xuICAgIHJlbW92ZVVudXNlZFR5cGVzKHJvb3QsIG9wdGlvbnMpO1xuICB9XG4gIGlmICghYmxhY2tsaXN0LmhhcygncmVxdWlyZXMuYWRkTWlzc2luZ1R5cGVzJykpIHtcbiAgICBhZGRNaXNzaW5nVHlwZXMocm9vdCwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKCFibGFja2xpc3QuaGFzKCdyZXF1aXJlcy5mb3JtYXRSZXF1aXJlcycpKSB7XG4gICAgZm9ybWF0UmVxdWlyZXMocm9vdCwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKCFibGFja2xpc3QuaGFzKCdyZXF1aXJlcy50cmFuc2ZlckNvbW1lbnRzJykpIHtcbiAgICBhZGRMZWFkaW5nQ29tbWVudHMocm9vdCwgY29tbWVudHMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIl19