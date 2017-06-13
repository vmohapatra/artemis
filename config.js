'use strict';

var path = require('path');
//var rootPath = path.normalize(__dirname + '/../..');
var rootPath = path.normalize(__dirname);

var config = {};
//Default to 54321 if no port is provided
config.http_port = parseInt(process.argv[2]) || 54321;
//Defaults to artemis_db as mongo db
config.db_url = 'mongodb://localhost/artemis_db';

config.root = rootPath;

module.exports = config;
