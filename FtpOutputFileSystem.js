const pathJoin = require("path.join")
const FtpClient = require('ftp')

function FtpOutputFileSystem(options) {
  this.options = options
  this.client = new FtpClient()
  this.connected = false
  this.connecting = false
  this.client.on('ready', () => {
    this.connected = true
    this.connecting = false
  })
  this.client.on('end', () => {
    this.connected = false
    this.connecting = false
  })
  this.connecting = true
  this.client.connect(options)
}

function ensureConnected(fn) {
  return function () {
    if (this.connected) {
      fn.apply(this, arguments)
    } else {
      if (!this.connecting) {
        this.client.connect(this.options)
      }
      this.client.on('ready', () => {
        fn.apply(this, arguments)
      })
    }
  }
}

FtpOutputFileSystem.prototype.mkdirp = ensureConnected(function (path, callback) {
  this.client.mkdir(path, true, callback)
})

FtpOutputFileSystem.prototype.mkdir = ensureConnected(function (path, callback) {
  this.client.mkdir(path, false, callback)
})

FtpOutputFileSystem.prototype.rmdir = ensureConnected(function (path, callback) {
  this.client.rmdir(path, false, callback)
})

FtpOutputFileSystem.prototype.unlink = ensureConnected(function (path, callback) {
  this.client.delete(path, callback)
})

FtpOutputFileSystem.prototype.writeFile = ensureConnected(function (file, data, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (!Buffer.isBuffer(data)) {
    data = new Buffer(data, 'utf8')
  }
  this.client.put(data, file, callback)
})

FtpOutputFileSystem.prototype.join = pathJoin

module.exports = FtpOutputFileSystem