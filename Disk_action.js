/****************************************************/
/*         Disk_action - v0.1.1                     */
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
  var Disk_action, fs, mv, path, replace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  path = require('path');

  fs = require('xfs');

  mv = require('node-mv');

  replace = require('replace');

  module.exports = Disk_action = (function() {
    function Disk_action() {
      this["delete"] = __bind(this["delete"], this);
      this.replace = __bind(this.replace, this);
      this.move = __bind(this.move, this);
      this.copy = __bind(this.copy, this);
      this.append = __bind(this.append, this);
      this.write = __bind(this.write, this);
    }

    Disk_action.prototype.write = function(_arg) {
      var cb, content, dirname, filename;
      filename = _arg.filename, dirname = _arg.dirname, content = _arg.content, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if ((content != null) && (filename != null)) {
        return fs.exists("" + filename, (function(_this) {
          return function(exists) {
            var pathname;
            if (!exists) {
              if (filename.indexOf('/' > -1)) {
                pathname = path.dirname(filename);
                return fs.mkdir("" + pathname, function(err) {
                  if (err != null) {
                    return cb(err);
                  } else {
                    return fs.writeFile("" + filename, content, function(err) {
                      return cb(err);
                    });
                  }
                });
              } else {
                return fs.writeFile("" + filename, content, function(err) {
                  return cb(err);
                });
              }
            } else {
              return fs.writeFile("" + filename, content, function(err) {
                return cb(err);
              });
            }
          };
        })(this));
      } else if (dirname != null) {
        return fs.exists("" + dirname, (function(_this) {
          return function(exists) {
            if (!exists) {
              return fs.mkdir("" + dirname, function(err) {
                return cb(err);
              });
            }
          };
        })(this));
      } else {
        return cb('NOTYPE');
      }
    };

    Disk_action.prototype.append = function(_arg) {
      var cb, content, filename;
      filename = _arg.filename, content = _arg.content, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if ((filename != null) && (content != null) && (cb != null)) {
        return fs.exists("" + filename, (function(_this) {
          return function(exists) {
            if (exists && fs.lstatSync(filename).isFile()) {
              return fs.appendFile("" + filename, "" + content, function(err) {
                return cb(err);
              });
            } else {
              return cb('NOFILE');
            }
          };
        })(this));
      } else {
        return cb('NOARGS');
      }
    };

    Disk_action.prototype.copy = function(_arg) {
      var cb, destination, source;
      source = _arg.source, destination = _arg.destination, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if ((source != null) && (destination != null)) {
        return fs.exists("" + source, (function(_this) {
          return function(exists) {
            if (exists) {
              if (fs.lstatSync(source).isFile()) {
                fs.createReadStream(source).pipe(fs.createWriteStream(destination));
                return cb();
              } else {
                return cb('Invalid destination');
              }
            } else {
              return _this.write({
                filename: destination,
                content: '',
                cb: cb
              });
            }
          };
        })(this));
      } else {
        return cb('Undefined source and/or destination');
      }
    };

    Disk_action.prototype.move = function(_arg) {
      var cb, clobber, destination, mkdirp, source;
      source = _arg.source, destination = _arg.destination, mkdirp = _arg.mkdirp, clobber = _arg.clobber, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if (mkdirp == null) {
        mkdirp = true;
      }
      if (clobber == null) {
        clobber = true;
      }
      if ((source != null) && (destination != null)) {
        return fs.exists("" + source, (function(_this) {
          return function(exists) {
            if (exists && fs.lstatSync(source).isFile()) {
              return mv('source/file', 'dest/file', {
                mkdirp: mkdirp,
                clobber: clobber
              }, function(err) {
                return cb(err);
              });
            } else {
              return cb('Invalid destination');
            }
          };
        })(this));
      } else {
        return cb('Undefined source and/or destination');
      }
    };

    Disk_action.prototype.replace = function(_arg) {
      var cb, filename, replace_with, to_replace;
      filename = _arg.filename, to_replace = _arg.to_replace, replace_with = _arg.replace_with, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if ((filename != null) && (to_replace != null)) {
        fs.exists("" + filename, (function(_this) {
          return function(exists) {
            if (exists && fs.lstatSync(filename).isFile()) {
              return replace({
                regex: to_replace,
                replacement: replace_with,
                paths: [filename],
                recursive: true,
                silent: true
              });
            }
          };
        })(this));
        return cb();
      }
    };

    Disk_action.prototype["delete"] = function(_arg) {
      var cb, filename;
      filename = _arg.filename, cb = _arg.cb;
      if (cb == null) {
        cb = console.error();
      }
      if (filename != null) {
        return fs.exists("" + filename, (function(_this) {
          return function(exists) {
            if (exists) {
              if (fs.lstatSync(filename).isDirectory()) {
                return fs.rmdir(filename, function(err) {
                  return cb(err);
                });
              } else {
                return fs.unlink(filename, function(err) {
                  return cb(err);
                });
              }
            } else {
              return cb(null);
            }
          };
        })(this));
      } else {
        return cb('NOARGS');
      }
    };

    return Disk_action;

  })();

}).call(this);
