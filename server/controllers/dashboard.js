/**
 * Created by Quentin on 20/07/14.
 */


var mean = require('meanio');

exports.render = function(req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('dashboard', {
        user: req.user ? {
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            roles: req.user.roles
        } : {}
    });
};