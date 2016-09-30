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
  let editor = editor_;
  editor = editor || atom.workspace.getActiveTextEditor();
  if (!editor) {
    // eslint-disable-next-line no-console
    console.log('- format-js: No active text editor');
    return;
  }

  // Save things
  const buffer = editor.getBuffer();
  const oldSource = buffer.getText();
  let source = oldSource;

  // Reprint transform.
  if (atom.config.get('nuclide-format-js.reprint')) {
    const reprint = require('../reprint-js');
    // $FlowFixMe(kad) -- this seems to conflate an class instance with an ordinary object.
    const reprintResult = reprint(source, {
      maxLineLength: 80,
      useSpaces: true,
      tabWidth: 2,
    });
    source = reprintResult.source;
  }

  // Auto-require transform.
  // TODO: Add a limit so the transform is not run on files over a certain size.
  const {transform} = require('../common');
  source = transform(source, options);

  // Update the source and position after all transforms are done. Do nothing
  // if the source did not change at all.
  if (source === oldSource) {
    return;
  }

  const range = buffer.getRange();
  const position = editor.getCursorBufferPosition();
  editor.setTextInBufferRange(range, source);
  const {row, column} = updateCursor(oldSource, position, source);
  editor.setCursorBufferPosition([row, column]);

  // Save the file if that option is specified.
  if (atom.config.get('nuclide-format-js.saveAfterRun')) {
    editor.save();
  }
}

module.exports = formatCode;
