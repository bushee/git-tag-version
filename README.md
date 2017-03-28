# git-tag-version

> Calculate project version from git tags.

This module provides a function that calculates and returns project's current version based on git tags.
It is very useful when you need to calculate your project version in CI or deployment plans.

*This moudle has been based on and is a more generalised (framework-agnostic) version of [**grunt-release-plugin**](https://github.com/jln-pl/grunt-release-plugin) by Jerzy Jelinek.*

## Getting Started

```shell
npm install git-tag-version --save-dev
```

Once the module has been installed, just load it in your node project:

```js
var gitVersion = require('git-tag-version');
```

## Usage

```js
gitVersion(options);
```

Parameter `options` is optional. It may contain these options:
- `uniqueSnapshot` (default = `false`)\
    if false, snapshot versions will be suffixed with just `-SNAPSHOT`, e.g. `1.0.0-SNAPSHOT`;
    otherwise, current abbreviated git commit's hash will be appended as well, e.g. `1.0.0-SNAPSHOT.c1b653ff` 

### Examples

```shell
git init
touch file.js
git add file.js
git commit -m "add file.js"
git tag -a v0.1.0 -m "v0.1.0"
```

```js
console.log(gitVersion()); // will print "0.1.0"
```

```shell
touch file2.js
git add file2.js
git commit -m "add file2.js"
```

```js
console.log(gitVersion()); // will print "0.1.1-SNAPSHOT"
console.log(gitVersion({uniqueSnapshot: true})); // will print something like "0.1.1-SNAPSHOT.c1b653ff"
```

```shell
git tag -a v0.1.1 -m "v0.1.1"
```

```js
console.log(gitVersion()); // will print "0.1.1"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
