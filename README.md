# disk-action

[![NPM](https://nodei.co/npm/disk-action.png?compact=true)](https://nodei.co/npm/disk-action/)


## Install

Install with npm:
  ```sh
    npm install disk-action
  ```
  
## Basic Usage

Require the module:
  ```coffeescript
    disk = require 'disk-action'
  ```

Write file to disk:
  ```coffeescript
    disk.write
      filename: 'directory/not/created/hello.txt'
      content: 'I like coffee'
  ```

Write directory to disk:
  ```coffeescript
    disk.write
      dirname: 'another/directory'
  ```

Append to file:
  ```coffeescript
    disk.append
      filename: 'directory/not/created/hello.txt'
      content: 'But JS is not my best friend... ;)'
  ```

Copy files:
  ```coffeescript
    disk.copy
      source: 'directory/not/created/hello.txt'
      destination: 'another/directory/hello2.txt'
  ```

Move files:
  ```coffeescript
    disk.move
      source: 'directory/not/created/hello.txt'
      destination: 'another/directory/hello2.txt'
  ```

Replace content in file:
  ```coffeescript
    disk.replace
      filename: 'directory/not/created/hello.txt'
      to_replace: 'coffee'
      replace_with: 'CoffeeScript'
  ```

Delete files or directory:
  ```coffeescript
    disk.delete
      filename: 'directory/not/created/hello.txt'
  ```


## Extended usage

All methods supports a callback parameters:
  ```coffeescript
    disk.write
      filename: 'directory/not/created/hello.txt'
      content: 'I like coffee'
      cb: do_something()
  ```
