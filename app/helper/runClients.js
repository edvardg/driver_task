var request = require('request');

var runClient = function (clientName, password, callback) {
    var authUrl = 'http://localhost:3000/api/authenticateClient';
    var authOptions = {
        url: authUrl,
        method: 'POST',
        form: {
            username: clientName,
            password: password
        },
        'json': true
    };
    request(authOptions, function (error, response, body) {
        if (error) {
            console.log('Failed to authenticate: ' + JSON.stringify(error));
            return callback({success: false, err: {message: 'Failed to authenticate: ' + JSON.stringify(error)}});
        }
        if (!body.success) {
            return callback({success: false, err: {message: 'Failed to authenticate'}});
        }
        var token = body.result.token;

        var reserveUrl = 'http://localhost:3000/api/client/' + clientName + '/reserveDriver';
        var reserveOptions = {
            url: reserveUrl,
            method: 'PATCH',
            headers: {
                'x-access-token': token
            },
            'json': true
        };
        request(reserveOptions, function (error, response, body) {
            if (error) {
                console.log('Failed to reserve a driver: ' + JSON.stringify(error));
                return callback({success: false, err: {message: 'Failed to reserve a driver: ' + JSON.stringify(error)}});;
            }
            if (!body.success) {
                console.log('Failed to reserve a driver');
                return callback({success: false, err: {message: 'Failed to reserve a driver'}});
            }
            console.log('A driver is reserved');
            console.log(body);
            return callback({success: true, result: {message: 'OK', driver: body.result.driver, token: token}})
        });
    })
};

runClient('client0', '123456', function (response) {
    console.log(response);
    if (!response.success) {
        console.log(response.err);
        return;
    }
    setTimeout(function () {
        var releaseeUrl = 'http://localhost:3000/api//driver/' + response.result.driver.username + '/release';
        var releaseOptions = {
            url: releaseeUrl,
            method: 'PATCH',
            headers: {
                'x-access-token': response.result.token
            },
            'json': true
        };
        request(releaseOptions, function (error, response, body) {
            if (error) {
                console.log('Failed to release a driver: ' + JSON.stringify(error));
                return ;
            }
            if (!body.success) {
                console.log('Failed to release a driver');
                return ;
            }
            console.log('A driver is released');
            console.log(body);
        });
    }, 10000)
});