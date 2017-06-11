/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

/* globals atom */

import type {SourceOptions} from '../common/options/SourceOptions';

import updateCursor from '../update-cursor';

async function formatCode(options: SourceOptions, editor_: ?TextEditor): Promise<void> {
  const editor = editor_ || atom.workspace.getActiveTextEditor();
  if (!editor) {
    // eslint-disable-next-line no-console
    console.log('- format-js: No active text editor');
    return;
  }

  // Save things
  const buffer = editor.getBuffer();
  const inputSource = buffer.getText();

  // Auto-require transform.
  // TODO: Add a limit so the transform is not run on files over a certain size.
  const {transform} = require('../common');
  const outputSource = transform(inputSource, options);

  // Update the source and position after all transforms are done. Do nothing
  // if the source did not change at all.
  if (outputSource === inputSource) {
    return;
  }

  const range = buffer.getRange();
  const position = editor.getCursorBufferPosition();
  editor.setTextInBufferRange(range, outputSource);
  const {row, column} = updateCursor(inputSource, position, outputSource);
  editor.setCursorBufferPosition([row, column]);

  // Save the file if that option is specified.
  if (atom.config.get('nuclide-format-js.saveAfterRun')) {
    editor.save();
  }
}

module.exports = formatCode;
