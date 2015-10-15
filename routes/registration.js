/**
 * Created by Michael on 15.09.2015.
 */
/**
 * Created by Michael on 06.09.2015.
 */
var User = require('models/user').User;
var async = require('async');
var HttpError = require('error').HttpError;

exports.get = function (req,  res) {
    res.render("registration");
};

exports.post = function(req,res,next) {
    var username = req.body.login;
    var password = req.body.password;

    async.waterfall([
        function (callback) {
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if (!user) {
                console.log("not found");
                var user = new User({username: username, password: password});
                user.save(function (err) {
                    console.log("save");
                    if (err) return next(err);
                });
                callback(null, user);
            } else {
                console.log("found");
                next(new HttpError(403, 'User is Already exists'));
            }

        }
    ], function (err, user) {
        console.log("2");
        if (err) return next(err);
        req.session.user = user._id;
        res.send({});
    });
};