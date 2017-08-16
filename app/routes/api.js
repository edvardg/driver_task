/**
 * Created by edvard on 8/16/17.
 */

var express     = require('express');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var config      = require('../config/config');
var Controller  = require('../controllers/controller');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    apiRouter.post('/client', Controller.createClient);
    apiRouter.post('/authenticateClient', Controller.authenticateClient);

    apiRouter.use(function (req, res, next) {
        console.log('Somebody just came to our app!');
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    })
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            })
        }
    });

    apiRouter.get('/', function (req, res) {
        res.json({message: 'welcome to our app!'});
    });

    // Actions with drivers
    apiRouter.post('/driver', Controller.createDriver);
    apiRouter.get('/driver', Controller.getAllDrivers);
    apiRouter.get('/driver/:username', Controller.getOneDriver);
    apiRouter.patch('/driver/:username/release', Controller.releaseDriver);

    // Actions with clients
    apiRouter.patch('/client/:username/reserveDriver', Controller.reserveDriver);
    apiRouter.get('/client', Controller.getAllClients);
    apiRouter.get('/client/:username', Controller.getOneClient);

    return apiRouter;
};
