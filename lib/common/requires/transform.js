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
  var missingRequires = void 0;
  var missingTypes = void 0;
  if (!blacklist.has('requires.transferComments')) {
    comments = (0, (_removeLeadingComments || _load_removeLeadingComments()).default)(root);
  }
  if (!blacklist.has('requires.removeUnusedRequires')) {
    (0, (_removeUnusedRequires || _load_removeUnusedRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.addMissingRequires')) {
    missingRequires = (0, (_addMissingRequires || _load_addMissingRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.removeUnusedTypes')) {
    (0, (_removeUnusedTypes || _load_removeUnusedTypes()).default)(root, options);
  }
  if (!blacklist.has('requires.addMissingTypes')) {
    missingTypes = (0, (_addMissingTypes || _load_addMissingTypes()).default)(root, options);
  }
  if (!blacklist.has('requires.formatRequires')) {
    (0, (_formatRequires || _load_formatRequires()).default)(root, options);
  }
  if (!blacklist.has('requires.transferComments')) {
    (0, (_addLeadingComments || _load_addLeadingComments()).default)(root, comments);
  }
  return { missingRequires: missingRequires, missingTypes: missingTypes };
}

module.exports = transform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInJvb3QiLCJvcHRpb25zIiwiYmxhY2tsaXN0IiwiU2V0IiwiY29tbWVudHMiLCJtaXNzaW5nUmVxdWlyZXMiLCJtaXNzaW5nVHlwZXMiLCJoYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBY0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBT0E7OztBQTNCQTs7Ozs7Ozs7OztBQThCQSxTQUFTQSxTQUFULENBQW1CQyxJQUFuQixFQUFxQ0MsT0FBckMsRUFBMEU7QUFDeEUsTUFBTUMsWUFBK0JELFFBQVFDLFNBQVIsSUFBcUIsSUFBSUMsR0FBSixFQUExRDtBQUNBLE1BQUlDLGlCQUFKO0FBQ0EsTUFBSUMsd0JBQUo7QUFDQSxNQUFJQyxxQkFBSjtBQUNBLE1BQUksQ0FBQ0osVUFBVUssR0FBVixDQUFjLDJCQUFkLENBQUwsRUFBaUQ7QUFDL0NILGVBQVcsdUVBQXNCSixJQUF0QixDQUFYO0FBQ0Q7QUFDRCxNQUFJLENBQUNFLFVBQVVLLEdBQVYsQ0FBYywrQkFBZCxDQUFMLEVBQXFEO0FBQ25ELHlFQUFxQlAsSUFBckIsRUFBMkJDLE9BQTNCO0FBQ0Q7QUFDRCxNQUFJLENBQUNDLFVBQVVLLEdBQVYsQ0FBYyw2QkFBZCxDQUFMLEVBQW1EO0FBQ2pERixzQkFBa0IsaUVBQW1CTCxJQUFuQixFQUF5QkMsT0FBekIsQ0FBbEI7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUssR0FBVixDQUFjLDRCQUFkLENBQUwsRUFBa0Q7QUFDaEQsbUVBQWtCUCxJQUFsQixFQUF3QkMsT0FBeEI7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUssR0FBVixDQUFjLDBCQUFkLENBQUwsRUFBZ0Q7QUFDOUNELG1CQUFlLDJEQUFnQk4sSUFBaEIsRUFBc0JDLE9BQXRCLENBQWY7QUFDRDtBQUNELE1BQUksQ0FBQ0MsVUFBVUssR0FBVixDQUFjLHlCQUFkLENBQUwsRUFBK0M7QUFDN0MsNkRBQWVQLElBQWYsRUFBcUJDLE9BQXJCO0FBQ0Q7QUFDRCxNQUFJLENBQUNDLFVBQVVLLEdBQVYsQ0FBYywyQkFBZCxDQUFMLEVBQWlEO0FBQy9DLHFFQUFtQlAsSUFBbkIsRUFBeUJJLFFBQXpCO0FBQ0Q7QUFDRCxTQUFPLEVBQUNDLGdDQUFELEVBQWtCQywwQkFBbEIsRUFBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCVixTQUFqQiIsImZpbGUiOiJ0cmFuc2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbn0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1RyYW5zZm9ybUtleX0gZnJvbSAnLi4vdHlwZXMvdHJhbnNmb3Jtcyc7XG5cbmltcG9ydCBhZGRMZWFkaW5nQ29tbWVudHMgZnJvbSAnLi9hZGRMZWFkaW5nQ29tbWVudHMnO1xuaW1wb3J0IGFkZE1pc3NpbmdSZXF1aXJlcyBmcm9tICcuL2FkZE1pc3NpbmdSZXF1aXJlcyc7XG5pbXBvcnQgYWRkTWlzc2luZ1R5cGVzIGZyb20gJy4vYWRkTWlzc2luZ1R5cGVzJztcbmltcG9ydCBmb3JtYXRSZXF1aXJlcyBmcm9tICcuL2Zvcm1hdFJlcXVpcmVzJztcbmltcG9ydCByZW1vdmVMZWFkaW5nQ29tbWVudHMgZnJvbSAnLi9yZW1vdmVMZWFkaW5nQ29tbWVudHMnO1xuaW1wb3J0IHJlbW92ZVVudXNlZFJlcXVpcmVzIGZyb20gJy4vcmVtb3ZlVW51c2VkUmVxdWlyZXMnO1xuaW1wb3J0IHJlbW92ZVVudXNlZFR5cGVzIGZyb20gJy4vcmVtb3ZlVW51c2VkVHlwZXMnO1xuXG5leHBvcnQgdHlwZSBQYXJzaW5nSW5mbyA9IHtcbiAgbWlzc2luZ1JlcXVpcmVzOiA/Ym9vbGVhbixcbiAgbWlzc2luZ1R5cGVzOiA/Ym9vbGVhbixcbn07XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgY29sbGVjdGlvbiBvZiB0cmFuc2Zvcm1zIHRoYXQgYWZmZWN0IHJlcXVpcmVzLlxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm0ocm9vdDogQ29sbGVjdGlvbiwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IFBhcnNpbmdJbmZvIHtcbiAgY29uc3QgYmxhY2tsaXN0OiBTZXQ8VHJhbnNmb3JtS2V5PiA9IG9wdGlvbnMuYmxhY2tsaXN0IHx8IG5ldyBTZXQoKTtcbiAgbGV0IGNvbW1lbnRzO1xuICBsZXQgbWlzc2luZ1JlcXVpcmVzO1xuICBsZXQgbWlzc2luZ1R5cGVzO1xuICBpZiAoIWJsYWNrbGlzdC5oYXMoJ3JlcXVpcmVzLnRyYW5zZmVyQ29tbWVudHMnKSkge1xuICAgIGNvbW1lbnRzID0gcmVtb3ZlTGVhZGluZ0NvbW1lbnRzKHJvb3QpO1xuICB9XG4gIGlmICghYmxhY2tsaXN0LmhhcygncmVxdWlyZXMucmVtb3ZlVW51c2VkUmVxdWlyZXMnKSkge1xuICAgIHJlbW92ZVVudXNlZFJlcXVpcmVzKHJvb3QsIG9wdGlvbnMpO1xuICB9XG4gIGlmICghYmxhY2tsaXN0LmhhcygncmVxdWlyZXMuYWRkTWlzc2luZ1JlcXVpcmVzJykpIHtcbiAgICBtaXNzaW5nUmVxdWlyZXMgPSBhZGRNaXNzaW5nUmVxdWlyZXMocm9vdCwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKCFibGFja2xpc3QuaGFzKCdyZXF1aXJlcy5yZW1vdmVVbnVzZWRUeXBlcycpKSB7XG4gICAgcmVtb3ZlVW51c2VkVHlwZXMocm9vdCwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKCFibGFja2xpc3QuaGFzKCdyZXF1aXJlcy5hZGRNaXNzaW5nVHlwZXMnKSkge1xuICAgIG1pc3NpbmdUeXBlcyA9IGFkZE1pc3NpbmdUeXBlcyhyb290LCBvcHRpb25zKTtcbiAgfVxuICBpZiAoIWJsYWNrbGlzdC5oYXMoJ3JlcXVpcmVzLmZvcm1hdFJlcXVpcmVzJykpIHtcbiAgICBmb3JtYXRSZXF1aXJlcyhyb290LCBvcHRpb25zKTtcbiAgfVxuICBpZiAoIWJsYWNrbGlzdC5oYXMoJ3JlcXVpcmVzLnRyYW5zZmVyQ29tbWVudHMnKSkge1xuICAgIGFkZExlYWRpbmdDb21tZW50cyhyb290LCBjb21tZW50cyk7XG4gIH1cbiAgcmV0dXJuIHttaXNzaW5nUmVxdWlyZXMsIG1pc3NpbmdUeXBlc307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIl19