/*
 * grunt-transbrute
 * https://github.com/knuton/grunt-transbrute
 *
 * Copyright (c) 2013 Johannes Emerich
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Mocks/spys for testing
  
  var path = require('path');

  var spawn = function (cfg, handler) {
    var logfile = path.join(cfg.opts.cwd, 'gitlog'),
        logs,
        cmd = [cfg.cmd].concat(cfg.args).join(' ');
    logs = grunt.file.exists(logfile) ? grunt.file.readJSON(logfile) : [];
    logs.push(cmd);
    grunt.file.write(logfile, JSON.stringify(logs));
    handler(null, null, 0);
  };

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    transbrute: {
      default_options: {
        remote: 'git@github.com:knuton/invisibility.git',
        branch: 'jungs-hier-kommt-der-master-branch',
        files: [
          { src: '**/*', cwd: 'test/fixtures', expand: true },
          { dest: 'info.json', body: { name: 'invisibility', version: '0.0.0' } },
          { dest: 'fixed.txt', body: 'NOTHING TO SEE.' },
          { dest: 'level/two', body: 'Nested' }
        ],
        remove: false,
        spawn: spawn, temp: { path: function () { return path.join('tmp', 'default_options'); } }
      },
      custom_options: {
        remote: 'git@github.com:knuton/invisibility.git',
        branch: 'jungs-hier-kommt-der-master-branch',
        message: 'Add test data to master branch',
        pull: false,
        force: true,
        files: [
          { src: '**/*', cwd: 'test/fixtures', expand: true }
        ],
        remove: false,
        spawn: spawn, temp: { path: function () { return path.join('tmp', 'custom_options'); } }
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'transbrute', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
