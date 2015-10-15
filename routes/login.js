/**
 * Created by Michael on 06.09.2015.
 */
var User = require('models/user').User;
var async = require('async');
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;
var session = require('express-session');

exports.get = function (req,  res) {
    res.render("login");
};

exports.post = function(req,res,next) {
    var username = req.body.username;
    var password = req.body.password;

    User.autorize(username, password,  function(err, user){
        if(err){
            if(err instanceof AuthError){
                return next(403, err.message);
            }else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    });
};