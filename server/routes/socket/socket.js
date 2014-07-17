'use strict';

//var mean = require('meanio');

module.exports = function(io) {

    io.on('connection', function(socket) {
        console.log('socket IO connected');
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};
