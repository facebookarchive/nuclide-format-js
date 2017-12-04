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

type ErrorWithLocation = {loc?: {line: number, column: number}};

type ServiceParams = {
  addedRequires?: boolean,
  missingExports?: boolean,
};

async function formatCode(
  sourceOptions: SourceOptions,
  parameters: {
    addedRequires?: boolean,
    missingExports?: boolean,
    editor?: TextEditor,
  } = {},
): Promise<void> {
  const editor = parameters.editor || atom.workspace.getActiveTextEditor();
  if (!editor) {
    // eslint-disable-next-line no-console
    console.log('- format-js: No active text editor');
    return;
  }

  const options = dontAddRequiresIfUsedAsService(sourceOptions, parameters);

  // Save things
  const buffer = editor.getBuffer();
  const inputSource = buffer.getText();

  // Auto-require transform.
  const {outputSource, error} = transformCodeOrShowError(
    inputSource,
    options,
    parameters,
  );

  // Update position if source has a syntax error
  if (error && atom.config.get('nuclide-format-js.moveCursorToSyntaxError')) {
    const position = syntaxErrorPosition(error);
    if (position) {
      editor.setCursorBufferPosition(position);
    }
  }

  // Update the source and position after all transforms are done. Do nothing
  // if the source did not change at all.
  if (outputSource === inputSource) {
    return;
  }

  buffer.setTextViaDiff(outputSource);

  // Save the file if that option is specified.
  if (atom.config.get('nuclide-format-js.saveAfterRun')) {
    editor.save();
  }
}


function transformCodeOrShowError(
  inputSource: string,
  options: SourceOptions,
  parameters: ServiceParams,
): {outputSource: string, error?: ErrorWithLocation} {
  const {transform} = require('../common');
  // TODO: Add a limit so the transform is not run on files over a certain size.
  let outputSource;
  try {
    outputSource = transform(inputSource, options);
  } catch (error) {
    showErrorNotification(error, parameters);
    return {outputSource: inputSource, error};
  }
  dismissNotification(ERROR_TITLE(parameters));
  dismissNotification(INFO_TITLE(parameters));
  if (
    outputSource === inputSource &&
    // Do not confirm success if user opted out
    atom.config.get('nuclide-format-js.confirmNoChangeSuccess')
  ) {
    if (parameters.missingExports) {
      showMissingExportsNotification(parameters);
    } else {
      showSuccessNotification(parameters);
    }
  }
  return {outputSource};
}

const ERROR_TITLE = parameters => notificationTitle(parameters, 'failed');

function showErrorNotification(error: Error, parameters: ServiceParams): void {
  const title = ERROR_TITLE(parameters);
  dismissNotification(title);
  atom.notifications.addError(title, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true,
  });
}

const SUCCESS_TITLE = parameters => notificationTitle(parameters, 'succeeded');

const notificationTimeouts = {};
function showSuccessNotification(parameters: ServiceParams): void {
  const title = SUCCESS_TITLE(parameters);
  dismissExistingNotification(title);
  atom.notifications.addSuccess(title, {
    detail: 'No changes were needed.',
    dismissable: true,
  });
  timeoutNotification(title);
}

function timeoutNotification(title: string) {
  notificationTimeouts[title] = setTimeout(() => {
    dismissExistingNotification(title);
  }, 2000);
}

function dismissExistingNotification(title: string): void {
  dismissNotification(title);
  clearTimeout(notificationTimeouts[title]);
}

const INFO_TITLE = parameters =>
  notificationTitle(parameters, 'couldn\'t fix all problems');

function showMissingExportsNotification(parameters: ServiceParams): void {
  const title = INFO_TITLE(parameters);
  dismissNotification(title);
  atom.notifications.addInfo(title, {
    detail: 'Exports for these references couldn\'t be determined. ' +
      'Either there are multiple possible export candidates, ' +
      'or none exist, or the Language Server or Flow are still ' +
      'initializing.',
    dismissable: true,
  });
}

function dismissNotification(title: string): void {
  atom.notifications.getNotifications()
    .filter(notification => notification.getMessage() === title)
    .forEach(notification => notification.dismiss());
}

function notificationTitle(parameters: ServiceParams, message: string): string {
  return (
    (parameters.addedRequires != null
      ? 'Nuclide JS Imports: Auto Require '
      : 'Nuclide Format JS: Fix Requires') +
    message
  );
}

function syntaxErrorPosition(error: ErrorWithLocation): ?[number, number] {
  const {line, column} = error.loc || {};
  return Number.isInteger(line) && Number.isInteger(column)
    ? [line - 1, column]
    : null;
}

function dontAddRequiresIfUsedAsService(
  sourceOptions: SourceOptions,
  parameters: {addedRequires?: boolean},
): SourceOptions {
  const blacklist = new Set(sourceOptions.blacklist);
  if (parameters.addedRequires != null) {
    blacklist
      .add('requires.addMissingRequires')
      .add('requires.addMissingTypes');
  }
  return {
    ...sourceOptions,
    blacklist,
  };
}

module.exports = formatCode;
