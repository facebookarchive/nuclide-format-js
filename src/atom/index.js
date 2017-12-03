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
import type {Settings} from './settings';

import {CompositeDisposable} from 'atom';

let subscriptions: ?CompositeDisposable = null;
let options: SourceOptions = (null: any); // always initialized

export function activate(state: ?Object): void {
  if (subscriptions) {
    return;
  }

  require('regenerator-runtime/runtime');
  const formatCode = require('./formatCode');
  const {calculateOptions, observeSettings} = require('./settings');

  const localSubscriptions = new CompositeDisposable();

  // Keep settings up to date with Nuclide config and precalculate options.
  let settings: Settings = (null: any); // always initialized
  localSubscriptions.add(observeSettings(newSettings => {
    settings = newSettings;
    options = calculateOptions(settings);
  }));

  if (!settings.useAsService) {
    atom.keymaps.add('nuclide-format-js', {
      'atom-text-editor': {
        'cmd-shift-i': 'nuclide-format-js:organize-requires',
      },
    });
    localSubscriptions.add(atom.commands.add(
      'atom-text-editor',
      'nuclide-format-js:organize-requires',
      // Atom prevents in-command modification to text editor content.
      () => process.nextTick(() => formatCode(options)),
    ));
  }

  // Format code on save if settings say so
  localSubscriptions.add(atom.workspace.observeTextEditors(editor => {
    localSubscriptions.add(editor.onDidSave(() => {
      if (settings.runOnSave) {
        process.nextTick(() => formatCode(options, {editor}));
      }
    }));
  }));

  // Work around flow refinements.
  subscriptions = localSubscriptions;
}

export function provideOrganizeRequires(): boolean => void {
  const formatCode = require('./formatCode');
  return addedRequires => {
    formatCode(options, {addedRequires});
  };
}

export function deactivate(): void {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}
