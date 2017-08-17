var Driver = require('../models/driver');

var createDriver = function (count) {
    var namePrefix = 'driver';
    for (var i = 0; i < count; ++i) {
        var driverName = namePrefix + i;
        var driver = new Driver();
        driver.username = driverName;
        driver.reserved = false;
        driver.location = [getRandomArbitrary(), getRandomArbitrary()];

        driver.save(function (err) {
            if (err) {
                console.log('Error when creating drivers: ' + JSON.stringify(err));
                return;
            }
            console.log('A new driver is successfuly created');
        });
    }
};

var getRandomArbitrary = function () {
    var min = 35, max = 55;
    return JSON.parse((Math.random() * (max - min) + min).toPrecision(5));
};

createDriver(100);