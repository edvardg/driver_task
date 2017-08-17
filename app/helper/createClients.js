var Client = require('../models/client');

var createClient = function (count) {
    var namePrefix = 'client';
    for (var i = 0; i < count; ++i) {
        var clientName = namePrefix + i;
        var client = new Client();
        client.username = clientName;
        client.password = '123456';
        client.location = [getRandomArbitrary(), getRandomArbitrary()];

        client.save(function (err) {
            if (err) {
                console.log('Error when creating clients: ' + JSON.stringify(err));
                return;
            }
            console.log('A new client is successfuly created');
        });
    }
};

var getRandomArbitrary = function () {
    var min = 35, max = 55;
    return JSON.parse((Math.random() * (max - min) + min).toPrecision(5));
};

createClient(10);