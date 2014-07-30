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
//
//
    var channels = {};
    var self = this;

    io.on('connection', function (socket) {
        var initiatorChannel = '';
        if (!io.isConnected) {
            io.isConnected = true;
            socket.emit('connect', true);
        }

        socket.on('new-channel', function (data) {
            console.log(data.sender+' connected to channel : '+data.channel);
            if (!channels[data.channel]) {
                console.log('[ '+data.channel+' ] is set as the initiator(main) channel');
                initiatorChannel = data.channel;
            }
            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });


//        socket.on('new-channel', function (data) {
//            console.log('rerouting to channel: ' + data.channel);
//            onNewNamespace(data.channel, data.sender);
//        });

        socket.on('message', function (data) {
                socket.broadcast.emit('message', data.data);
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
        io.of('/' + channel).on('connection', function (socket) {
            console.log(sender+" connected to room : "+ channel);
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }
            console.log('<====================8 ON New Channel 8=========================D');

             socket.on('setPresenter', function(userid){
                console.log('presentouse will be ' + userid.id);
                                    socket.broadcast.emit('myreturn', userid.id);

            });

            socket.on('setPresenter', function(userid){
                console.log("presenter switch");
                socket.emit('presenterGiven');
            });


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

//    io.sockets.on('connection', function (socket) {
//        socket.on('message', function (data) {
//            socket.broadcast.emit('message', data);
//        });
//    });
//
//}
