const path = require("path");
const pathJoin = require("path.join");
const FtpClient = require("ftp");

function FtpOutputFileSystem(options, compiler) {
  this.options = options;
  this.localOutputPath = compiler.options.output.path;
  this.localOutputFileSystem = compiler.outputFileSystem;
  this.client = new FtpClient();
  this.client.connect(this.options);
  this.client.on("error", (err) => console.log(err));
}

FtpOutputFileSystem.prototype.relative = function (p) {
  return path.relative(this.localOutputPath, p).replace(/\\/g, "/") || ".";
};

FtpOutputFileSystem.prototype.getFtpOutputPath = function (p) {
  return pathJoin(this.options.path, this.relative(p));
};

FtpOutputFileSystem.prototype.mkdirp = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.mkdirp(path, (err) => err && console.error(err));
  }

  this.client.mkdir(this.getFtpOutputPath(path), true, () => callback());
};

FtpOutputFileSystem.prototype.mkdir = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.mkdir(path, (err) => err && console.error(err));
  }

  this.client.mkdir(this.getFtpOutputPath(path), false, () => callback());
};

FtpOutputFileSystem.prototype.rmdir = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.rmdir(path, (err) => err && console.error(err));
  }

  this.client.rmdir(this.getFtpOutputPath(path), false, callback);
};

FtpOutputFileSystem.prototype.unlink = function (path, callback) {
  if (!this.options._useLocalPath) {
    this.localOutputFileSystem.unlink(path, (err) => err && console.error(err));
  }

  this.client.delete(this.getFtpOutputPath(path), callback);
};

FtpOutputFileSystem.prototype.writeFile = function (
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

  this.client.put(data, this.getFtpOutputPath(file), callback);
};

FtpOutputFileSystem.prototype.join = pathJoin;

module.exports = FtpOutputFileSystem;
