var Manager = require('../services/manager').Manager;

var m = new Manager();

var controller = {

    authenticateClient: function (req, res) {
        m.authenticateClient(req, function (result) {
            return res.status(result.code).send(result);
        });
    },

    reserveDriver: function(req, res) {
        m.reserveDriver(req, function (result) {
            return res.status(result.code).send(result);
        });
    },

    createDriver: function(req, res) {
        m.createDriver(req, function (result) {
            return res.status(result.code).send(result);
        });
    },

    getAllDrivers: function (req, res) {
        m.getAllDrivers(req, function (result) {
            return res.status(result.code).send(result);
        });
    },

    getOneDriver: function (req, res) {
        m.getOneDriver(req, function (result) {
            return res.status(result.code).send(result);
        });
    },

    releaseDriver: function (req, res) {
        m.releaseDriver(req, function (result) {
            return res.status(result.code).send(result);
        })
    },

    createClient: function (req, res) {
        m.createClient(req, function (result) {
            return res.status(result.code).send(result);
        })
    },

    getAllClients: function (req, res) {
        m.getAllClients(req, function (result) {
            return res.status(result.code).send(result);
        })
    },

    getOneClient: function (req, res) {
        m.getOneClient(req, function (result) {
            return res.status(result.code).send(result);
        });
    }
};

module.exports = controller;
