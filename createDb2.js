/**
 * Created by Michael on 15.09.2015.
 */
var mongoose = require('mongoose');


var db = mongoose.createConnection('localhost','mytestDb', 27017, {poolsize:2});

//var db = mongoose.connection;

db.once('open', function () {
    console.log('connected');
});
