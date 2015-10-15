/**
 * Created by Michael on 06.09.2015.
 */
var chat = require('../chat');

exports.get = function (req,  res) {
  res.render('chat');
};

exports.post = function(req,res, next){
    var body = '';

    req.on('readable', function(){
        body += req.read();

        if(body.length > 1e4){
            res.statusCode = 413;
            res.end("Message is big");
        }
    }).on('end', function(){
        try {
            body = JSON.parse(body);
        }catch(e){
            res.statusCode = 400;
            res.end("Bad request");
            return
        }

        chat.publish(body.message);
        res.end('ok');
    });
}