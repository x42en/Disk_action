/****************************************************/
/*         Disk_action - v0.2.1                     */
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

    Disk_action.prototype.read = function(arg, cb) {
      var filename;
      filename = (arg != null ? arg : {}).filename;
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

    Disk_action.prototype.touch = function(arg, cb) {
      var filename;
      filename = (arg != null ? arg : {}).filename;
      if (!filename) {
        throw 'Error: filename is not set';
      }
      if (xfs.lstatSync(filename).isDirectory()) {
        throw "Error: " + filename + " is a directory";
      }
      return this._create({
        filename: filename,
        content: null
      }, function(data) {
        if (typeof cb === "function") {
          return cb(data);
        }
      });
    };

    Disk_action.prototype.write = function(arg, cb) {
      var content, dirname, filename, ref;
      ref = arg != null ? arg : {}, filename = ref.filename, dirname = ref.dirname, content = ref.content;
      return this.create({
        filename: filename,
        dirname: dirname,
        content: content
      }, cb);
    };

    Disk_action.prototype.create = function(arg, cb) {
      var content, dirname, filename, pathname, ref;
      ref = arg != null ? arg : {}, filename = ref.filename, dirname = ref.dirname, content = ref.content;
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

    Disk_action.prototype.append = function(arg, cb) {
      var content, filename, ref;
      ref = arg != null ? arg : {}, filename = ref.filename, content = ref.content;
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

    Disk_action.prototype.copy = function(arg, cb) {
      var destination, ref, source;
      ref = arg != null ? arg : {}, source = ref.source, destination = ref.destination;
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

    Disk_action.prototype.move = function(arg, cb) {
      var destination, mkdirp, ref, source;
      ref = arg != null ? arg : {}, source = ref.source, destination = ref.destination, mkdirp = ref.mkdirp;
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

    Disk_action.prototype.replace = function(arg, cb) {
      var filename, ref, replace_with, to_replace;
      ref = arg != null ? arg : {}, filename = ref.filename, to_replace = ref.to_replace, replace_with = ref.replace_with;
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

    Disk_action.prototype["delete"] = function(arg, cb) {
      var act, filename;
      filename = arg.filename;
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
