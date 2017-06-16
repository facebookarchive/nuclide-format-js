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

if (typeof atom !== 'undefined' && typeof atom.getCurrentWindow === 'function') {
  module.exports = require('./atom');
} else {
  module.exports = {
    ...require('./common'),
  };
}
