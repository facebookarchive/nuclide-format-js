# nuclide-format-js

[![Build Status](https://travis-ci.org/facebooknuclide/nuclide-format-js.svg?branch=master)](https://travis-ci.org/facebooknuclide/nuclide-format-js)

Use this [Atom](https://atom.io/) plugin to automatically add `require` and `import` statements for values and types in your JavaScript.

## Usage

The default keyboard shortcut for `nuclide-format-js:format` is `cmd-shift-i`.

## Details

This collection of codemods automatically adds, removes, and formats your requires. It is primarily
a heuristic that works by requiring identifiers that are being used that were not declared. It is
also aware of Flow types and will properly promote type imports to requires, and demote requires to
type imports when appropriate.

There are a few best practices that you should follow in order to get the most benefit out of these
transforms:

+ Don't shadow require names anywhere in the file. The transform is very minimally aware of scope.
+ Don't alias requires (unless you specify the alias in the aliases setting).
+ Destructure in a line separate from the require:

```js
var React = require('react');
var {PropTypes} = React;
```

### Ordering Rules

It is good to keep a consistent ordering of lists to avoid most merge conflicts. You do not need to
remember the ordering specified here, it has been chosen to give good results and this plugin will
automatically follow it.

There are 4 groups separated by a blank line:

1. type `import`s
2. bare `require`s
3. `require`s assigned to capitalized names (including in destructuring)
4. `require`s assigned to uncapitalized names (including at least one in destructuring)

For example:

```
import type A from 'a';

require('b');

const C = require('c');

const d = require('d');
```

Each group is then ordered by the module name (the string on the right hand side), ignoring
its letter casing. The reason for using the module name as opposed to the type or value names
on the left hand side is that with changing names in destructuring it is more likely that lines
would shift, causing merge conflicts. Destructuring lists are also sorted by imported names,
with uncapitalized names grouped first.

### Scope

There are also a few things that are not supported yet that would be nice to support:

+ Relative requires, e.g. `require('../lib/module');`
+ Only add requires for known modules by maintaining a list of known modules, or by getting this
information from Flow.
+ Allow per-directory configurations.

Right now the recommended set up is to not run-on-save and instead use the default
keyboard shortcut.

Make sure to verify the requires that are added by this plugin and report any issues. If anything
is getting in your way when using this plugin you can generally work around it by modifying the
plugin's settings. It's possible to adjust things like built-ins, aliases, and even blacklist
particular transforms there.

## Developing

```sh
# Clone the repo
git clone git@github.com:facebooknuclide/nuclide-format-js.git

cd nuclide-format-js

# To use as an Atom package
apm link

# Install dependencies and start the transpiler watcher
yarn install
yarn run watch
```

## Releasing

* Make sure that `master` is up-to-date.

```sh
# Bump the version number
yarn version --no-git-tag-version

# Commit the version bump
git add package.json
git commit -m "$(node -p 'require("./package.json").version')"

# Run the release script
./tools/release.sh

# Follow the printed instructions if everything looks good
```