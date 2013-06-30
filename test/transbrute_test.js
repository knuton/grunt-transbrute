'use strict';

var grunt = require('grunt'),
    path  = require('path'),
    _     = require('lodash');

// Test helper
var compareParamwise = function (ab) {
  // expect pairs of expected and actual params
  // a is either string or regex to match against b
  var a = ab[0],
      b = ab[1];
  return typeof a === 'string' ? a === b : a.test(b);
};

exports.transbrute = {
  default_options: function(test) {
    test.expect(12);

    ['123', 'testing', path.join('folder', 'file')].forEach(function (filename) {
      test.equal(
        grunt.file.read(path.join('tmp/default_options', filename)),
        grunt.file.read(path.join('test/expected/default_options', filename)),
        'mismatch in copied files'
      );
    });

    ['info.json', 'fixed.txt', 'level/two'].forEach(function (filename) {
      test.equal(
        grunt.file.read(path.join('tmp/default_options', filename)),
        grunt.file.read(path.join('test/expected/default_options', 'inline', filename)),
        'mismatch in inline files'
      );
    });

    var commands = grunt.file.readJSON('tmp/default_options/gitlog');
    [
      ['git', 'init', '.'],
      ['git', 'remote', 'add', 'origin', 'git@github.com:knuton/invisibility.git'],
      ['git', 'pull', 'origin', 'refs/heads/jungs-hier-kommt-der-master-branch'],
      ['git', 'add', '.'],
      ['git', 'commit', '-m', /Add default_options from \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+\w/],
      ['git', 'push', 'origin', 'master:refs/heads/jungs-hier-kommt-der-master-branch']
    ].forEach(function (expectedCommand, index) {
      test.ok(
        _.zip(expectedCommand, commands[index]).every(compareParamwise),
        'expected [' + expectedCommand + '], got [' + commands[index] + ']'
      );
    });

    test.done();
  },
  custom_options: function(test) {
    test.expect(5);

    var commands = grunt.file.readJSON('tmp/custom_options/gitlog');
    [
      ['git', 'init', '.'],
      ['git', 'remote', 'add', 'origin', 'git@github.com:knuton/invisibility.git'],
      ['git', 'add', '.'],
      ['git', 'commit', '-m', 'Add test data to master branch'],
      ['git', 'push', 'origin', 'master:refs/heads/jungs-hier-kommt-der-master-branch', '--force']
    ].forEach(function (expectedCommand, index) {
      test.ok(
        _.zip(expectedCommand, commands[index]).every(compareParamwise),
        'expected [' + expectedCommand[index] + '], got [' + commands[index] + ']'
      );
    });

    test.done();
  }
};
