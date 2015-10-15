/**
 * Created by Michael on 17.09.2015.
 */
var HttpError = require('error').HttpError;

module.exports = function(req, res, next){
    if(!req.session.user){
        return next(new HttpError(401, 'You are not authorised'));
    }

    next();
};