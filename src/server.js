#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('dotenv').config();
global.config = require('./app.config');
global.logger = require('./service/logger');

var app = require('./app');
var debug = require('debug')('node-template:server');
var http = require('http');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof error.port === 'string'
    ? 'Pipe ' + error.port
    : 'Port ' + error.port;

  bind = "host " + error.address + ", " + bind;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = this.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info(`Listening on host: ${addr.address}, ${bind}`);
}

/**
 * Get port from environment and store in Express.
 * Create HTTP server.
 * Listen on provided port, on all network interfaces.
 */

var port = normalizePort(process.env.PORT || '3000');

var servers = [];

var hosts = [{ host: null, port: port }];

hosts.forEach(addr => {
  app.set('port', addr.port);
  var server = http.createServer(app);
  server.listen(addr.port, addr.host);
  server.on('error', onError);
  server.on('listening', onListening);
  servers.push(server);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  servers.forEach(server => {
    server.close(() => {
      debug('HTTP server closed');
    });
  });
});
