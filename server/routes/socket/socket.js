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
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }
            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('new-custom-channel', function (data) {
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
                onNewNamespaceCustom(data.channel, data.sender);
            }
            channels[data.channel] = data.channel;
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

//        socket.on('setPresenter', function(userid){
//            console.log("presenter switch");
//            socket.emit('presenterGiven');
//        });

    });


    function onNewNamespaceCustom(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            socket.on('setPresenter', function(userid){
                socket.broadcast.emit('presenterGiven', userid.id);
            });
        });
    }

    function onNewNamespace(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            console.log(sender+" connected to room : "+ channel);
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }

//            socket.on('setPresenter', function(userid){
//                console.log('presentouse will be ' + userid.id);
//                      //              socket.broadcast.emit('myreturn', userid.id);
//            });




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
//};
//
//    function inArray(value, array) {
//      for (var i = 0; i < array.length; i++) {
//        if (array[i] == value)
//            return true;
//      }
//      return false;
//    }
//
//
//    var usersRooms = {};
//
//    io.on('connection', function (socket) {
//        socket.on('message', function (data) {
//            if (!usersRooms[data.sender]){
//                usersRooms[data.sender] = new Array(data.channel);
//            }else if (!inArray(data.channel, usersRooms[data.sender])){
//                (usersRooms[data.sender]).push(data.channel);
//            }
//
//            console.log(usersRooms);
//            console.log(data);
//            console.log("TA MERE LE CHANNEL = " + data.channel + " called by " + data.username);
//
//            for (var i = 0; i < usersRooms[data.sender].length; i++){
//                socket.join(usersRooms[data.sender][i]);
//                socket.broadcast.to(usersRooms[data.sender][i]).emit('message', data);
//            }
//
////            if (channels[data.channel])
////            {
////
////            }
////            socket.broadcast.emit('message', data);
////            socket.leave(data.channel);
//        });
//    });

}
