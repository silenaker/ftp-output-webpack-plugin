const pathJoin = require('path.join')
const Client = require('ssh2-sftp-client')

function SftpOutputFileSystem(options) {
  this.options = options
  this.client = new Client()
  this.connection = this.client.connect(options)
}

function ensureConnected(fn) {
  return function() {
    const args = [].slice.call(arguments, 0, arguments.length - 1)
    const callback = arguments[arguments.length - 1]
    this.connection
      .then(() => fn.apply(this, args))
      .then(() => callback())
      .catch(err => callback(err))
  }
}

SftpOutputFileSystem.prototype.mkdirp = ensureConnected(function(path) {
  return this.client.mkdir(path, true)
})

SftpOutputFileSystem.prototype.mkdir = ensureConnected(function(path) {
  return this.client.mkdir(path, false)
})

SftpOutputFileSystem.prototype.rmdir = ensureConnected(function(path) {
  return this.client.rmdir(path, false)
})

SftpOutputFileSystem.prototype.unlink = ensureConnected(function(path) {
  return this.client.delete(path)
})

SftpOutputFileSystem.prototype.writeFile = ensureConnected(function(file, data) {
  if (!Buffer.isBuffer(data)) {
    data = new Buffer(data, 'utf8')
  }
  return this.client.put(data, file)
})

SftpOutputFileSystem.prototype.join = pathJoin

module.exports = SftpOutputFileSystem
