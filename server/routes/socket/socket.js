'use strict';

module.exports = function(io) {
    var channels = {};

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


    function onNewNamespaceCustom(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            socket.on('setPresenter', function(userid){
                socket.broadcast.emit('presenterGiven', userid.id);
            });
            socket.on('notifyNewPresenter', function(id){
                socket.broadcast.emit('newPresenterSet', id);
            });
        });
    }

    function onNewNamespace(channel, sender) {
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
