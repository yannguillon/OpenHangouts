'use strict';

//var mean = require('meanio');


// library to separate

//function room_exists(rooms, room)
//{
//    return rooms.some(function (obj) {
//        return obj.id === room.id;
//    });
//}

////////////////////////////////////


module.exports = function(io) {

    // experiments > gonna be useful
//    var rooms = [];
//    function Room(id, presenter) {
//        this.id = id;
//        this.presenter = presenter;
//        this.users = [];
//        }
//
//
//    io.on('connection', function(socket) {
//        socket.emit('news', { hello: 'world' });
//        socket.on('my other event', function (data) {
//            console.log(data);
//        });
//
//        socket.on('create', function(presenter) {
//            var room = new Room(new Date().getTime(), presenter);
//            console.log('creating room', room);
//            room.presenter = presenter;
//            rooms.push(room);
//            console.log(rooms);
//            socket.join(room);
//            io.sockets.in(room).emit('message', 'Room created :D');
//        })
//
//
//    });

//
//    var io = require('socket.io').listen(app, {
//        log: true,
//        origins: '*:*'
//    });
//


    var channels = {};

    io.on('connection', function (socket) {
        console.log("connected");
        var initiatorChannel = '';
        if (!io.isConnected) {
            io.isConnected = true;
        }

        socket.on('new-channel', function (data) {
            console.log('new channel');
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }

            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('presence', function (channel) {
            var isChannelPresent = !! channels[channel];
            socket.emit('presence', isChannelPresent);
        });

        socket.on('disconnect', function (channel) {
            if (initiatorChannel) {
                delete channels[initiatorChannel];
            }
        });
    });

    function onNewNamespace(channel, sender) {
        console.log(sender);
        io.of('/' + channel).on('connection', function (socket) {
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }

            socket.on('message', function (data) {
                if (data.sender === sender) {
                    if(!username) username = data.data.sender;

                    socket.broadcast.emit('message', data.data);
                }
            });

            socket.on('disconnect', function() {
                if(username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }
};
