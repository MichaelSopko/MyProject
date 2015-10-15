var User = require('models/user').User;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var chat = require('../chat');
var checkAuth = require('middelware/checkAuth');

module.exports = function(app) {

  app.get('/',require('./frontpage').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.get('/registration', require('./registration').get);
  app.post('/registration', require('./registration').post);

  app.get('/chat', checkAuth,require('./chat').get);
  app.post('/chat', require('./chat').post);

  app.get('/subscribe', function(req, res){
    chat.subscribe(req,res);
  });

  app.post('/logout', require('./logout').post);

  app.get('/blog', require('./blog').get);
  app.get('/contact', require('./contact').get);
  app.get('/about', require('./about').get);

  app.get('/users', function (req, res, next) {
    User.find({}, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

  app.get('/users/:id', function (req, res, next) {
    try {
      var id = new ObjectID(req.params.id);
    }catch(e){
      return next(404);
    }

    User.findById(id, function (err, user) {
      if (err)return next(err);
      if (!user) {
        next(new HttpError(404, "User not found"));
      }else {
        res.json(user);
      }
    });
  });
};