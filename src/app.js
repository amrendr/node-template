var createError = require('http-errors');
var express = require('express');
var httpContext = require('express-http-context');
var path = require('path');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var helmet = require('helmet');
var morgan = require('./service/logger').morgan;
var app_context = require('./middleware/app-context');
var app_locals = require('./middleware/app-locals');

var indexRouter = require('./routes/index');

var app = express();

if (!config.isDevServer) {
  app.use(helmet({
    frameguard: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: null,
        upgradeInsecureRequests: []
      },
      // reportOnly: true
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },
  }));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan);
app.use(express.json());
app.use(compress());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpContext.middleware);
app.use(app_locals);
app.use(app_context);

// anything require httpcontext should be added after this line
app.use(express.static(path.join(__dirname, '../public')));

// Live browser reload for development server to monitor any changes to static and html/pug files.
// Keep livereload code before router setup to work properly.
app.use(require('./middleware/dev_livereload'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = config.isDevServer ? err : { status: err.status };

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
