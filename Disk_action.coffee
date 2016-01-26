# Copyright [2014] 
# @Email: x62en (at) users (dot) noreply (dot) github (dot) com
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

path = require 'path'
xfs = require 'xfs'
fs = require('fs')
mv = require 'node-mv'
replace = require 'replace'

module.exports = fs.existsSync or (filePath) ->
  try
    fs.statSync filePath
  catch err
    if err.code == 'ENOENT'
      return false
  true

module.exports = class Disk_action
	constructor: () ->

	write: ({filename, dirname, content, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if content? and filename?
			if fs.existsSync "#{filename}"
				if filename.indexOf '/' > -1
					pathname = path.dirname filename
					xfs.mkdir "#{pathname}", (err) =>
						if err?
							cb err
						else
							xfs.writeFile "#{filename}", content, (err) =>
								cb err
				else
					xfs.writeFile "#{filename}", content, (err) =>
						cb err
			else
				xfs.writeFile "#{filename}", content, (err) =>
					cb err
		else if dirname?
			if fs.existsSync "#{dirname}"
				fs.mkdir "#{dirname}", (err) =>
					cb err
			# If directory exists do nothing
		else
			cb 'NOTYPE'
				
	append: ({filename, content, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename? and content? and cb?
			if fs.existsSync "#{filename}"
				if fs.lstatSync(filename).isFile()
					fs.appendFile "#{filename}", "#{content}", (err) =>
						cb err
				else
					cb 'DIREXISTS'
			else
				cb 'NOFILE'
		else
			cb 'NOARGS'
	
	copy: ({source, destination, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if source? and destination?
			if fs.existsSync "#{source}"
				if fs.lstatSync(source).isFile()
					fs.createReadStream(source).pipe(fs.createWriteStream(destination))
					cb()
				else
					cb 'DIREXISTS'
			# if file source does not exists, just write blank dest file
			else
				@write
					filename: destination
					content: ''
					cb: cb
		else
			cb 'NOARGS'

	move: ({source, destination, mkdirp, clobber, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		# auto create recursive destination files
		unless mkdirp?
			mkdirp = true
		# if dest file exists, return an error
		unless clobber?
			clobber = true

		if source? and destination?
			if fs.existsSync "#{source}"
				if fs.lstatSync(source).isFile()
					mv 'source/file', 'dest/file', {mkdirp: mkdirp, clobber: clobber}, (err) =>
						cb err
				else
					cb 'DIREXISTS'
			else
				cb 'NOFILE'
		else
			cb 'NOARGS'
		

	replace: ({filename, to_replace, replace_with, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename? and to_replace?
			if fs.existsSync "#{filename}"
				if fs.lstatSync(filename).isFile()
					replace
						regex: to_replace
						replacement: replace_with
						paths: [ filename ]
						recursive: true
						silent: true
				else
					cb 'DIREXISTS'
			# We don't care about what's going on, as there is no callback on replace
			cb()
		else
			cb 'NOARGS'

	delete: ({filename, cb}) ->
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename?
			if fs.existsSync "#{filename}"
				if fs.lstatSync(filename).isDirectory()
					fs.rmdir filename, (err) =>
						cb err
				else
					fs.unlink filename, (err) =>
						cb err
			else
				cb null
		else
			cb 'NOARGS'
		

