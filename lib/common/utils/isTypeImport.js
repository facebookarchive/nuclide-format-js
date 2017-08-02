'use strict';

/**
 * f.e.: import type Foo from 'Foo';
 */
function isTypeImport(path) {
  return path.value.importKind === 'type';
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = isTypeImport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvaXNUeXBlSW1wb3J0LmpzIl0sIm5hbWVzIjpbImlzVHlwZUltcG9ydCIsInBhdGgiLCJ2YWx1ZSIsImltcG9ydEtpbmQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQVlBOzs7QUFHQSxTQUFTQSxZQUFULENBQXNCQyxJQUF0QixFQUErQztBQUM3QyxTQUFPQSxLQUFLQyxLQUFMLENBQVdDLFVBQVgsS0FBMEIsTUFBakM7QUFDRCxDLENBakJEOzs7Ozs7Ozs7O0FBbUJBQyxPQUFPQyxPQUFQLEdBQWlCTCxZQUFqQiIsImZpbGUiOiJpc1R5cGVJbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbi8qKlxuICogZi5lLjogaW1wb3J0IHR5cGUgRm9vIGZyb20gJ0Zvbyc7XG4gKi9cbmZ1bmN0aW9uIGlzVHlwZUltcG9ydChwYXRoOiBOb2RlUGF0aCk6IGJvb2xlYW4ge1xuICByZXR1cm4gcGF0aC52YWx1ZS5pbXBvcnRLaW5kID09PSAndHlwZSc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlSW1wb3J0O1xuIl19