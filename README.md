## Install

```
npm install ftp-output-webpack-plugin --save-dev
```

## Usage

this plugin will output build assets to which you can specify by the plugin constructor options(recommend) or by webpack `output.path` config option(mainly for backward compatibility), e.g.

for plugin constructor options

```js
module.exports = {
  plugins: [
    new FtpOutputPlugin({
      path: "/", // output path on ftp server
      protocol: "ftp",
      /* other ftp options, see below descriptions */
    }),
  ],
};
```

for webpack `output.path` config option

```js
module.exports = {
  output: {
    path: "/", // output path on ftp server
  },
  plugins: [
    new FtpOutputPlugin({
      /* ftp options */
    }),
  ],
};
```

## Options

### Base Options

| name     | type   | default     | description                                            |
| -------- | ------ | ----------- | ------------------------------------------------------ |
| path     | string | output.path | the path where your assets will be built on ftp server |
| protocol | string | ftp         | ftp or sftp                                            |

### Protocol Specific Options

when you specify ftp protocol, this plugin will use [node-ftp](https://github.com/mscdex/node-ftp) for connections, please see `connect` method on [Methods](https://github.com/mscdex/node-ftp#methods) section of its document

```js
module.exports = {
  plugins: [
    new FtpOutputPlugin({
      // base options
      path: "/",
      protocol: "ftp",
      // protocol options
      host: "127.0.0.1",
      port: 21,
      user: "anonymous",
      password: "anonymous@",
      keepalive: 3000,
    }),
  ],
};
```

you can also specify sftp protocol, and this plugin will use [ssh2-sftp-client](https://github.com/theophilusx/ssh2-sftp-client) for connections, you can also refer to its [connect](https://github.com/mscdex/ssh2#user-content-client-methods) options

```js
module.exports = {
  plugins: [
    new FtpOutputPlugin({
      // base options
      path: "/",
      protocol: "sftp",
      // protocol options
      host: "127.0.0.1",
      port: 22,
      username: "shij",
      password: "xxx",
      keepaliveInterval: 3000,
    }),
  ],
};
```

### Command-Line Options

this plugin also support a `--ftp` command-line flag followed by a url which specifies the connection options, e.g. `ftp://shij:xxx@127.0.0.1:21` for ftp connections or `sftp://shij:xxx@127.0.0.1:22` for sftp connections

command-line options will override constructor options
