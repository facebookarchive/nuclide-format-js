/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import updateCursor from '../update-cursor';

function writeChanges(editor: TextEditor, inputSource_: string, outputSource: string): void {
  const inputSource = validInputSource(inputSource_);
  const buffer = editor.getBuffer();
  const [startIndex, endIndex] = indecesOfDifference(inputSource, outputSource);
  const start = buffer.positionForCharacterIndex(startIndex);
  const end = buffer.positionForCharacterIndex(inputSource.length - endIndex);

  const cursor = editor.getCursorBufferPosition();
  editor.setTextInBufferRange([start, end], outputSource.slice(startIndex, -endIndex));

  if (cursor.isGreaterThan(start) && cursor.isLessThan(end)) {
    const {row, column} = updateCursor(inputSource, cursor, outputSource);
    editor.setCursorBufferPosition([row, column]);
  }
}

function indecesOfDifference(a, b) {
  const len = Math.min(a.length, b.length);
  const aLast = a.length - 1;
  const bLast = b.length - 1;
  let i;
  for (i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      break;
    }
  }
  let j;
  for (j = 0; j < len; j++) {
    if (a[aLast - j] !== b[bLast - j] || aLast - j <= i || bLast - j <= i) {
      break;
    }
  }
  return [i, j];
}

function validInputSource(inputSource) {
  return inputSource[inputSource.length - 1] === '\n' ? inputSource : inputSource + '\n';
}

module.exports = writeChanges;
