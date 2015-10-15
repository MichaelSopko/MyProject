/**
 * Created by Michael on 17.09.2015.
 */
exports.post = function(req,res){
    req.session.destroy();
    res.redirect('/');
};