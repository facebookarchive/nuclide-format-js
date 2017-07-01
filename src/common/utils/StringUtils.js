/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

function capitalize(word: string): string {
  if (word.length === 0) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * This is pulled out into its own function rather than using localeCompare
 * directly in case we every choose another sorting algorithm. Such as some
 * sort of natural compare algorithm.
 */
function compareStrings(one: ?string, two: ?string): number {
  return (one || '').localeCompare(two || '', {caseFirst: 'lower'});
}

function compareStringsCapitalsLast(one: ?string, two: ?string): number {
  const byCapitalization =
    Number(isCapitalized(one || '')) - Number(isCapitalized(two || ''));
  return byCapitalization !== 0
    ? byCapitalization
    : compareStrings(one, two);
}

function isCapitalized(name: string): boolean {
  return (
    name.length > 0 &&
    name.charAt(0).toLowerCase() !== name.charAt(0)
  );
}

function isLowerCase(name: string): boolean {
  return name.toLowerCase() === name;
}

module.exports = {
  capitalize,
  compareStrings,
  compareStringsCapitalsLast,
  isCapitalized,
  isLowerCase,
};
