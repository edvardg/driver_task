var jwt      = require('jsonwebtoken');
var config   = require('../config/config');
var Driver   = require('../models/driver');
var Client   = require('../models/client');

function Manager() {

    this.authenticateClient = function (req, callback) {
        // find the client
        // select the username and password explicitly
        Client.findOne({
            username: req.body.username
        }).select('username password').exec(function (err, client) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            // no client with that username was found
            if (!client) {
                return callback({ success: false, code: 404, err: {message: "Authentication failed. Client not found!"}});
            }
            // check if password matches
            var validPassword = client.comparePassword(req.body.password);
            if (!validPassword) {
                return callback({ success: false, code: 404, err: {message: "Authentication failed. Wrong password!"}});
            } else {
                // if client is found and password is right
                // create a token

                var token = jwt.sign({
                    username: client.username
                }, config.secret, {
                    expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                return callback({
                    success: true,
                    code: 200,
                    result: {
                        message: 'Enjoy your token!',
                        token: token
                    }
                })
            }
        })
    };

    this.createDriver = function (req, callback) {
        var driver = new Driver();
        driver.username = req.body.username;
        driver.reserved = JSON.parse(req.body.reserved);
        driver.location = JSON.parse(req.body.location);

        driver.save(function (err) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            callback({seccess: true, code: 200, result: {message: 'Driver created!'}});
        });
    };
    
    this.getAllDrivers = function (req, callback) {
        Driver.find(function (err, drivers) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            callback({seccess: true, code: 200, result: {message: 'OK', drivers: drivers}});
        })
    };

    this.getOneDriver = function (req, callback) {
        Driver.findOne({username: req.params.username}, function (err, driver) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            if (!driver) {
                return callback({ success: false, code: 404, err: {message: "Driver not found!"}});
            }
            callback({seccess: true, code: 200, result: {message: 'OK', driver: driver}});
        })
    };

    this.reserveDriver = function (req, callback) {
        Client.findOne({username: req.params.username}, function (err, client) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            if (!client) {
                return callback({ success: false, code: 404, err: {message: "Client not found!"}});
            }
            var findQuery = { reserved: false, location: { $near: client.location } };
            var updateQuery = { reserved: true };
            Driver.findOneAndUpdate(findQuery, updateQuery, function(err, driver){
                if (err) {
                    return callback({ success: false, code: 500, err: err});
                }
                if (!driver) {
                    return callback({ success: false, code: 404, err: {message: "Driver not found!"}});
                }
                return callback({success: true, code: 200, result: {message: "Driver " + driver.username + " is reserved!", driver: driver}});
            });
        });
    };

    this.releaseDriver = function (req, callback) {
        var findQuery = { username: req.params.username };
        var updateQuery = { reserved: false };
        Driver.findOneAndUpdate(findQuery, updateQuery, function(err, driver){
            if (err) {
                return callback({ success: false, code: 500, err: err});
            }
            if (!driver) {
                return callback({ success: false, code: 404, err: {message: "Driver not found!"}});
            }
            return callback({success: true, code: 200, result: {message: "Driver " + driver.username + " is released!"}});
        });
    };

    this.createClient = function (req, callback) {
        var client = new Client();

        client.username = req.body.username;
        client.password = req.body.password;
        client.location = JSON.parse(req.body.location);

        client.save(function (err) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            return callback({seccess: true, code: 200, result: {message: 'Client created!'}});
        });
    };

    this.getAllClients = function (req, callback) {
        Client.find(function (err, clients) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            callback({seccess: true, code: 200, result: {message: 'OK', clients: clients}});
        })
    };

    this.getOneClient = function (req, callback) {
        Client.findOne({username: req.params.username}, function (err, client) {
            if (err) {
                return callback({seccess: false, code: 500, err: err});
            }
            if (!client) {
                return callback({ success: false, code: 404, err: {message: "Client not found!"}});
            }
            callback({seccess: true, code: 200, result: {message: 'OK', client: client}});
        })
    }
}

module.exports.Manager = Manager;
