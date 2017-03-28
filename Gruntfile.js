/*
 * git-tag-version
 * https://github.com/bushee/git-tag-version
 *
 * Copyright (c) 2015 Jerzy Jelinek, 2016-2017 Krzysztof "Bushee" Nowaczyk
 * Licensed under the MIT license.
 */

'use strict';

var gitVersion = require('./src/git-tag-version');

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'src/*.js',
                'test/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: ''
            }
        },

        nodeunit: {
            tests: ['test/*.spec.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('current-version', function () {
        console.log('Current project version is ' + gitVersion());
    });

    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);
};
