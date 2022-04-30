
var configData = require('./app.config.json');
var version = require('../package.json').version;

var data = {};

data.isDevServer = process.env.APP_RUN_ENV === 'dev';
data.isStgServer = process.env.APP_RUN_ENV === 'stage';
data.isProdServer = process.env.APP_RUN_ENV === 'prod';

data = { ...data, ...configData[process.env.APP_RUN_ENV] };
data.appVersion = version;

module.exports = data;
