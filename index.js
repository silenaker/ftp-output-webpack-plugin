const url = require("url");
const FtpOutputFileSystem = require("./FtpOutputFileSystem");
const SftpOutputFileSystem = require("./SftpOutputFileSystem");

function FtpOutputPlugin(options) {
  this.options = options || {};
  const ftpFlagIndex = process.argv.indexOf("--ftp");

  if (!this.options.protocol) this.options.protocol = "ftp";

  if (~ftpFlagIndex) {
    const cliOptions = url.parse(process.argv[ftpFlagIndex + 1]);
    const auth = cliOptions.auth.split(":");

    cliOptions.protocol = cliOptions.protocol.slice(
      0,
      cliOptions.protocol.length - 1
    );
    cliOptions.username = auth[0];
    cliOptions.password = auth[1];

    if (cliOptions.protocol === "ftp") {
      this.options = Object.assign(this.options, {
        path: cliOptions.path,
        protocol: cliOptions.protocol,
        host: cliOptions.hostname,
        port: cliOptions.port || 21,
        user: cliOptions.username,
        password: cliOptions.password,
      });
    } else if (cliOptions.protocol === "sftp") {
      this.options = Object.assign(this.options, {
        path: cliOptions.path,
        protocol: cliOptions.protocol,
        host: cliOptions.hostname,
        port: cliOptions.port || 22,
        username: cliOptions.username,
        password: cliOptions.password,
      });
    }
  }
}

FtpOutputPlugin.prototype.apply = function (compiler) {
  if (!this.options.path) {
    // for backward compatibility
    this.options.path = compiler.options.output.path;
    this.options._useLocalPath = true;
  }

  compiler.plugin("environment", () => {
    if (this.options.protocol === "ftp") {
      compiler.outputFileSystem = new FtpOutputFileSystem(
        this.options,
        compiler
      );
    } else if (this.options.protocol === "sftp") {
      compiler.outputFileSystem = new SftpOutputFileSystem(
        this.options,
        compiler
      );
    }
  });

  if (!compiler.options.watch) {
    compiler.plugin("done", () => {
      compiler.outputFileSystem.client &&
        compiler.outputFileSystem.client.end();
    });
  }
};

module.exports = FtpOutputPlugin;
