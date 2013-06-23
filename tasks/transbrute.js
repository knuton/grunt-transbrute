/*
 * grunt-transbrute
 * https://github.com/knuton/grunt-transbrute
 *
 * Copyright (c) 2013 Johannes Emerich
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('transbrute', 'Use a throwaway Git repository to transport files', function () {
    // Gather config data/set defaults
    if (!this.data.remote) grunt.fail.fatal("No remote specified.");
    if (!this.data.branch) grunt.fail.fatal("No branch specified.");
    var target = this.target,
        message = this.data.message || "Add " + target + " from %DATE",
        files = this.files,
        remote = this.data.remote,
        branch = this.data.branch,
        pull = typeof this.data.pull === 'boolean' ? this.data.pull : true,
        force = typeof this.data.force === 'boolean' ? this.data.force : false,
        // The following dependency injection vectors are mostly for debugging
        // and testing and not part of the API, i.e. can not be relied on.
        remove = typeof this.data.remove === 'boolean' ? this.data.remove : true,
        copy = this.data.copy || grunt.file.copy,
        write = this.data.write || grunt.file.write,
        spawn = this.data.spawn || grunt.util.spawn,
        temp = this.data.temp || require('temp');

    var path = require('path'),
        continuation = this.async(),
        tmpDirPath = temp.path();

    // Create temp dir
    grunt.file.mkdir(tmpDirPath);

    // Build list of commands
    var steps = [];
    steps.push(gitCMD('init', '.'));
    steps.push(gitCMD('remote', 'add', 'origin', remote));

    if (pull) steps.push(gitCMD('pull', 'origin', 'refs/heads/'+branch));

    // Copy files to temp dir
    steps.push(function (next) {
      files.forEach(function (f) {
        if (f.src && grunt.file.isFile(f.src.toString())) {
          copy(f.src, path.join(tmpDirPath, f.dest));
        } else if (f.dest && typeof f.body === 'string') {
          write(path.join(tmpDirPath, f.dest), f.body);
        } else if (f.dest && typeof f.body === 'object') {
          write(path.join(tmpDirPath, f.dest), JSON.stringify(f.body, null, 2));
        }
      });
      next();
    });

    steps.push(gitCMD('add', '.'));
    steps.push(gitCMD('commit', '-m', '"' + message.replace(/%DATE\b/, (new Date()).toISOString()) + '"'));

    if (force)
      steps.push(gitCMD('push', 'origin', 'master:refs/heads/'+branch, '--force'));
    else
      steps.push(gitCMD('push', 'origin', 'master:refs/heads/'+branch));

    // After finishing:
    // Clean up and notify grunt about task being finished
    var done = function () {
      if (remove) grunt.file.delete(tmpDirPath, {force: true});
      grunt.log.ok("Pushed " + target + " to " + branch + ".");
      continuation();
    };

    // Run steps in sequence
    grunt.util.async.series(steps, done);

    // Helper for creating git command runners
    function gitCMD () {
      var args = Array.prototype.slice.apply(arguments);
      return function runner (next) {
        function handler (error, result, code) {
          if (code === 0)
            next(error);
          else {
            if (remove && !grunt.option('force')) grunt.file.delete(tmpDirPath, {force: true});
            grunt.fail.warn(result.toString());
          }
        }
        spawn({cmd: "git", args: args, opts: {cwd: tmpDirPath}}, handler);
      };
    }
  });
};

