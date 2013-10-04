# grunt-transbrute

> Publish project files using Git.

The goal of this plugin is to simplify the use of Git as a transport
channel for publishing files from your project to the web. An example
use case would be publishing documentation sources that live in the same
repository as your project's code to the web using GitHub Pages.

transbrute creates a throwaway Git repository, adds those parts of your
project that you specified, and pushes them to the remote repository you
specified.

[![Build Status](https://travis-ci.org/knuton/grunt-transbrute.png?branch=master)](https://travis-ci.org/knuton/grunt-transbrute)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to
check out the [Getting Started](http://gruntjs.com/getting-started)
guide, as it explains how to create a
[Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and
use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-transbrute --save-dev
```

Once the plugin has been installed, it may be enabled inside your
Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-transbrute');
```

## The "transbrute" task

### Overview
In your project's Gruntfile, add a section named `transbrute` to the
data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  transbrute: {
    target: {
      message: 'Add foo on %DATE',
      remote: 'git@github.com:you/foo.git',
      branch: 'target-branch',
      tag: '0.1.3',
      tagMessage: 'Release 0.1.3',
      pull: true,
      force: false,
      files: [
        { src: '**/*', expand: true, cwd: 'docs/' },
        { dest: 'relative_path', body: 'str' },
        { dest: 'relative_path_2', body: {a: 1} }
      ]
    },
  },
})
```

### Target Options

#### remote
Type: `String`

The URI for the remote repository. Required.

#### branch
Type: `String`

The name of the remote branch. Required.

#### message
Type: `String`
Default value: `'Add <TARGET_NAME> from <TIMESTAMP>'`

The commit message to use. An occurrence of `%DATE` in the string will
be replaced by the current timestamp in ISO format.

#### tag
Type: `String`

If a tag identifier is given, the commit will be tagged before being
pushed. Can be combined with `tagMessage`.

#### tagMessage
Type: `String`

If in addition to a tag identifier a tag message is given, the tag will
be annotated with this message.If `tag` is not provided, `tagMessage`
will be ignored.

#### pull
Type: `Boolean`
Default value: `true`

If `true`, contents of the remote repository will be pulled before files
are processed and committed.

#### force
Type: `Boolean`
Default value: `false`

If `true`, the commit will be force-pushed.

#### files
Type: `Array`

A list of files to use. You can specify files that are actually present
in the filesystem in the usual Grunt way, but you should set the `cwd`
option to the directory from which the files have relative paths that
equal those you want them to have in the repository.

Additionally, you can add files inline by giving their relative path
within the repository as `dest` and specifying their body as `body`.
`body` can either be a string, which will be written to the file, or a
JSON-serializable object, which will first be pretty-printed using
`JSON.stringify` and then written to the file.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing
coding style. Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### 0.1.1 Bugfix (2013/06/30)
* Fixed issue with commit message containing doublequotes

### 0.1.0 Initial release
