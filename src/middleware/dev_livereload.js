var connectLivereload = () => {
  return (req, res, next) => next();
};

if (config.isDevServer) {
  const path = require('path');
  const livereload = require("livereload");

  var liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, '../../public'));

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  connectLivereload = require("connect-livereload");
}

module.exports = connectLivereload();
