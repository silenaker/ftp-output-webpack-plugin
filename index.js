const FtpOutputFileSystem = require('./FtpOutputFileSystem')

function FtpOutputPlugin(options) {
  this.options = options
}

FtpOutputPlugin.prototype.apply = function (compiler) {
  compiler.plugin('environment', () => {
    compiler.outputFileSystem = new FtpOutputFileSystem(this.options)
  })
}

module.exports = FtpOutputPlugin