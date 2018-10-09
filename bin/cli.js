#!/usr/bin/env node

var gitTagVersion = require('../src/git-tag-version');

var options = {
    uniqueSnapshot: process.argv.some(function (arg) {
        return arg === '--uniqueSnapshot' || arg === '--unique-snapshot';
    })
};

console.log(gitTagVersion(options));