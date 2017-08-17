var config   = require('../config/config');
var mongoose = require('mongoose');

var connection = mongoose.createConnection(config.dbUri);

module.exports = connection;
