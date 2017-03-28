/*
 * git-tag-version
 * https://github.com/bushee/git-tag-version
 * 
 * Copyright (c) 2015 Jerzy Jelinek, 2016 Krzysztof "Bushee" Nowaczyk
 * Licensed under the MIT license.
 */

'use strict';

var cp = require('child_process');

module.exports = function (options) {
    options = options || {};
    var uniqueSnapshot = options.uniqueSnapshot || false;

    function getVersion() {
        var lastTag,
            lastCommit,
            versionFromTag;

        lastTag = getLastTag();
        versionFromTag = getVersionFromTag(lastTag);
        lastCommit = getLastCommit(lastTag);

        if (tagContainsCommit(lastCommit)) {
            return versionFromTag;
        }
        return generateSnapshotVersion(versionFromTag);
    }

    function getLastTag() {
        try {
            var lastTagCommand = 'git describe --abbrev=0 --tags';
            return cp.execSync(lastTagCommand, {cwd: '.'}).toString();
        } catch (e) {
            console.error('Repository does not contain tags, defaulting to version 0.0.0');
            return '0.0.0';
        }
    }

    function getLastCommit() {
        try {
            var lastCommitCommand = 'git rev-parse --short HEAD';
            return cp.execSync(lastCommitCommand, {cwd: '.'}).toString().trim();
        } catch (e) {
            console.error('Cannot read last commit hash');
            return '';
        }
    }

    function tagContainsCommit(commit) {
        try {
            var compareCommand = 'git tag --contains ' + commit;
            return cp.execSync(compareCommand, {cwd: '.'}).toString().trim().length !== 0;
        } catch (e) {
            console.error('Checking if tag contains commit failed');
            return false;
        }
    }

    function getVersionFromTag(tag) {
        return tag.match(/[\d\.+]+/)[0];
    }

    function generateSnapshotVersion(version) {
        var versionPrefix,
            patch = getPatch(version);
        if (version === '0.0.0') {
            versionPrefix = '0.1.0';
        } else {
            versionPrefix = version.slice(0, patch.index) + patch.value;
        }
        try {
            var getBranchName = 'git rev-parse --abbrev-ref HEAD',
                branchNameTrimmed;
            branchNameTrimmed = cp.execSync(getBranchName, {cwd: '.'}).toString().trim().replace('/', '-');
            if (branchNameTrimmed === 'master') {
                return versionPrefix + getSnapshotSuffix();
            }
            return versionPrefix + '-' + branchNameTrimmed + getSnapshotSuffix();
        } catch (e) {
            console.error('Checking branch name failed');
            return versionPrefix + getSnapshotSuffix();
        }
    }

    function getPatch(version) {
        var patchIndex = version.lastIndexOf('.') + 1;

        return {
            index: patchIndex,
            value: parseInt(version.substr(patchIndex, version.length), 10) + 1
        };
    }

    function getSnapshotSuffix() {
        return uniqueSnapshot ? '-SNAPSHOT.' + getLastCommit() : '-SNAPSHOT';
    }

    return getVersion();
};
