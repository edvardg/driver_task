var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var port        = 8080;
// var superSecret = 'ilovescotchscotchyscotchscotch';

// connect to our database (hosted on modulus.io)
mongoose.connect('mongodb://localhost:27017/driver_task');

// APP CONFIGURATION
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    next();
});

// log all requests to the console
app.use(morgan('dev'));

// basic route for home page
app.get('/', function (req, res) {
    res.send('Welcome to the home page!');
});

var apiRoutes = require('./app/routes/api')(app, express);

// all of out routes will be prefixed with /api
app.use('/api', apiRoutes);

// START THE SERVER
// ==================================
app.listen(port);
console.log('Magic happens on port ' + port);