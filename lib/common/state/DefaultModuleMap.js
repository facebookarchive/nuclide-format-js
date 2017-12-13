'use strict';

var _ModuleMap;

function _load_ModuleMap() {
  return _ModuleMap = _interopRequireDefault(require('./ModuleMap'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultModuleMap = new (_ModuleMap || _load_ModuleMap()).default({
  paths: [],
  pathsToRelativize: [],
  aliases: require('../constants/commonAliases'),
  aliasesToRelativize: new Map(),
  builtIns: require('../constants/builtIns'),
  builtInTypes: require('../constants/builtInTypes')
}); /*
     * Copyright (c) 2015-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the license found in the LICENSE file in
     * the root directory of this source tree.
     *
     * 
     */

module.exports = DefaultModuleMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvRGVmYXVsdE1vZHVsZU1hcC5qcyJdLCJuYW1lcyI6WyJEZWZhdWx0TW9kdWxlTWFwIiwicGF0aHMiLCJwYXRoc1RvUmVsYXRpdml6ZSIsImFsaWFzZXMiLCJyZXF1aXJlIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIk1hcCIsImJ1aWx0SW5zIiwiYnVpbHRJblR5cGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVVBO0FBQUE7QUFBQTs7OztBQUVBLElBQU1BLG1CQUFtQiw4Q0FBYztBQUNyQ0MsU0FBTyxFQUQ4QjtBQUVyQ0MscUJBQW1CLEVBRmtCO0FBR3JDQyxXQUFTQyxRQUFRLDRCQUFSLENBSDRCO0FBSXJDQyx1QkFBcUIsSUFBSUMsR0FBSixFQUpnQjtBQUtyQ0MsWUFBVUgsUUFBUSx1QkFBUixDQUwyQjtBQU1yQ0ksZ0JBQWNKLFFBQVEsMkJBQVI7QUFOdUIsQ0FBZCxDQUF6QixDLENBWkE7Ozs7Ozs7Ozs7QUFxQkFLLE9BQU9DLE9BQVAsR0FBaUJWLGdCQUFqQiIsImZpbGUiOiJEZWZhdWx0TW9kdWxlTWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IE1vZHVsZU1hcCBmcm9tICcuL01vZHVsZU1hcCc7XG5cbmNvbnN0IERlZmF1bHRNb2R1bGVNYXAgPSBuZXcgTW9kdWxlTWFwKHtcbiAgcGF0aHM6IFtdLFxuICBwYXRoc1RvUmVsYXRpdml6ZTogW10sXG4gIGFsaWFzZXM6IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb21tb25BbGlhc2VzJyksXG4gIGFsaWFzZXNUb1JlbGF0aXZpemU6IG5ldyBNYXAoKSxcbiAgYnVpbHRJbnM6IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9idWlsdElucycpLFxuICBidWlsdEluVHlwZXM6IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9idWlsdEluVHlwZXMnKSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmF1bHRNb2R1bGVNYXA7XG4iXX0=