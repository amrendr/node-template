const httpContext = require('express-http-context');
const uuid = require('uuid');
const contextCookieName = 'x-trace-id';

function setContext(req, res) {
  // check if client sent cookie
  var contextCookie = req.cookies[contextCookieName] || uuid.v4();
  
  // Set a call-trace tracker id with a rolling life of 1hr
  res.cookie(contextCookieName, contextCookie, { maxAge: 60 * 60 * 1000, httpOnly: true, domain: req.hostname });

  httpContext.set(contextCookieName, contextCookie);
}

module.exports = function (req, res, next) {
  setContext(req, res);
  next();
};
