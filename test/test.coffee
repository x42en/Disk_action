require 'coffee-script/register'
CoffeeScript = require 'coffee-script'

chai         = require 'chai'
chaiFiles    = require 'chai-files'

path         = require 'path'
DISK         = require path.join(__dirname, '..','Disk_action')

DIR          = '/tmp/directory/not/set'
FILE         = "#{DIR}/my_tmp.txt"

chai.use(chaiFiles)
expect  = chai.expect
file    = chaiFiles.file
dir     = chaiFiles.dir

disk    = new DISK()

describe 'Disk-Action', ->
    describe '#init', ->
        it "should prove that #{DIR} does not exists", ->
            expect(dir(DIR)).to.not.exist

    describe '#create', ->
        it "should create #{FILE} file", (done) ->
            try
                disk.create
                    filename: FILE
                    content:'Welcome'
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err
        it "should found #{DIR}", ->
            expect(dir(DIR)).to.exist
        it "should found #{FILE}", ->
            expect(file(FILE)).to.exist
        it "should verify #{FILE} content", ->
            expect(file(FILE)).to.contain('Welcome')

    describe '#read', ->
        it "should read #{FILE} file", (done) ->
            try
                disk.read
                    filename: FILE
                    , (res) ->
                        expect(res).to.be.string
                        expect(res).to.have.string('Welcome')
                        done()
            catch err
                done err

    describe '#append', ->
        it "should append string to #{FILE} file", (done) ->
            try
                disk.append
                    filename: FILE
                    content: ' in a better place'
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err
        it "should verify #{FILE} content", ->
            expect(file(FILE)).to.contain('Welcome in a better place')

    describe '#replace', ->
        it "should replace place by world in #{FILE} file", (done) ->
            try
                disk.replace
                    filename: FILE
                    to_replace: 'place'
                    replace_with: 'world'
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err
        it "should verify #{FILE} content", ->
            expect(file(FILE)).to.contain('Welcome in a better world')

    describe '#copy', ->
        it "should copy #{FILE} to #{FILE}.OLD", (done) ->
            try
                disk.copy
                    source: FILE
                    destination: "#{FILE}.OLD"
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err
        it "should found #{FILE}", ->
            expect(file(FILE)).to.exist
        it "should found #{FILE}.OLD", ->
            expect(file("#{FILE}.OLD")).to.exist

    describe '#move', ->
        it "should move #{FILE}.OLD to #{FILE}.NEO", (done) ->
            try
                disk.move
                    source: "#{FILE}.OLD"
                    destination: "#{FILE}.NEO"
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err
        it "should found #{FILE}", ->
            expect(file(FILE)).to.exist
        it "should NOT found #{FILE}.OLD", ->
            expect(file("#{FILE}.OLD")).to.not.exist
        it "should found #{FILE}.NEO", ->
            expect(file("#{FILE}.NEO")).to.exist
        it "should verify #{DIR} has only #{FILE} and #{FILE}.NEO", ->
            expect(dir(DIR)).to.not.be.empty
        it "should verify #{FILE}.NEO content", ->
            expect(file("#{FILE}.NEO")).to.contain('Welcome in a better world')

    describe '#delete', ->
        it "should delete #{FILE}.NEO", (done) ->
            try
                disk.delete
                    filename: "#{FILE}.NEO"
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err

        it "should found #{FILE}", ->
            expect(file(FILE)).to.exist
        it "should NOT found #{FILE}.NEO", ->
            expect(file("#{FILE}.NEO")).to.not.exist
        it "should verify #{DIR} has only #{FILE}", ->
            expect(dir(DIR)).to.not.be.empty
        
        it "should delete /tmp/directory", (done) ->
            try
                disk.delete
                    filename: "/tmp/directory"
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err

        it "should prove that #{DIR} does no longer exists", ->
            expect(dir(DIR)).to.not.exist