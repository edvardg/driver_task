var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var DriverSchema = new Schema({
    username: {type: String, required: true, index: {unique: 1}},
    location: {type: [Number], required: true, index: '2d'},
    reserved: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('Driver', DriverSchema, 'drivers');