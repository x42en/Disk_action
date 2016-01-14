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
fs = require 'xfs'
mv = require 'node-mv'
replace = require 'replace'

module.exports = class Disk_action
	constructor: () ->

	write: ({filename, dirname, content, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if content? and filename?
			fs.exists "#{filename}", (exists) =>
				unless exists
					if filename.indexOf '/' > -1
						pathname = path.dirname filename
						fs.mkdir "#{pathname}", (err) =>
							if err?
								cb err
							else
								fs.writeFile "#{filename}", content, (err) =>
									cb err
					else
						fs.writeFile "#{filename}", content, (err) =>
							cb err
				else
					fs.writeFile "#{filename}", content, (err) =>
						cb err
		else if dirname?
			fs.exists "#{dirname}", (exists) =>
				unless exists
					fs.mkdir "#{dirname}", (err) =>
						cb err
		else
			cb 'NOTYPE'
				
	append: ({filename, content, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename? and content? and cb?
			fs.exists "#{filename}", (exists) =>
				if exists and fs.lstatSync(filename).isFile()
					fs.appendFile "#{filename}", "#{content}", (err) =>
						cb err
				else
					cb 'NOFILE'
		else
			cb 'NOARGS'
	
	copy: ({source, destination, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if source? and destination?
			fs.exists "#{source}", (exists) =>
				if exists
					if fs.lstatSync(source).isFile()
						fs.createReadStream(source).pipe(fs.createWriteStream(destination))
						cb()
					else
						cb 'Invalid destination'
				# if file source does not exists, just write blank dest file
				else
					@write
						filename: destination
						content: ''
						cb: cb
		else
			cb 'Undefined source and/or destination'

	move: ({source, destination, mkdirp, clobber, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		# auto create recursive destination files
		unless mkdirp?
			mkdirp = true
		# if dest file exists, return an error
		unless clobber?
			clobber = true

		if source? and destination?
			fs.exists "#{source}", (exists) =>
				if exists and fs.lstatSync(source).isFile()
					mv 'source/file', 'dest/file', {mkdirp: mkdirp, clobber: clobber}, (err) =>
						cb err
				else
					cb 'Invalid destination'
		else
			cb 'Undefined source and/or destination'
		

	replace: ({filename, to_replace, replace_with, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename? and to_replace?
			fs.exists "#{filename}", (exists) =>
				if exists and fs.lstatSync(filename).isFile()
					replace
						regex: to_replace
						replacement: replace_with
						paths: [ filename ]
						recursive: true
						silent: true
			# We don't care about what's going on, as there is no callback on replace
			cb()

	delete: ({filename, cb}) =>
		if not cb? or typeof cb is "undefined"
			cb = console.error()
		if filename?
			fs.exists "#{filename}", (exists) =>
				if exists
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
		

