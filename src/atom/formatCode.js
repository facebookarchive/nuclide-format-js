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
  const outputSource = transformCodeOrShowError(inputSource, options);

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


function transformCodeOrShowError(inputSource: string, options: SourceOptions): string {
  const {transform} = require('../common');
  // TODO: Add a limit so the transform is not run on files over a certain size.
  let outputSource;
  try {
    outputSource = transform(inputSource, options);
  } catch (error) {
    showErrorNotification(error);
    return inputSource;
  }
  dismissExistingErrorNotification();
  if (outputSource === inputSource) {
    showSuccessNotification();
  }
  return outputSource;
}

const ERROR_TITLE = 'nuclide-format-js failed';

function showErrorNotification(error: Error): void {
  dismissExistingErrorNotification();
  dismissExistingSuccessNotification();
  atom.notifications.addError(ERROR_TITLE, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true,
  });
}

function dismissExistingErrorNotification(): void {
  dismissNotification(ERROR_TITLE);
}

const SUCCESS_TITLE = 'nuclide-format-js succeeded';

let dismissSuccessNotificationTimeout;
function showSuccessNotification(): void {
  dismissExistingSuccessNotification();
  atom.notifications.addSuccess(SUCCESS_TITLE, {
    detail: 'No changes were needed.',
    dismissable: true,
  });
  dismissSuccessNotificationTimeout = setTimeout(() => {
    dismissExistingSuccessNotification();
  }, 2000);
}

function dismissExistingSuccessNotification(): void {
  dismissNotification(SUCCESS_TITLE);
  clearTimeout(dismissSuccessNotificationTimeout);
}

function dismissNotification(title: string): void {
  atom.notifications.getNotifications()
    .filter(notification => notification.getMessage() === title)
    .forEach(notification => notification.dismiss());
}

module.exports = formatCode;
