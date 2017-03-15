# disk-action

[![NPM](https://nodei.co/npm/disk-action.png?compact=true)](https://nodei.co/npm/disk-action/)

[![Downloads per month](https://img.shields.io/npm/dm/disk-action.svg?maxAge=2592000)](https://www.npmjs.org/package/disk-action)
[![npm version](https://img.shields.io/npm/v/disk-action.svg)](https://www.npmjs.org/package/disk-action)
[![Build Status](https://travis-ci.org/x42en/Disk_action.svg?branch=master)](https://travis-ci.org/x42en/Disk_action)
[![Dependencies](https://david-dm.org/x42en/disk-action.svg)](https://www.npmjs.org/package/disk-action)

Easy to use module in order to create / delete / modify files and directory.
All unexistent directories will be create 'on-the-fly', and delete works for either file or directory. ** BE CAREFUL ** when specifying directory: all content will be erased !!

**Important:** This package is **NOT** backward compatible with 0.1.x versions... Be careful if you update your npm project...


## Install

Install with npm:
  ```sh
    npm install disk-action
  ```

## Basic Usage

Require the module:
  ```coffeescript
    Disk = require 'disk-action'
  ```

Initialize with encoding _(default is 'utf-8')_:
  ```coffeescript
    disk = new Disk('utf-8')
  ```

Read a file:
  ```coffeescript
    disk.read
      filename: 'directory/not/created/hello.txt'
      cb: (data) ->
        console.log data
  ```

## Methods available:

* [read()](#read-a-file)    _read a file_
* [touch()](#create-file)   _create empty file_
* [write()](#create-file-with-content)   _similar to create() for backward compatibility_
* [create()](#create-file-with-content)  _create a file or directory_
* [append()](#append-to-file)  _append content to a file_
* [copy()](#copy-files)    _copy a file/directory_
* [move()](#move-files)    _move a file directory_
* [replace()](#replace-content-in-files) _replace string in file_
* [delete()](#delete-file-or-directory)  _delete file/directory_

## Methods usage:

### Read a file:
  ```coffeescript
    disk.read
      filename: 'directory/not/created/hello.txt'
      cb: (data) ->
        console.log data
  ```

### Create file:
  ```coffeescript
    disk.create
      filename: 'directory/not/created/hello.txt'
      content: 'I like coffee'
      cb: () ->
        console.log 'File created'
  ```

### Create file with content:
  ```coffeescript
    disk.create
      filename: 'directory/not/created/hello.txt'
      content: 'I like coffee'
  ```

### Create directory:
  ```coffeescript
    disk.create
      dirname: 'another/directory'
  ```

### Append to file:
  ```coffeescript
    disk.append
      filename: 'directory/not/created/hello.txt'
      content: 'But JS is not my best friend... ;)'
  ```

### Copy files:
  ```coffeescript
    disk.copy
      source: 'directory/not/created/hello.txt'
      destination: 'another/directory/hello2.txt'
  ```

### Move files:
  ```coffeescript
    disk.move
      source: 'directory/not/created/hello.txt'
      destination: 'another/directory/hello2.txt'
  ```

### Replace content in file:
  ```coffeescript
    disk.replace
      filename: 'directory/not/created/hello.txt'
      to_replace: 'coffee'
      replace_with: 'CoffeeScript'
  ```

### Delete file or directory:
  ```coffeescript
    disk.delete
      filename: 'directory/not/created/hello.txt'
  ```


## Extended usage

All methods supports an optional callback parameter:
  ```coffeescript
    disk.write
      filename: 'directory/not/created/hello.txt'
      content: 'I like coffee'
      cb: do_something()
  ```
or:
  ```coffeescript
    disk.read
      filename: 'directory/not/created/hello.txt'
      cb: (data) ->
        console.log data
  ```

## Run tests

You can run unit-tests using mocha with:
  ```sh
    npm test
  ```
