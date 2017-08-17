var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');
var connection  = require('../db/connection');

var ClientSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false},
    location: {type: [Number], required: true, index: '2d'}
});

ClientSchema.pre('save', function (next) {
    var client = this;
    if (!client.isModified('password')) {
        return next();
    }
    bcrypt.hash(client.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        client.password = hash;
        next();
    });
});

ClientSchema.methods.comparePassword = function (password) {
    var client = this;
    return bcrypt.compareSync(password, client.password);
};

module.exports = connection.model('Client', ClientSchema, 'clients');