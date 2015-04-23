_ = require 'lodash'

path = require 'path'
fs = require 'xfs'
mv = require 'node-mv'
replace = require 'replace'

module.exports = class Disk_action
	constructor: () ->

	write: ({filename, dirname, content, cb}={}) =>
		if cb?
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
		else
			console.error 'NOARGS'
				
	append: ({filename, content, cb}={}) =>
		if filename? and content? and cb?
			fs.exists "#{filename}", (exists) =>
				if exists and fs.lstatSync(filename).isFile()
					fs.appendFile "#{filename}", "#{content}", (err) =>
						cb err
				else
					cb 'NOFILE'
		else
			cb 'NOARGS'
	
	copy: ({source, destination, cb}={}) =>
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

	replace: ({filename, to_replace, replace_with, cb}={}) =>
		if filename? and to_replace? and cb?
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

	delete: ({filename, cb}={}) =>
		if filename? and cb?
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

