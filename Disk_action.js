/****************************************************/
/*         Disk_action - v0.1.4                     */
/*                                                  */
/*    Easily interact with FILE SYSTEM in node.j    */
/****************************************************/
/*             -    Copyright 2014    -             */
/*                                                  */
/*   License: Apache v 2.0                          */
/*   @Author: Ben Mz                                */
/*   @Email: benoit (at) webboards (dot) fr         */
/*                                                  */
/****************************************************/

(function() {
  var Disk_action, fs, mv, path, replace, xfs;

  path = require('path');

  xfs = require('xfs');

  fs = require('fs');

  mv = require('node-mv');

  replace = require('replace');

  module.exports = fs.existsSync || function(filePath) {
    var err;
    try {
      fs.statSync(filePath);
    } catch (_error) {
      err = _error;
      if (err.code === 'ENOENT') {
        return false;
      }
    }
    return true;
  };

  module.exports = Disk_action = (function() {
    function Disk_action() {}

    Disk_action.prototype.write = function(_arg) {
      var cb, content, dirname, filename, pathname;
      filename = _arg.filename, dirname = _arg.dirname, content = _arg.content, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if ((content != null) && (filename != null)) {
        if (fs.existsSync("" + filename)) {
          if (filename.indexOf('/' > -1)) {
            pathname = path.dirname(filename);
            return xfs.mkdir("" + pathname, (function(_this) {
              return function(err) {
                if (err != null) {
                  return cb(err);
                } else {
                  return xfs.writeFile("" + filename, content, function(err) {
                    return cb(err);
                  });
                }
              };
            })(this));
          } else {
            return xfs.writeFile("" + filename, content, (function(_this) {
              return function(err) {
                return cb(err);
              };
            })(this));
          }
        } else {
          return xfs.writeFile("" + filename, content, (function(_this) {
            return function(err) {
              return cb(err);
            };
          })(this));
        }
      } else if (dirname != null) {
        if (fs.existsSync("" + dirname)) {
          return fs.mkdir("" + dirname, (function(_this) {
            return function(err) {
              return cb(err);
            };
          })(this));
        }
      } else {
        return cb('NOTYPE');
      }
    };

    Disk_action.prototype.append = function(_arg) {
      var cb, content, filename;
      filename = _arg.filename, content = _arg.content, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if ((filename != null) && (content != null) && (cb != null)) {
        if (fs.existsSync("" + filename)) {
          if (fs.lstatSync(filename).isFile()) {
            return fs.appendFile("" + filename, "" + content, (function(_this) {
              return function(err) {
                return cb(err);
              };
            })(this));
          } else {
            return cb('DIREXISTS');
          }
        } else {
          return cb('NOFILE');
        }
      } else {
        return cb('NOARGS');
      }
    };

    Disk_action.prototype.copy = function(_arg) {
      var cb, destination, source;
      source = _arg.source, destination = _arg.destination, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if ((source != null) && (destination != null)) {
        if (fs.existsSync("" + source)) {
          if (fs.lstatSync(source).isFile()) {
            fs.createReadStream(source).pipe(fs.createWriteStream(destination));
            return cb();
          } else {
            return cb('DIREXISTS');
          }
        } else {
          return this.write({
            filename: destination,
            content: '',
            cb: cb
          });
        }
      } else {
        return cb('NOARGS');
      }
    };

    Disk_action.prototype.move = function(_arg) {
      var cb, clobber, destination, mkdirp, source;
      source = _arg.source, destination = _arg.destination, mkdirp = _arg.mkdirp, clobber = _arg.clobber, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if (mkdirp == null) {
        mkdirp = true;
      }
      if (clobber == null) {
        clobber = true;
      }
      if ((source != null) && (destination != null)) {
        if (fs.existsSync("" + source)) {
          if (fs.lstatSync(source).isFile()) {
            return mv('source/file', 'dest/file', {
              mkdirp: mkdirp,
              clobber: clobber
            }, (function(_this) {
              return function(err) {
                return cb(err);
              };
            })(this));
          } else {
            return cb('DIREXISTS');
          }
        } else {
          return cb('NOFILE');
        }
      } else {
        return cb('NOARGS');
      }
    };

    Disk_action.prototype.replace = function(_arg) {
      var cb, filename, replace_with, to_replace;
      filename = _arg.filename, to_replace = _arg.to_replace, replace_with = _arg.replace_with, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if ((filename != null) && (to_replace != null)) {
        if (fs.existsSync("" + filename)) {
          if (fs.lstatSync(filename).isFile()) {
            replace({
              regex: to_replace,
              replacement: replace_with,
              paths: [filename],
              recursive: true,
              silent: true
            });
          } else {
            cb('DIREXISTS');
          }
        }
        return cb();
      } else {
        return cb('NOARGS');
      }
    };

    Disk_action.prototype["delete"] = function(_arg) {
      var cb, filename;
      filename = _arg.filename, cb = _arg.cb;
      if ((cb == null) || typeof cb === "undefined") {
        cb = console.error();
      }
      if (filename != null) {
        if (fs.existsSync("" + filename)) {
          if (fs.lstatSync(filename).isDirectory()) {
            return fs.rmdir(filename, (function(_this) {
              return function(err) {
                return cb(err);
              };
            })(this));
          } else {
            return fs.unlink(filename, (function(_this) {
              return function(err) {
                return cb(err);
              };
            })(this));
          }
        } else {
          return cb(null);
        }
      } else {
        return cb('NOARGS');
      }
    };

    return Disk_action;

  })();

}).call(this);
