const httpContext = require('express-http-context');
const mn = require('morgan');
const clientip = require('./clientip');

mn.token('trace-id', function (req, res) { return httpContext.get('x-trace-id'); });
mn.token('client-address', function (req, res) { return clientip.getClientIP(req) || ''; });

function prod(tokens, req, res) {
  var log_data = {
    'type': 'App',
    'traceId': tokens['trace-id'](req, res),
    'remote-address': tokens['remote-addr'](req, res),
    'client-address': tokens['client-address'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': 'HTTP/' + tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'response-time': tokens['response-time'](req, res) + ' ms',
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res)
  };

  return JSON.stringify(log_data);
}

function local(tokens, req, res) {
  var status = res.statusCode;

  // get status color
  var color = status >= 500 ? 31 // red
    : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
          : 0; // no color

  return [
    tokens.method(req, res),
    `\x1b[${color}m` + tokens.status(req, res) + '\x1b[0m',
    tokens['response-time'](req, res).padStart(7, ' '), 'ms',
    ('' + (tokens.res(req, res, 'content-length') || '')).padStart(4, ' '), '-',
    tokens['trace-id'](req, res), truncate(tokens.url(req, res), 75)
  ].join(' ');
}

function truncate(str, n) {
  return str && (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

var morgan = config.isDevServer ? mn(local) : mn(prod);

var logger = {
  info(message) {
    log('Info', message);
  },
  error(message) {
    log('Error', message);
  },
  warn(message) {
    log('Warn', message);
  }
};

function log(type, message) {
  var data = {
    type,
    traceId: httpContext.get('x-trace-id'),
    message: message,
    time: (new Date()).toISOString()
  };
  if (config.isDevServer) {
    console.dir(data, { showHidden: false, depth: null, colors: true });
  } else {
    console.log(JSON.stringify(data));
  }
}


module.exports = logger;
module.exports.morgan = morgan;
