/**
 * Created by Michael on 07.09.2015.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('config');
var log = require('./libs/log')(module);
var HttpError = require('error').HttpError;
var session = require('express-session');
var mongoose = require('libs/mongoose');

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser());

var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({mongoose_connection: mongoose.connection})
}));

app.use(require('middelware/sendHttpError'));
app.use(require('middelware/loadUser'));

require('routes')(app);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    var err = new HttpError(404, 'Not Found');
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        if(typeof err == 'number'){
            err = new HttpError(err);
        }

        if(err instanceof HttpError){
            console.log("http error");
            res.sendHttpError(err);
        }else {
            console.log("server error");
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                status: err.status
            });
        }
    });
}else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

http.createServer(app).listen(config.get('port'), function(){
    log.info('Listening on: '+ config.get('port'));
});
