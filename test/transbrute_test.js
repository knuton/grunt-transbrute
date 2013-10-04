'use strict';

var grunt = require('grunt'),
    path  = require('path'),
    _     = require('lodash');

var compareGitlog = function (test, logfile, expectations) {
  var commands = grunt.file.readJSON(logfile);
  expectations.forEach(function (expectedCommand, index) {
    test.ok(
      _.zip(expectedCommand, commands[index]).every(function (ab) {
        // `expected` is either string or regex to match against `actual`
        var expected = ab[0], actual = ab[1];
        return typeof expected === 'string' ?
          expected === actual :
          expected.test(actual);
      }),
      'expected [' + expectedCommand + '], got [' + commands[index] + ']'
    );
  });
};

exports.transbrute = {
  default_options: function(test) {
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

    compareGitlog(test, 'tmp/default_options/gitlog', [
      ['git', 'init', '.'],
      ['git', 'remote', 'add', 'origin', 'git@github.com:knuton/invisibility.git'],
      ['git', 'pull', 'origin', 'refs/heads/jungs-hier-kommt-der-master-branch'],
      ['git', 'add', '.'],
      ['git', 'commit', '-m', /Add default_options from \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+\w/],
      ['git', 'push', 'origin', 'master:refs/heads/jungs-hier-kommt-der-master-branch', '--tags']
    ]);

    test.done();
  },
  custom_options: function(test) {
    compareGitlog(test, 'tmp/custom_options/gitlog', [
      ['git', 'init', '.'],
      ['git', 'remote', 'add', 'origin', 'git@github.com:knuton/invisibility.git'],
      ['git', 'add', '.'],
      ['git', 'commit', '-m', 'Add test data to master branch'],
      ['git', 'tag', '0.0.0'],
      ['git', 'push', 'origin', 'master:refs/heads/jungs-hier-kommt-der-master-branch', '--tags', '--force']
    ]);

    test.done();
  },
  tag_message: function(test) {
    compareGitlog(test, 'tmp/tag_message/gitlog', [
      ['git', 'init', '.'],
      ['git', 'remote', 'add', 'origin', 'git@github.com:knuton/invisibility.git'],
      ['git', 'pull', 'origin', 'refs/heads/jungs-hier-kommt-der-master-branch'],
      ['git', 'add', '.'],
      ['git', 'commit', '-m', /.*/],
      ['git', 'tag', '--annotate', '-m', 'Version 0.0.0.', '0.0.0'],
      ['git', 'push', 'origin', 'master:refs/heads/jungs-hier-kommt-der-master-branch', '--tags']
    ]);

    test.done();
  }
};
