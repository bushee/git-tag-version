'use strict';

var shell = require('shelljs');
var tk = require('timekeeper');

var gitVersion = require('../src/git-tag-version');

function createCommit() {
    shell.cd(__dirname + '/test-repo');
    shell.touch('test-file.js');
    shell.echo('x').toEnd('test-file.js');
    shell.exec('git add test-file.js');
    shell.exec('git commit -m "another commit"');
    return shell.exec('git rev-parse --short HEAD').trim();
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
        tk.reset();
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
        switchBranch('newBranch');
        createCommit();

        // when
        var version = gitVersion();

        // then
        test.equal(version, '1.0.1-newBranch-SNAPSHOT');
    }),

    "snapshot version generated with uniqueSnapshot option should contain commit hash": wrapTest(function (test) {
        // given
        createTag('myproject-1.0.0');
        switchBranch('newBranch');
        createCommit();
        var time = new Date(Date.UTC(2017, 8, 20, 10, 45, 33, 123));
        tk.freeze(time);

        // when
        var version = gitVersion({uniqueSnapshot: true});

        // then
        test.equal(version, '1.0.1-newBranch-SNAPSHOT.20170920104533123');
    }),

    "any semver-incompatible characters in branch name should be replaced with dash": wrapTest(function (test) {
        // given
        createTag('myproject-1.0.0');
        switchBranch('a/b/c_d_e@#{}f');
        createCommit();

        // when
        var version = gitVersion();

        // then
        test.equal(version, '1.0.1-a-b-c-d-e----f-SNAPSHOT');
    })
};
