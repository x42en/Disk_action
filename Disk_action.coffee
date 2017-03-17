# Copyright [2017] 
# @Email: x42en (at) users (dot) noreply (dot) github (dot) com
# @Author: Ben Mz

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

xfs     = require 'xfs'
path    = require 'path'
mv      = require 'mv'
replace = require 'replace'

module.exports = xfs.existsSync or (filePath) ->
    try
        xfs.statSync "#{filePath}"
    catch err
        return false
    return true

module.exports = class Disk_action
    constructor: (@encoding = 'utf-8') ->

    # Read a file
    read: ({filename}={}, cb) ->
        unless filename
            throw 'Error: filename is not set'

        unless xfs.existsSync filename
            throw "Error: #{filename} does not exists"

        unless xfs.lstatSync(filename).isFile()
            throw "Error: #{filename} is a directory"
        
        xfs.readFile filename, @encoding, (err, data) ->
            if err
                throw err
            if typeof cb is "function"
                cb data

    # Create empty file
    touch: ({filename}={}, cb) ->
        unless filename
            throw 'Error: filename is not set'

        if xfs.lstatSync(filename).isDirectory()
            throw "Error: #{filename} is a directory"

        @_create
            filename: filename
            content: null
            ,(data) ->
                if typeof cb is "function"
                    cb data

    # Backward compatibility
    write: ({filename, dirname, content}={}, cb) ->
        @create
            filename: filename
            dirname: dirname
            content: content
            ,cb

    # Create file or directory
    create: ({filename, dirname, content}={}, cb) ->
        unless filename or dirname
            throw "Error: Filename or dirname are not set"

        if filename and dirname
            throw "Error: You can not set filename AND dirname"

        content = if content then content else ''

        # If we create a directory
        if dirname
            # Check if directory does not exists
            if xfs.existsSync dirname
                throw "Error: #{dirname} already exists"

            xfs.mkdir dirname, (err) ->
                if err
                    throw err
                if typeof cb is "function"
                    cb true

        # If we create a file
        if filename
            if xfs.existsSync filename
                throw "Error: #{filename} already exists"
            
            # If this file has a proper path
            if filename.indexOf '/' > -1
                pathname = path.dirname filename
                xfs.sync().mkdir pathname

            xfs.writeFile filename, content, (err) ->
                if err
                    throw err
                if typeof cb is "function"
                    cb true
    
    # Add content to a file
    append: ({filename, content}={}, cb) ->
        unless filename
            throw 'Error: Filename not set'

        unless xfs.existsSync filename
            throw "Error: #{filename} does not exists"

        unless xfs.lstatSync(filename).isFile()
            throw "Error: #{filename} is a directory"
        
        xfs.appendFile filename, "#{content}", (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true
    
    # Copy a file
    copy: ({source, destination}={}, cb) ->
        unless source or destination
            throw 'Source and/or destination not set'

        unless xfs.existsSync source
            throw "#{source} file does not exists"

        unless xfs.lstatSync(source).isFile()
            throw "#{source} is a directory"
        
        xfs.createReadStream(source).pipe xfs.createWriteStream(destination)
        if typeof cb is "function"
            cb true

    # Move a file
    move: ({source, destination, mkdirp}={}, cb) ->
        # auto create recursive destination files
        mkdirp = if mkdirp then mkdirp else true

        unless source or destination
            throw 'Source and/or destination not set'

        unless xfs.existsSync source
            throw "#{source} does not exists"

        if xfs.existsSync destination
            throw "#{destination} exists"

        mv source, destination, {mkdirp: mkdirp, clobber: false}, (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true
        
    # Replace string in a file
    replace: ({filename, to_replace, replace_with}={}, cb) ->
        unless filename or to_replace
            throw 'Source and/or pattern not set'

        unless xfs.existsSync filename
            throw "#{filename} does not exists"

        unless xfs.lstatSync(filename).isFile()
            throw "#{filename} is a directory"

        replace
            regex: to_replace
            replacement: replace_with
            paths: [ filename ]
            recursive: true
            silent: true

        # We don't care about what's going on, as there is no callback on replace
        if typeof cb is "function"
            cb true

    # Delete a file or a directory
    delete: ({filename}, cb) ->
        unless filename
            throw 'filename not set'

        # If filename does not exists
        unless xfs.existsSync filename
            throw "#{filename} does not exists"

        # If we are deleting a directory
        if xfs.lstatSync(filename).isDirectory()
            act = xfs.rmdir
        # If we are deleting a file
        else
            act = xfs.unlink

        act filename, (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true