var forwarded_for = require('forwarded-for');

function getClientInfo(req) {
  return JSON.stringify(forwarded_for(req, req.headers));
}

function getClientIP(req) {
  return forwarded_for(req, req.headers).ip;
}

exports.getClientIP = getClientIP;
exports.getClientInfo = getClientInfo;
