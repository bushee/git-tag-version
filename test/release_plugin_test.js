'use strict';

var shell = require('shelljs');

var gitVersion = require('../src/git-version');

function createCommit() {
    shell.cd(__dirname + '/test-repo');
    shell.touch('test-file.js');
    shell.echo('x').toEnd('test-file.js');
    shell.exec('git add test-file.js');
    shell.exec('git commit -m "another commit"');
}

function createTag(version) {
    shell.cd(__dirname + '/test-repo');
    shell.exec('git tag -a test-' + version + ' -m "test-' + version + '1"');
}

function switchBranch(branchName) {
    shell.exec('git checkout -b ' + branchName);
}

function wrapTest(testFunc, assertionsCount) {
    return function (test) {
        test.expect(assertionsCount || 1);
        testFunc(test);
        test.done();
    };
}

module.exports = {
    setUp: function (done) {
        shell.cd(__dirname);
        shell.mkdir('test-repo');
        shell.cd('test-repo');
        shell.exec('git init');
        createCommit();
        done();
    },

    tearDown: function (done) {
        shell.cd(__dirname);
        shell.rm('-rf', 'test-repo');
        done();
    },

    "no tag should result in 0.1.0-SNAPSHOT": wrapTest(function (test) {
        // when
        var version = gitVersion();

        // expect
        test.equal(version, '0.1.0-SNAPSHOT');
    }),

    "being on some tag should result in proper version": wrapTest(function (test) {
        // given
        createTag('myproject-1.0.0');

        // when
        var version = gitVersion();

        // then
        test.equal(version, '1.0.0');
    }),

    "being on untagged commit should result in next version's snapshot": wrapTest(function (test) {
        // given
        createTag('myproject-2.3.4');
        createCommit();

        // when
        var version = gitVersion();

        // then
        test.equal(version, '2.3.5-SNAPSHOT');
    }),

    "being on untagged commit on branch should result in next version's branch snapshot": wrapTest(function (test) {
        // given
        createTag('myproject-1.0.0');
        switchBranch('feature/newBranch');
        createCommit();

        // when
        var version = gitVersion();

        // then
        test.equal(version, '1.0.1-feature-newBranch-SNAPSHOT');
    })
};
