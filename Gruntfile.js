/*
 * git-version
 * https://github.com/bushee/git-version
 *
 * Copyright (c) 2015 Jerzy Jelinek, 2016 Krzysztof "Bushee" Nowaczyk
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
