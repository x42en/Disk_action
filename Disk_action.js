/****************************************************/
/*         Disk_action - v0.2.0                     */
/*                                                  */
/*    Easily interact with FILE SYSTEM in node.js   */
/****************************************************/
/*             -    Copyright 2017    -             */
/*                                                  */
/*   License: Apache v 2.0                          */
/*   @Author: Ben Mz                                */
/*   @Email: benoit (at) webboards (dot) fr         */
/*                                                  */
/****************************************************/
(function() {
  var Disk_action, mv, path, replace, xfs;

  xfs = require('xfs');

  path = require('path');

  mv = require('mv');

  replace = require('replace');

  module.exports = xfs.existsSync || function(filePath) {
    var err, error;
    try {
      xfs.statSync("" + filePath);
    } catch (error) {
      err = error;
      return false;
    }
    return true;
  };

  module.exports = Disk_action = (function() {
    function Disk_action(encoding) {
      this.encoding = encoding != null ? encoding : 'utf-8';
    }

    Disk_action.prototype.read = function(arg) {
      var cb, filename;
      filename = arg.filename, cb = arg.cb;
      if (!filename) {
        throw 'Error: filename is not set';
      }
      if (!xfs.existsSync(filename)) {
        throw "Error: " + filename + " does not exists";
      }
      if (!xfs.lstatSync(filename).isFile()) {
        throw "Error: " + filename + " is a directory";
      }
      return xfs.readFile(filename, this.encoding, function(err, data) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(data);
        }
      });
    };

    Disk_action.prototype.touch = function(arg) {
      var filename;
      filename = arg.filename;
      if (!filename) {
        throw 'Error: filename is not set';
      }
      return this._create({
        filename: filename,
        content: null
      });
    };

    Disk_action.prototype.write = function(arg) {
      var cb, content, dirname, filename;
      filename = arg.filename, dirname = arg.dirname, content = arg.content, cb = arg.cb;
      return this.create(function(filename, dirname, content, cb) {});
    };

    Disk_action.prototype.create = function(arg) {
      var cb, content, dirname, filename, pathname;
      filename = arg.filename, dirname = arg.dirname, content = arg.content, cb = arg.cb;
      if (!(filename || dirname)) {
        throw "Error: Filename or dirname are not set";
      }
      if (filename && dirname) {
        throw "Error: You can not set filename AND dirname";
      }
      content = content ? content : '';
      if (dirname) {
        if (xfs.existsSync(dirname)) {
          throw "Error: " + dirname + " already exists";
        }
        xfs.mkdir(dirname, function(err) {
          if (err) {
            throw err;
          }
          if (typeof cb === "function") {
            return cb(true);
          }
        });
      }
      if (filename) {
        if (xfs.existsSync(filename)) {
          throw "Error: " + filename + " already exists";
        }
        if (filename.indexOf('/' > -1)) {
          pathname = path.dirname(filename);
          xfs.sync().mkdir(pathname);
        }
        return xfs.writeFile(filename, content, function(err) {
          if (err) {
            throw err;
          }
          if (typeof cb === "function") {
            return cb(true);
          }
        });
      }
    };

    Disk_action.prototype.append = function(arg) {
      var cb, content, filename;
      filename = arg.filename, content = arg.content, cb = arg.cb;
      if (!filename) {
        throw 'Error: Filename not set';
      }
      if (!xfs.existsSync(filename)) {
        throw "Error: " + filename + " does not exists";
      }
      if (!xfs.lstatSync(filename).isFile()) {
        throw "Error: " + filename + " is a directory";
      }
      return xfs.appendFile(filename, "" + content, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    Disk_action.prototype.copy = function(arg) {
      var cb, destination, source;
      source = arg.source, destination = arg.destination, cb = arg.cb;
      if (!(source || destination)) {
        throw 'Source and/or destination not set';
      }
      if (!xfs.existsSync(source)) {
        throw source + " file does not exists";
      }
      if (!xfs.lstatSync(source).isFile()) {
        throw source + " is a directory";
      }
      xfs.createReadStream(source).pipe(xfs.createWriteStream(destination));
      if (typeof cb === "function") {
        return cb(true);
      }
    };

    Disk_action.prototype.move = function(arg) {
      var cb, destination, mkdirp, source;
      source = arg.source, destination = arg.destination, mkdirp = arg.mkdirp, cb = arg.cb;
      mkdirp = mkdirp ? mkdirp : true;
      if (!(source || destination)) {
        throw 'Source and/or destination not set';
      }
      if (!xfs.existsSync(source)) {
        throw source + " does not exists";
      }
      if (xfs.existsSync(destination)) {
        throw destination + " exists";
      }
      return mv(source, destination, {
        mkdirp: mkdirp,
        clobber: false
      }, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    Disk_action.prototype.replace = function(arg) {
      var cb, filename, replace_with, to_replace;
      filename = arg.filename, to_replace = arg.to_replace, replace_with = arg.replace_with, cb = arg.cb;
      if (!(filename || to_replace)) {
        throw 'Source and/or pattern not set';
      }
      if (!xfs.existsSync(filename)) {
        throw filename + " does not exists";
      }
      if (!xfs.lstatSync(filename).isFile()) {
        throw filename + " is a directory";
      }
      replace({
        regex: to_replace,
        replacement: replace_with,
        paths: [filename],
        recursive: true,
        silent: true
      });
      if (typeof cb === "function") {
        return cb(true);
      }
    };

    Disk_action.prototype["delete"] = function(arg) {
      var act, cb, filename;
      filename = arg.filename, cb = arg.cb;
      if (!filename) {
        throw 'filename not set';
      }
      if (!xfs.existsSync(filename)) {
        throw filename + " does not exists";
      }
      if (xfs.lstatSync(filename).isDirectory()) {
        act = xfs.rmdir;
      } else {
        act = xfs.unlink;
      }
      return act(filename, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    return Disk_action;

  })();

}).call(this);
