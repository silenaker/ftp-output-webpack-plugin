const SftpOutputFileSystem = require('./SftpOutputFileSystem')
const url = require('url')

function SftpOutputPlugin(options) {
  if (!options) {
    const i = process.argv.indexOf('--ftp')
    if (!~i)
      return console.warn('you must set --ftp option when you use ftp-output-webpack-plugin!')
    options = process.argv[i + 1]
    options = url.parse(options)
    const auth = options.auth.split(':')
    options.username = auth[0]
    options.password = auth[1]
    options = {
      host: options.hostname,
      port: options.port,
      username: options.username,
      password: options.password,
      keepaliveInterval: 5000
    }
  }
  this.options = options
}

SftpOutputPlugin.prototype.apply = function(compiler) {
  if (!this.options) return
  compiler.plugin('environment', () => {
    compiler.outputFileSystem = new SftpOutputFileSystem(this.options)
  })
  compiler.plugin('done', () => {
    compiler.outputFileSystem.client.end()
  })
}

module.exports = SftpOutputPlugin
