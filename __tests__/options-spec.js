'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import DefaultModuleMap from '../src/common/state/DefaultModuleMap';
import jscs from 'jscodeshift';
import printRoot from '../src/common/utils/printRoot';
import fsPromise from '../../commons-node/fsPromise';
import requiresTransform from '../src/common/requires/transform';

describe('options', () => {
  it('should respect blacklist options', () => {
    const testPath = 'spec/fixtures/options/respect-blacklist.test';
    const expectedPath = 'spec/fixtures/options/respect-blacklist.expected';
    waitsForPromise(async () => {
      const test = await fsPromise.readFile(testPath, 'utf8');

      const root = jscs(test);
      requiresTransform(root, {
        moduleMap: DefaultModuleMap,
        blacklist: new Set(['requires.removeUnusedRequires']),
      });
      const actual = printRoot(root);

      const expected = await fsPromise.readFile(expectedPath, 'utf8');
      expect(actual).toBe(expected);
    });
  });
});
