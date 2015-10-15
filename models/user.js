/**
 * Created by Michael on 04.09.2015.
 */
var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._plainPassword;
    });

schema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.autorize = function(username, password, callback){
    var User = this;

    async.waterfall([
        function (callback) {
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if (user) {
                console.log("found");
                if (user.checkPassword(password)) {
                    console.log("passnorm");
                    callback(null, user);
                } else {
                    callback(new AuthError('Password not right'));
                }
            }else {
                console.log("not found");
                callback(new AuthError('User not found or Password not right'));
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);


function AuthError(message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);
    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;