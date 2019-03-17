const SftpOutputFileSystem = require('./SftpOutputFileSystem')

function SftpOutputPlugin(options) {
  this.options = options
}

SftpOutputPlugin.prototype.apply = function (compiler) {
  compiler.plugin('environment', () => {
    compiler.outputFileSystem = new SftpOutputFileSystem(this.options)
  })
}

module.exports = SftpOutputPlugin