const path = require("path");
const pathJoin = require("path.join");
const Client = require("ssh2-sftp-client");

function SftpOutputFileSystem(options, compiler) {
  this.options = options;
  this.localOutputPath = compiler.options.output.path;
  this.localOutputFileSystem = compiler.outputFileSystem;
  this.client = new Client();
  this.client.connect(options);
  this.client.on("error", (err) => console.log(err));
}

SftpOutputFileSystem.prototype.relative = function (p) {
  return path.relative(this.localOutputPath, p).replace(/\\/g, "/") || ".";
};

SftpOutputFileSystem.prototype.getFtpOutputPath = function (p) {
  return pathJoin(this.options.path, this.relative(p));
};

SftpOutputFileSystem.prototype.mkdirp = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.mkdirp(path, (err) => err && console.error(err));
  }

  this.client
    .mkdir(this.getFtpOutputPath(path), true)
    .then(() => callback())
    .catch((err) => callback(err));
};

SftpOutputFileSystem.prototype.mkdir = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.mkdir(path, (err) => err && console.error(err));
  }

  this.client
    .mkdir(this.getFtpOutputPath(path), false)
    .then(() => callback())
    .catch((err) => callback(err));
};

SftpOutputFileSystem.prototype.rmdir = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.rmdir(path, (err) => err && console.error(err));
  }

  this.client
    .rmdir(this.getFtpOutputPath(path), false)
    .then(() => callback())
    .catch((err) => callback(err));
};

SftpOutputFileSystem.prototype.unlink = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.unlink(path, (err) => err && console.error(err));
  }

  this.client
    .delete(this.getFtpOutputPath(path))
    .then(() => callback())
    .catch((err) => callback(err));
};

SftpOutputFileSystem.prototype.writeFile = ensureConnected(function (
  file,
  data,
  options,
  callback
) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (!Buffer.isBuffer(data)) {
    data = new Buffer(data, "utf8");
  }

  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.writeFile(
      file,
      data,
      options,
      (err) => err && console.error(err)
    );
  }

  this.client
    .put(data, this.getFtpOutputPath(file))
    .then(() => callback())
    .catch((err) => callback(err));
});

SftpOutputFileSystem.prototype.join = pathJoin;

module.exports = SftpOutputFileSystem;
