/**
 * Created by Michael on 07.09.2015.
 */
var mongoose = require('libs/mongoose');
mongoose.set('debug',true);
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModuls,
    createUsers,
    close
], function(err){
    console.log(arguments);
    mongoose.disconnect();
});

function open(callback){
    mongoose.connection.on('open', callback);
}
function dropDatabase(callback){
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModuls(callback){
    require('models/user');

    async.each(Object.keys(mongoose.models),function(modelName, callbck){
        mongoose.models[modelName].ensureIndexes(callback);
    },callback);
}

function createUsers(callback){

    var users = [
        {username: 'Vasya', password: 'secret'},
        {username: 'Petya', password: 'sec'},
        {username: 'admin', password: 'ret'}
    ];
    async.each(users, function(userData, callback){
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function close(callback){
    mongoose.disconnect(callback);
}